import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureError } from "@/lib/monitoring";
import { isValidEmail } from "@/lib/validation";

// Mailchimp API endpoint and env vars
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const DATACENTER = MAILCHIMP_API_KEY?.split("-")[1];

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";

  const limit = checkRateLimit({
    key: `newsletter:${ip}`,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Send to Mailchimp
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !DATACENTER) {
      return NextResponse.json({ error: "Mailchimp not configured." }, { status: 500 });
    }
    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    const mcRes = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `apikey ${MAILCHIMP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed"
      }),
    });
    if (mcRes.status === 200 || mcRes.status === 201) {
      return NextResponse.json({ success: true });
    } else {
      const error = await mcRes.json();
      // Handle "already subscribed" as success
      if (error.status === 400 && error.detail?.includes("already a list member")) {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }

      return NextResponse.json({ error: error.detail || error.title || "Failed to subscribe." }, { status: 500 });
    }
  } catch (error) {
    const errorId = captureError({ scope: "newsletter_api", error });
    return NextResponse.json({ error: "Failed to subscribe.", errorId }, { status: 500 });
  }
}
