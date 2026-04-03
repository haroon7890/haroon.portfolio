export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureError } from "@/lib/monitoring";
import {
  MAX_ATTACHMENT_BYTES,
  isAllowedAttachmentType,
  isSafeMessage,
  isValidEmail,
  normalizeText,
} from "@/lib/validation";

type ContactPayload = {
  name: string;
  email: string;
  topic: string;
  budget: string;
  timeline: string;
  message: string;
  company: string;
  formStartedAt: string;
};

function getContactPayloadFromJson(body: unknown): ContactPayload {
  const safeBody = (body ?? {}) as Record<string, unknown>;
  return {
    name: normalizeText(typeof safeBody.name === "string" ? safeBody.name : "", 120),
    email: normalizeText(typeof safeBody.email === "string" ? safeBody.email : "", 200),
    topic: normalizeText(typeof safeBody.topic === "string" ? safeBody.topic : "", 120),
    budget: normalizeText(typeof safeBody.budget === "string" ? safeBody.budget : "", 120),
    timeline: normalizeText(typeof safeBody.timeline === "string" ? safeBody.timeline : "", 120),
    message: normalizeText(typeof safeBody.message === "string" ? safeBody.message : "", 5000),
    company: normalizeText(typeof safeBody.company === "string" ? safeBody.company : "", 120),
    formStartedAt: normalizeText(typeof safeBody.formStartedAt === "string" ? safeBody.formStartedAt : "", 80),
  };
}

function getContactPayloadFromFormData(formData: FormData): ContactPayload {
  return {
    name: normalizeText(formData.get("name"), 120),
    email: normalizeText(formData.get("email"), 200),
    topic: normalizeText(formData.get("topic"), 120),
    budget: normalizeText(formData.get("budget"), 120),
    timeline: normalizeText(formData.get("timeline"), 120),
    message: normalizeText(formData.get("message"), 5000),
    company: normalizeText(formData.get("company"), 120),
    formStartedAt: normalizeText(formData.get("formStartedAt"), 80),
  };
}

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const accept = req.headers.get("accept") ?? "";
  const wantsHtml = accept.includes("text/html");

  const limit = checkRateLimit({
    key: `contact:${ip}`,
    limit: 8,
    windowMs: 30 * 60 * 1000,
  });

  if (!limit.allowed) {
    if (wantsHtml) {
      const url = new URL("/", req.url);
      url.searchParams.set("contact", "error");
      url.hash = "contact";
      return NextResponse.redirect(url, 303);
    }

    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";
    const isHtmlFormSubmission = wantsHtml && contentType.includes("multipart/form-data");

    let payload: ContactPayload;
    let attachment: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      payload = getContactPayloadFromFormData(formData);
      const maybeAttachment = formData.get("attachment");
      attachment = maybeAttachment instanceof File ? maybeAttachment : null;
    } else {
      const body = await req.json();
      payload = getContactPayloadFromJson(body);
    }

    if (payload.company) {
      // Honeypot field should stay empty for real users.
      if (isHtmlFormSubmission) {
        const url = new URL("/", req.url);
        url.searchParams.set("contact", "success");
        url.hash = "contact";
        return NextResponse.redirect(url, 303);
      }

      return NextResponse.json({ success: true });
    }

    if (!payload.name || !payload.email || !payload.message) {
      if (isHtmlFormSubmission) {
        const url = new URL("/", req.url);
        url.searchParams.set("contact", "error");
        url.hash = "contact";
        return NextResponse.redirect(url, 303);
      }

      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const topic = payload.topic || "general";
    const budget = payload.budget || "unspecified";
    const timeline = payload.timeline || "unspecified";

    if (!isValidEmail(payload.email)) {
      if (isHtmlFormSubmission) {
        const url = new URL("/", req.url);
        url.searchParams.set("contact", "error");
        url.hash = "contact";
        return NextResponse.redirect(url, 303);
      }

      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!isSafeMessage(payload.message)) {
      if (isHtmlFormSubmission) {
        const url = new URL("/", req.url);
        url.searchParams.set("contact", "error");
        url.hash = "contact";
        return NextResponse.redirect(url, 303);
      }

      return NextResponse.json({ error: "Message must be between 10 and 5000 characters." }, { status: 400 });
    }

    if (payload.formStartedAt) {
      const startedAt = Number(payload.formStartedAt);
      if (!Number.isNaN(startedAt)) {
        const elapsed = Date.now() - startedAt;
        if (elapsed < 1500) {
          if (isHtmlFormSubmission) {
            const url = new URL("/", req.url);
            url.searchParams.set("contact", "error");
            url.hash = "contact";
            return NextResponse.redirect(url, 303);
          }

          return NextResponse.json({ error: "Submission failed anti-spam checks." }, { status: 400 });
        }
      }
    }

    let attachments:
      | {
          filename: string;
          content: Buffer;
          contentType: string;
        }[]
      | undefined;

    if (attachment && attachment.size > 0) {
      if (attachment.size > MAX_ATTACHMENT_BYTES) {
        if (isHtmlFormSubmission) {
          const url = new URL("/", req.url);
          url.searchParams.set("contact", "error");
          url.hash = "contact";
          return NextResponse.redirect(url, 303);
        }

        return NextResponse.json({ error: "Attachment exceeds 5MB limit." }, { status: 400 });
      }

      if (!isAllowedAttachmentType(attachment)) {
        if (isHtmlFormSubmission) {
          const url = new URL("/", req.url);
          url.searchParams.set("contact", "error");
          url.hash = "contact";
          return NextResponse.redirect(url, 303);
        }

        return NextResponse.json({ error: "Attachment type is not allowed." }, { status: 400 });
      }

      attachments = [
        {
          filename: attachment.name,
          content: Buffer.from(await attachment.arrayBuffer()),
          contentType: attachment.type,
        },
      ];
    }

    // Configure your SMTP transporter (Gmail example)
    const fromAddress = process.env.EMAIL_USER;
    const toAddress = process.env.CONTACT_TO ?? process.env.EMAIL_USER;

    if (!fromAddress || !toAddress) {
      return NextResponse.json({ error: "Email transport is not configured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: fromAddress, // Set in .env.local
        pass: process.env.EMAIL_PASS, // Set in .env.local
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });

    const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
      let timeoutId: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      });

      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };


    const mailResult = await withTimeout(
      transporter.sendMail({
      from: `Portfolio Contact <${fromAddress}>`,
      to: toAddress,
      subject: `Portfolio Contact: ${payload.name} | ${topic}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Topic: ${topic}`,
        `Budget: ${budget}`,
        `Timeline: ${timeline}`,
        "",
        "Message:",
        payload.message,
      ].join("\n"),
      replyTo: payload.email,
      attachments,
      }),
      15_000,
      "sendMail"
    );
    console.log("[Contact API] Mail sent result:", mailResult);

    if (isHtmlFormSubmission) {
      const url = new URL("/", req.url);
      url.searchParams.set("contact", "success");
      url.hash = "contact";
      return NextResponse.redirect(url, 303);
    }

    return NextResponse.json({
      success: true,
      deliveryId: mailResult.messageId,
      mailResult: process.env.NODE_ENV === "production" ? undefined : mailResult,
    });
  } catch (error) {
    // Extra error logging for debugging
    console.error("[Contact API] Mail send error:", error);
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.error("[Contact API] EMAIL_USER and EMAIL_PASS are set.");
    } else {
      console.error("[Contact API] EMAIL_USER or EMAIL_PASS is missing.");
    }
    const errorId = captureError({
      scope: "contact_api",
      error,
    });

    if (wantsHtml) {
      const url = new URL("/", req.url);
      url.searchParams.set("contact", "error");
      url.hash = "contact";
      return NextResponse.redirect(url, 303);
    }

    return NextResponse.json({ error: "Failed to send message", errorId, debug: String(error) }, { status: 500 });
  }
}
