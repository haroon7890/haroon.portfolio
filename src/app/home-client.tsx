"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics-client";

type AssistantSource = {
  title: string;
  summary: string;
  url: string;
  sourceType: "project";
};

type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
  sources?: AssistantSource[];
};

export function HomeBehaviorTracker() {
  useEffect(() => {
    const seenDepths = new Set<number>();
    const depthMilestones = [25, 50, 75, 100];

    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) {
        return;
      }

      const progress = Math.round((window.scrollY / documentHeight) * 100);
      for (const depth of depthMilestones) {
        if (progress >= depth && !seenDepths.has(depth)) {
          seenDepths.add(depth);
          trackEvent("scroll_depth", { depth });
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trackable = target?.closest<HTMLElement>("[data-analytics]");
      if (!trackable) {
        return;
      }

      const name = trackable.getAttribute("data-analytics");
      if (!name) {
        return;
      }

      trackEvent(name, {
        label: trackable.getAttribute("data-analytics-label") ?? undefined,
        href: trackable.getAttribute("href") ?? undefined,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    trackEvent("homepage_view");

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      text:
        "Ask me about projects, case studies, tech stack decisions, or how to start a collaboration.",
    },
  ]);

  useEffect(() => {
    // Progressive enhancement: keep React state in sync with the URL hash.
    // This also enables a no-JS fallback via CSS :target.
    const syncFromHash = () => {
      const shouldBeOpen = typeof window !== "undefined" && window.location.hash === "#assistant-modal";
      setOpen(shouldBeOpen);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const openAssistant = () => {
    try {
      if (typeof window !== "undefined") {
        window.location.hash = "assistant-modal";
      }
    } catch {
      // ignore
    }
    setOpen(true);
    trackEvent("assistant_open");
  };

  const closeAssistant = () => {
    try {
      if (typeof window !== "undefined") {
        // Remove hash without scrolling.
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState(null, "", url.toString());
      }
    } catch {
      // ignore
    }
    setOpen(false);
    trackEvent("assistant_close");
  };

  async function handleAsk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = question.trim();
    if (!value || loading) {
      return;
    }

    setLoading(true);
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    trackEvent("assistant_submit", { questionLength: value.length });

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: value }),
      });

      const payload = (await res.json()) as {
        answer?: string;
        error?: string;
        sources?: AssistantSource[];
      };

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: payload.error ?? "Assistant is currently unavailable. Please try again.",
          },
        ]);
        trackEvent("assistant_failure");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: payload.answer ?? "I could not generate a useful answer.",
          sources: payload.sources ?? [],
        },
      ]);
      trackEvent("assistant_success", { sourceCount: payload.sources?.length ?? 0 });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Assistant is currently unavailable. Please try again.",
        },
      ]);
      trackEvent("assistant_failure");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] pointer-events-auto">
        <a
          href="#assistant-modal"
          role="button"
          className="ask-ai-btn glow-animate glass btn-anim px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-[color:var(--accent)] hover:bg-[#ff8a5b22]"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="assistant-modal"
          onClick={(e) => {
            // Progressive enhancement: if JS is running, also set state for smoother UX.
            // Do NOT prevent default so the hash navigation fallback still works.
            openAssistant();
          }}
        >
          Ask Portfolio AI
        </a>
      </div>

      {/* Always render so :target can open it even if JS fails. */}
      <div
        id="assistant-modal"
        role="dialog"
        aria-modal="true"
        className={`assistant-overlay fixed inset-0 z-[70] items-end sm:items-center justify-center bg-black/45 ${
          open ? "is-open" : ""
        }`}
        onClick={closeAssistant}
      >
        <div
          className="glass tilt-3d tilt-soft card-3d p-5 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col gap-4 animate-fadeInUp max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <div className="font-bold text-[color:var(--accent)] text-lg">Portfolio Assistant</div>
            <a
              href="#"
              role="button"
              className="btn-anim text-zinc-400 hover:text-[color:var(--accent)] text-2xl"
              onClick={(e) => {
                closeAssistant();
              }}
              aria-label="Close"
            >
              &times;
            </a>
          </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((message, idx) => (
                <div key={`${message.role}-${idx}`} className={`rounded-xl p-3 ${message.role === "assistant" ? "bg-[#1b2238]" : "bg-[#26355f]"}`}>
                  <p className="text-sm text-zinc-100 whitespace-pre-wrap">{message.text}</p>
                  {message.sources && message.sources.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {message.sources.map((source) => (
                        <a
                          key={`${source.sourceType}-${source.url}`}
                          href={source.url}
                          className="btn-anim inline-flex w-full items-center justify-between gap-2 rounded-lg border border-[color:var(--accent-soft)] bg-[#10162466] px-3 py-2 text-xs text-[color:var(--accent)] hover:bg-[#ff8a5b22] hover:text-[color:var(--accent-2)]"
                        >
                          {source.title} ({source.sourceType})
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {loading ? <div className="text-sm text-zinc-400">Thinking...</div> : null}
            </div>

            <form className="flex gap-2" onSubmit={handleAsk}>
              <input
                className="flex-1 rounded px-3 py-2 bg-[#232946] text-white border border-[color:var(--accent-soft)] outline-none"
                placeholder="Ask about case studies, stack, delivery..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                maxLength={1000}
              />
              <button
                type="submit"
                className="btn-anim rounded bg-[color:var(--accent)] text-[#2d1308] font-bold px-4 py-2 disabled:opacity-60"
                disabled={loading || question.trim().length < 2}
              >
                Send
              </button>
            </form>
        </div>
      </div>
    </>
  );
}

