export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/lib/projects";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureError } from "@/lib/monitoring";

type KnowledgeItem = {
  title: string;
  summary: string;
  url: string;
  sourceType: "project";
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function scoreMatch(query: string, item: KnowledgeItem): number {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) {
    return 0;
  }

  const itemTokens = new Set(tokenize(`${item.title} ${item.summary}`));
  let score = 0;

  for (const token of queryTokens) {
    if (itemTokens.has(token)) {
      score += 1;
    }
  }

  return score;
}

function buildKnowledgeBase(): KnowledgeItem[] {
  return getAllProjects().map((project) => ({
    title: project.title,
    summary: `${project.summary} Stack: ${project.stack.join(", ")}. Impact: ${project.impact.join(" ")}`,
    url: `/projects/${project.slug}`,
    sourceType: "project" as const,
  }));
}

function buildAssistantReply(question: string, matches: KnowledgeItem[]): string {
  const normalized = question.toLowerCase();

  if (normalized.includes("book") || normalized.includes("call") || normalized.includes("meeting")) {
    return "You can book a call directly from the booking section on the homepage. If you share your project goals, I can also suggest which case study is most relevant before you book.";
  }

  if (normalized.includes("contact") || normalized.includes("hire")) {
    return "Use the contact form with topic, budget, and timeline so Haroon can respond with a focused plan. You can also attach a brief or requirement file to speed up scoping.";
  }

  if (matches.length === 0) {
    return "I could not find a direct match in the current project knowledge base. Try asking about supply chain optimization, AI portfolio architecture, APMS, C++ OOP, or booking/contact workflow.";
  }

  const top = matches.slice(0, 3);
  const bullets = top.map((item) => `- ${item.title}: ${item.summary}`).join("\n");

  return [
    "Based on the portfolio knowledge base, these are the most relevant items:",
    bullets,
    "If you want, ask me for architecture details, stack decisions, implementation tradeoffs, or business impact for any one of these.",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";

  const limit = checkRateLimit({
    key: `assistant:${ip}`,
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many assistant requests. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json()) as { question?: string };
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question || question.length < 2 || question.length > 1000) {
      return NextResponse.json({ error: "Please send a valid question." }, { status: 400 });
    }

    const knowledge = buildKnowledgeBase();
    const matches = knowledge
      .map((item) => ({ item, score: scoreMatch(question, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    const answer = buildAssistantReply(question, matches);

    return NextResponse.json({
      answer,
      sources: matches.slice(0, 3),
    });
  } catch (error) {
    const errorId = captureError({
      scope: "assistant_api",
      error,
    });

    return NextResponse.json(
      { error: "Assistant is temporarily unavailable.", errorId },
      { status: 500 }
    );
  }
}
