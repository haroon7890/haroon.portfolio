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
          className="ask-ai-btn glass btn-anim px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-[#63d2b4] hover:bg-[#63d2b420]"
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
            <div className="font-bold text-[#63d2b4] text-lg">Portfolio Assistant</div>
            <a
              href="#"
              role="button"
              className="btn-anim text-zinc-400 hover:text-[#63d2b4] text-2xl"
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
                          className="btn-anim inline-flex w-full items-center justify-between gap-2 rounded-lg border border-[#63d2b440] bg-[#10162466] px-3 py-2 text-xs text-[#63d2b4] hover:bg-[#63d2b420] hover:text-[#7be8cb]"
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
                className="flex-1 rounded px-3 py-2 bg-[#232946] text-white border border-[#63d2b440] outline-none"
                placeholder="Ask about case studies, stack, delivery..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                maxLength={1000}
              />
              <button
                type="submit"
                className="btn-anim rounded bg-[#63d2b4] text-black font-bold px-4 py-2 disabled:opacity-60"
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

export function ContactSection({ bookingUrl }: { bookingUrl: string }) {
  const MIN_CONTACT_MESSAGE_CHARS = 10;
  const [contactStatus, setContactStatus] = useState<null | "success" | "error">(null);
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSubmitAttempted, setContactSubmitAttempted] = useState(false);
  const [contactDraftMessage, setContactDraftMessage] = useState("");
  const contactMessageRef = useRef<HTMLTextAreaElement | null>(null);

  const [contactTopic, setContactTopic] = useState("");
  const [contactTopicCustom, setContactTopicCustom] = useState("");
  const [contactBudget, setContactBudget] = useState("");
  const [contactBudgetCustom, setContactBudgetCustom] = useState("");
  const [contactTimeline, setContactTimeline] = useState("");
  const [contactTimelineCustom, setContactTimelineCustom] = useState("");

  const [newsletterStatus, setNewsletterStatus] = useState<null | "success" | "error">(null);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const formStartedAtRef = useRef<number>(Date.now());

  const trimmedContactDraft = contactDraftMessage.trim();
  const remainingContactChars = Math.max(0, MIN_CONTACT_MESSAGE_CHARS - trimmedContactDraft.length);
  // Show the hint whenever the message is under the minimum.
  // This also makes it appear in the initial server-rendered HTML.
  const shouldShowContactWriteMoreHint = remainingContactChars > 0;

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactSubmitAttempted(true);
    setContactStatus(null);
    setContactMessage("");
    setContactLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("formStartedAt", String(formStartedAtRef.current));
    if (!formData.get("company")) {
      formData.set("company", "");
    }

    // If the user picked "Custom…", replace the select value with the typed value.
    if (contactTopic === "custom") {
      const custom = contactTopicCustom.trim();
      if (custom.length < 2) {
        setContactStatus("error");
        setContactMessage("Please enter a custom topic.");
        setContactLoading(false);
        return;
      }
      formData.set("topic", custom);
    }
    if (contactBudget === "custom") {
      const custom = contactBudgetCustom.trim();
      if (custom.length < 2) {
        setContactStatus("error");
        setContactMessage("Please enter a custom budget.");
        setContactLoading(false);
        return;
      }
      formData.set("budget", custom);
    }
    if (contactTimeline === "custom") {
      const custom = contactTimelineCustom.trim();
      if (custom.length < 2) {
        setContactStatus("error");
        setContactMessage("Please enter a custom timeline.");
        setContactLoading(false);
        return;
      }
      formData.set("timeline", custom);
    }

    const rawMessage = String(formData.get("message") ?? "").trim();
    if (rawMessage.length < MIN_CONTACT_MESSAGE_CHARS) {
      setContactStatus("error");
      setContactMessage(`Write a bit more (at least ${MIN_CONTACT_MESSAGE_CHARS} characters).`);
      setContactLoading(false);
      contactMessageRef.current?.focus();
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setContactStatus("error");
        setContactMessage(payload.error ?? "Failed to send your message.");
        trackEvent("contact_submit_error", { reason: payload.error ?? "unknown" });
        return;
      }

      setContactStatus("success");
      setContactMessage("Message sent successfully. I will reach out shortly.");
      trackEvent("contact_submit_success_ui");
      form.reset();
      setContactDraftMessage("");
      setContactTopic("");
      setContactTopicCustom("");
      setContactBudget("");
      setContactBudgetCustom("");
      setContactTimeline("");
      setContactTimelineCustom("");
      formStartedAtRef.current = Date.now();
    } catch {
      setContactStatus("error");
      setContactMessage("Failed to send your message.");
      trackEvent("contact_submit_error", { reason: "network" });
    } finally {
      setContactLoading(false);
    }
  }

  async function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewsletterStatus(null);
    setNewsletterMessage("");
    setNewsletterLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setNewsletterStatus("error");
        setNewsletterMessage(payload.error ?? "Failed to subscribe.");
        trackEvent("newsletter_subscribe_error", { reason: payload.error ?? "unknown" });
        return;
      }

      setNewsletterStatus("success");
      setNewsletterMessage(payload.message ?? "Subscribed successfully.");
      trackEvent("newsletter_subscribe_success_ui");
      form.reset();
    } catch {
      setNewsletterStatus("error");
      setNewsletterMessage("Failed to subscribe.");
      trackEvent("newsletter_subscribe_error", { reason: "network" });
    } finally {
      setNewsletterLoading(false);
    }
  }

  return (
    <section id="contact" className="section fade-in">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass tilt-3d tilt-soft card-3d p-8">
          <h2 className="text-3xl font-bold mb-3 gradient-text">Start Your Project</h2>
          <p className="text-zinc-400 mb-6">
            Share your requirements with budget and timeline. Attach your brief and get a structured response.
          </p>

          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
                required
                disabled={contactLoading}
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
                required
                disabled={contactLoading}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <select
                name="topic"
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
                value={contactTopic}
                onChange={(e) => setContactTopic(e.currentTarget.value)}
                required
                disabled={contactLoading}
              >
                <option value="" disabled>
                  Topic
                </option>
                <option value="web-app">Full-stack web app</option>
                <option value="ai-automation">AI automation</option>
                <option value="backend">Backend/API systems</option>
                <option value="consulting">Technical consulting</option>
                <option value="custom">Custom…</option>
              </select>

              <select
                name="budget"
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
                value={contactBudget}
                onChange={(e) => setContactBudget(e.currentTarget.value)}
                required
                disabled={contactLoading}
              >
                <option value="" disabled>
                  Budget
                </option>
                <option value="lt-500">Less than $500</option>
                <option value="500-1500">$500 - $1,500</option>
                <option value="1500-5000">$1,500 - $5,000</option>
                <option value="gt-5000">$5,000+</option>
                <option value="custom">Custom…</option>
              </select>

              <select
                name="timeline"
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
                value={contactTimeline}
                onChange={(e) => setContactTimeline(e.currentTarget.value)}
                required
                disabled={contactLoading}
              >
                <option value="" disabled>
                  Timeline
                </option>
                <option value="asap">ASAP</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="1-month">Within 1 month</option>
                <option value="flexible">Flexible</option>
                <option value="custom">Custom…</option>
              </select>
            </div>

            {contactTopic === "custom" ? (
              <input
                type="text"
                value={contactTopicCustom}
                onChange={(e) => setContactTopicCustom(e.currentTarget.value)}
                placeholder="Custom topic"
                required
                disabled={contactLoading}
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
              />
            ) : null}

            {contactBudget === "custom" ? (
              <input
                type="text"
                value={contactBudgetCustom}
                onChange={(e) => setContactBudgetCustom(e.currentTarget.value)}
                placeholder="Custom budget"
                required
                disabled={contactLoading}
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
              />
            ) : null}

            {contactTimeline === "custom" ? (
              <input
                type="text"
                value={contactTimelineCustom}
                onChange={(e) => setContactTimelineCustom(e.currentTarget.value)}
                placeholder="Custom timeline"
                required
                disabled={contactLoading}
                className="rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
              />
            ) : null}

            <textarea
              name="message"
              rows={5}
              placeholder="Describe your project goals, scope, and current bottlenecks."
              className="w-full rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none resize-y"
              required
              minLength={10}
              maxLength={5000}
              disabled={contactLoading}
              ref={contactMessageRef}
              onChange={(e) => setContactDraftMessage(e.currentTarget.value)}
            />

            {shouldShowContactWriteMoreHint ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#63d2b440] bg-[#232946] px-3 py-2 text-sm text-zinc-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-[#63d2b4]"
                  aria-hidden="true"
                >
                  <path d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182l-10.2 10.2a4.5 4.5 0 0 1-1.897 1.13l-3.12 1.04a.75.75 0 0 1-.948-.948l1.04-3.12a4.5 4.5 0 0 1 1.13-1.897l10.2-10.2ZM18.73 5.355a.75.75 0 0 0-1.06 0l-1.09 1.09 1.06 1.06 1.09-1.09a.75.75 0 0 0 0-1.06Zm-2.68 2.68-8.9 8.9a3 3 0 0 0-.753 1.264l-.56 1.68 1.68-.56a3 3 0 0 0 1.264-.753l8.9-8.9-1.63-1.63Z" />
                </svg>
                <span>
                  Write a bit more (add a few more words — {remainingContactChars} more character{remainingContactChars === 1 ? "" : "s"} minimum).
                </span>
              </div>
            ) : null}

            <div>
              <label className="block text-sm text-zinc-300 mb-2" htmlFor="attachment">
                Attachment (optional: PDF, DOC, TXT, JPG, PNG up to 5MB)
              </label>
              <input
                id="attachment"
                type="file"
                name="attachment"
                className="w-full rounded px-3 py-2 bg-[#232946] text-zinc-300 border border-[#63d2b440]"
                disabled={contactLoading}
              />
            </div>

            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <input type="hidden" name="formStartedAt" value={String(formStartedAtRef.current)} />

            <button
              type="submit"
              className="featured-btn px-7 py-3 disabled:opacity-70"
              disabled={contactLoading}
              onClick={() => setContactSubmitAttempted(true)}
            >
              {contactLoading ? "Sending..." : "Send Project Brief"}
            </button>

            {contactStatus ? (
              <p className={`text-sm ${contactStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                {contactMessage}
              </p>
            ) : null}
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass tilt-3d tilt-soft card-3d p-7">
            <h3 className="text-2xl font-semibold text-white mb-2">Book a Strategy Call</h3>
            <p className="text-zinc-400 mb-5">
              Prefer a live call? Share context quickly and align on scope, milestones, and delivery plan.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="featured-btn inline-flex"
              data-analytics="booking_secondary_click"
              data-analytics-label="contact_booking"
            >
              Book Now
            </a>
          </div>

          <div className="glass tilt-3d tilt-soft card-3d p-7">
            <h3 className="text-2xl font-semibold text-white mb-2">Newsletter</h3>
            <p className="text-zinc-400 mb-5">Monthly updates on builds, experiments, and shipping lessons.</p>

            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded px-4 py-3 bg-[#232946] text-white border border-[#63d2b440] focus:border-[#63d2b4] outline-none"
                disabled={newsletterLoading}
              />
              <button type="submit" className="featured-btn px-6" disabled={newsletterLoading}>
                {newsletterLoading ? "..." : "Join"}
              </button>
            </form>

            {newsletterStatus ? (
              <p className={`text-sm mt-3 ${newsletterStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                {newsletterMessage}
              </p>
            ) : null}
          </div>

          <div className="glass tilt-3d tilt-soft card-3d p-7 border-l-4 border-l-[#63d2b4]">
            <h3 className="text-xl font-semibold text-white mb-4">Direct Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <a href="https://github.com/haroon7890" title="GitHub" target="_blank" rel="noopener noreferrer" className="tilt-3d tilt-strong card-3d w-12 h-12 rounded-xl bg-[#232946] border border-[#63d2b440] flex items-center justify-center hover:bg-[#63d2b415] hover:border-[#63d2b4] transition-all duration-300 group shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-400 group-hover:text-[#63d2b4] transition-colors"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.342-3.37-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.447-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.547 1.382.203 2.402.1 2.656.64.7 1.028 1.594 1.028 2.687 0 3.847-2.339 4.695-4.566 4.944.359.31.678.921.678 1.857 0 1.34-.012 2.422-.012 2.752 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/haroon-imran-80b515352/" title="LinkedIn" target="_blank" rel="noopener noreferrer" className="tilt-3d tilt-strong card-3d w-12 h-12 rounded-xl bg-[#232946] border border-[#4fa8e840] flex items-center justify-center hover:bg-[#4fa8e815] hover:border-[#4fa8e8] transition-all duration-300 group shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-400 group-hover:text-[#4fa8e8] transition-colors"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
              <div className="flex flex-col gap-2 mt-2 text-sm text-zinc-300 font-medium">
                <a href="mailto:haroon86865@gmail.com" className="hover:text-[#63d2b4] transition inline-flex items-center gap-2" data-analytics="contact_email_click">
                  <span className="text-[#63d2b4] text-lg">✉</span> haroon86865@gmail.com
                </a>
                <a href="tel:+923364450294" className="hover:text-[#4fa8e8] transition inline-flex items-center gap-2" data-analytics="contact_phone_click">
                  <span className="text-[#4fa8e8] text-lg">☏</span> +92 336 4450294
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
