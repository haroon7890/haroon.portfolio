export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/lib/projects";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureError } from "@/lib/monitoring";
import { getProfileKnowledge } from "@/lib/profile";

type KnowledgeItem = {
  title: string;
  summary: string;
  category: string;
  role: string;
  timeline: string;
  stack: string[];
  problem: string;
  approach: string[];
  impact: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  url: string;
  sourceType: "project";
};

type AssistantIntent =
  | "greeting"
  | "intro"
  | "benefits"
  | "services"
  | "capabilities"
  | "contact"
  | "booking"
  | "availability"
  | "education"
  | "links"
  | "skills"
  | "projects"
  | "unknown";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "you",
  "about",
  "tell",
  "show",
  "give",
  "most",
  "more",
  "some",
  "into",
  "over",
  "what",
  "which",
  "when",
  "where",
  "how",
  "why",
  "can",
  "could",
  "should",
  "would",
  "does",
  "did",
  "done",
]);

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/c\+\+/g, "cplusplus")
    .replace(/c#/g, "csharp")
    .replace(/node\.js/g, "nodejs")
    .replace(/next\.js/g, "nextjs")
    .replace(/tailwind\s+css/g, "tailwindcss")
    .replace(/postgre\s*sql/g, "postgresql")
    .replace(/mongo\s*db/g, "mongodb");
}

function detectIntent(question: string): AssistantIntent {
  const q = normalizeText(question);

  if (/\b(hi|hello|hey|assalam|salam)\b/.test(q)) return "greeting";

  if (
    q.includes("who is haroon") ||
    q.includes("who is") ||
    q.includes("introduce") ||
    q.includes("intro") ||
    q.includes("tell me about haroon") ||
    q.includes("about haroon") ||
    q.includes("about you")
  ) {
    return "intro";
  }

  if (
    q.includes("benefit") ||
    q.includes("benefits") ||
    q.includes("what do i get") ||
    q.includes("what can i get") ||
    q.includes("why this website") ||
    q.includes("why this web") ||
    q.includes("from this website") ||
    q.includes("from this web")
  ) {
    return "benefits";
  }

  if (
    q.includes("type of web") ||
    q.includes("type of website") ||
    q.includes("kind of website") ||
    q.includes("what websites do you make") ||
    q.includes("what website do you make") ||
    q.includes("what web do you make") ||
    q.includes("which type of web")
  ) {
    return "services";
  }

  if (
    q.includes("what can you do") ||
    q.includes("help") ||
    q.includes("how do you work") ||
    q.includes("how can you")
  ) {
    return "capabilities";
  }

  if (q.includes("book") || q.includes("call") || q.includes("meeting") || q.includes("schedule")) {
    return "booking";
  }

  if (q.includes("contact") || q.includes("hire") || q.includes("work together") || q.includes("email")) {
    return "contact";
  }

  if (q.includes("available") || q.includes("availability") || q.includes("freelance")) {
    return "availability";
  }

  if (q.includes("education") || q.includes("university") || q.includes("umt") || q.includes("bscs")) {
    return "education";
  }

  if (q.includes("github") || q.includes("linkedin") || q.includes("links") || q.includes("social")) {
    return "links";
  }

  if (
    q.includes("skills") ||
    q.includes("stack") ||
    q.includes("tech") ||
    q.includes("technologies") ||
    q.includes("tools")
  ) {
    return "skills";
  }

  if (q.includes("project") || q.includes("case study") || q.includes("portfolio")) {
    return "projects";
  }

  return "unknown";
}

function buildBenefitsReply(): string {
  const profile = getProfileKnowledge();
  return [
    "Here’s what you can get from this website:",
    "- A clear overview of Haroon (skills, background, and what he builds).",
    "- Real case studies showing stack choices, problems solved, and measurable impact.",
    "- A fast way to contact Haroon with the right details (topic, budget, timeline).",
    "- A booking option if you want a quick call.",
    "- This AI assistant to help you find the most relevant project fast.",
    "",
    `If you want to hire Haroon, the best next step is: send a short brief + your timeline (Haroon is currently: ${profile.availability}).`,
  ].join("\n");
}

function buildServicesReply(knowledge: KnowledgeItem[]): string {
  const profile = getProfileKnowledge();
  const categories = Array.from(new Set(knowledge.map((k) => k.category).filter(Boolean))).sort();

  const examples = knowledge
    .slice()
    .sort((a, b) => (b.impact?.length ?? 0) - (a.impact?.length ?? 0))
    .slice(0, 3)
    .map((k) => `- ${k.title} (${k.category}) — ${k.summary}`);

  return [
    "Haroon builds production-ready web apps (design + frontend + backend), and can add AI/automation where it helps.",
    "",
    "Common types of work:",
    "- Portfolio/landing pages that convert (SEO + fast performance + contact/booking).",
    "- Enterprise dashboards and internal tools (KPIs, roles, analytics).",
    "- Full-stack platforms (auth, APIs, databases, admin workflows).",
    "- EdTech-style apps (roadmaps, matching, progress tracking).",
    "- API + database systems and integrations (email/newsletter, etc.).",
    "",
    categories.length ? `Case study categories currently shown here: ${categories.join(", ")}.` : "",
    examples.length ? ["Examples from this portfolio:", ...examples].join("\n") : "",
    "",
    `Core specialties: ${profile.specialties.join(", ")}.`,
    "Tell me what you want to build and your timeline, and I’ll recommend the closest case study.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildProfileReply(intent: AssistantIntent): string | null {
  const profile = getProfileKnowledge();

  if (intent === "intro") {
    return [
      `${profile.name} — ${profile.headline}`,
      profile.shortIntro,
      "",
      "What Haroon does:",
      ...profile.about.map((line) => `- ${line}`),
      "",
      `Education: ${profile.education}`,
      `Availability: ${profile.availability}`,
    ].join("\n");
  }

  if (intent === "education") {
    return `Education: ${profile.education}`;
  }

  if (intent === "availability") {
    return `Availability: ${profile.availability}`;
  }

  if (intent === "links") {
    const lines: string[] = ["Links:"];
    if (profile.contact.github) lines.push(`- GitHub: ${profile.contact.github}`);
    if (profile.contact.linkedin) lines.push(`- LinkedIn: ${profile.contact.linkedin}`);
    if (profile.contact.bookingUrl) lines.push(`- Booking: ${profile.contact.bookingUrl}`);
    return lines.join("\n");
  }

  return null;
}

function getTopSkills(knowledge: KnowledgeItem[], max = 10): string[] {
  const counts = new Map<string, number>();
  for (const item of knowledge) {
    for (const tech of item.stack) {
      const key = tech.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([tech]) => tech);
}

function stemToken(token: string): string {
  if (token.length <= 4) return token;
  if (token.endsWith("ing") && token.length > 6) return token.slice(0, -3);
  if (token.endsWith("ed") && token.length > 5) return token.slice(0, -2);
  if (token.endsWith("es") && token.length > 5) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 5) return token.slice(0, -1);
  return token;
}

function expandToken(token: string): string[] {
  const expansions: Record<string, string[]> = {
    ai: ["ml", "machine", "learning", "llm"],
    ml: ["ai", "machine", "learning"],
    llm: ["ai", "ml"],
    forecast: ["forecasting", "demand"],
    demand: ["forecast", "forecasting"],
    dashboard: ["analytics", "kpi"],
    seo: ["metadata", "sitemap", "robots"],
    email: ["nodemailer", "smtp"],
    contact: ["hire", "booking"],
    booking: ["call", "meeting"],
    cplusplus: ["cpp"],
    cpp: ["cplusplus"],
    nextjs: ["next"],
    nodejs: ["node"],
  };

  return expansions[token] ? [token, ...expansions[token]] : [token];
}

function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  const rawTokens = normalized
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const tokens: string[] = [];
  for (const raw of rawTokens) {
    if (raw.length < 2) continue;
    if (STOP_WORDS.has(raw)) continue;
    const stemmed = stemToken(raw);
    for (const expanded of expandToken(stemmed)) {
      if (expanded.length < 2) continue;
      if (STOP_WORDS.has(expanded)) continue;
      tokens.push(expanded);
    }
  }
  return tokens;
}

function countTokenOverlap(queryTokens: string[], fieldTokens: Set<string>): number {
  let hits = 0;
  for (const token of queryTokens) {
    if (fieldTokens.has(token)) hits += 1;
  }
  return hits;
}

function scoreMatch(query: string, item: KnowledgeItem): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const titleTokens = new Set(tokenize(item.title));
  const summaryTokens = new Set(tokenize(item.summary));
  const stackTokens = new Set(tokenize(item.stack.join(" ")));
  const categoryTokens = new Set(tokenize(item.category));
  const featuresTokens = new Set(tokenize(item.features.join(" ")));
  const impactTokens = new Set(tokenize(item.impact.join(" ")));
  const problemTokens = new Set(tokenize(item.problem));

  const titleHits = countTokenOverlap(queryTokens, titleTokens);
  const summaryHits = countTokenOverlap(queryTokens, summaryTokens);
  const stackHits = countTokenOverlap(queryTokens, stackTokens);
  const categoryHits = countTokenOverlap(queryTokens, categoryTokens);
  const featuresHits = countTokenOverlap(queryTokens, featuresTokens);
  const impactHits = countTokenOverlap(queryTokens, impactTokens);
  const problemHits = countTokenOverlap(queryTokens, problemTokens);

  const weighted =
    titleHits * 5 +
    stackHits * 4 +
    summaryHits * 3 +
    categoryHits * 2 +
    impactHits * 2 +
    featuresHits * 1 +
    problemHits * 1;

  return weighted;
}

function buildKnowledgeBase(): KnowledgeItem[] {
  return getAllProjects().map((project) => ({
    title: project.title,
    summary: project.summary,
    category: project.category,
    role: project.role,
    timeline: project.timeline,
    stack: project.stack,
    problem: project.problem,
    approach: project.approach,
    impact: project.impact,
    features: project.features,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    url: `/projects/${project.slug}`,
    sourceType: "project" as const,
  }));
}

function buildAssistantReply(question: string, matches: KnowledgeItem[]): string {
  const normalized = normalizeText(question);
  const intent = detectIntent(normalized);

  const profileReply = buildProfileReply(intent);
  if (profileReply) return profileReply;

  if (intent === "benefits") {
    return buildBenefitsReply();
  }

  if (intent === "services") {
    const knowledge = buildKnowledgeBase();
    return buildServicesReply(knowledge);
  }

  if (intent === "greeting") {
    return [
      "Hi — I’m Haroon’s portfolio assistant.",
      "Ask me about case studies, stack choices, or how to contact/book.",
    ].join("\n");
  }

  if (intent === "booking") {
    return "You can book a call from the booking section on the homepage. If you share your goals and timeline, I can suggest which case study to review before booking.";
  }

  if (intent === "contact") {
    return "Use the contact form (topic, budget, timeline) so Haroon can reply with a focused plan. If you have a brief or requirements doc, mention it in the message to speed up scoping.";
  }

  if (intent === "capabilities") {
    return [
      "I can help you navigate this portfolio:",
      "- Recommend relevant case studies based on your domain (enterprise, EdTech, personal brand).",
      "- Summarize stack/architecture choices from the case studies.",
      "- Point you to the right place to book or contact.",
      "Ask something like: 'Show me projects using Next.js' or 'Which project is best for AI + dashboards?'.",
    ].join("\n");
  }

  if (intent === "skills") {
    // Keep this answer useful even if the question doesn't match any single project.
    const knowledge = buildKnowledgeBase();
    const top = getTopSkills(knowledge, 12);
    return [
      "Top technologies shown across Haroon’s case studies:",
      `- ${top.join(", ")}`,
      "If you tell me what you’re building (web app, automation, dashboard, backend), I’ll point you to the closest case study.",
    ].join("\n");
  }

  if (matches.length === 0) {
    if (intent === "unknown") {
      return [
        "I can answer questions about Haroon (intro, skills, links) and about the portfolio (case studies, stack, impact).",
        "Try: 'Tell me about Haroon', 'What benefits do I get from this website?', 'What type of websites do you make?', 'How do I contact you?', or 'Which project uses Next.js?'.",
      ].join("\n");
    }

    return "I couldn't find a strong match in the current case studies. Try asking about a specific technology (e.g., Next.js, Node.js, PostgreSQL) or a domain (dashboards, forecasting, EdTech).";
  }

  const top = matches.slice(0, 3);
  const lines: string[] = ["Most relevant case studies:"];

  for (const item of top) {
    const stack = item.stack.slice(0, 6).join(", ");
    const impact = item.impact.slice(0, 2).join(" ");
    lines.push(
      `- ${item.title} (${item.category}) — ${item.summary}` +
        (stack ? ` Stack: ${stack}.` : "") +
        (impact ? ` Impact: ${impact}` : "")
    );
  }

  lines.push(
    "Ask for details on one (e.g., 'Explain the architecture of Supply Chain Optimization Platform' or 'What was the impact of AI-Powered Portfolio?')."
  );

  return lines.join("\n");
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
    const scored = knowledge
      .map((item) => ({ item, score: scoreMatch(question, item) }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.item.impact.length - a.item.impact.length;
      });

    const bestScore = scored[0]?.score ?? 0;
    const MIN_RELEVANCE_SCORE = 8;
    const matches = bestScore >= MIN_RELEVANCE_SCORE ? scored.filter((entry) => entry.score > 0).map((entry) => entry.item) : [];

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
