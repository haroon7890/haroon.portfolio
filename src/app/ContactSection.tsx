"use client";

import React, { useEffect, useRef, useState } from "react";

type ContactRedirectStatus = "success" | "error";

export default function ContactSection({
  bookingUrl,
  initialStatus,
}: {
  bookingUrl: string;
  initialStatus?: ContactRedirectStatus;
}) {
  const MIN_MESSAGE_CHARS = 10;
  const [submitted, setSubmitted] = useState(initialStatus === "success");
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const formStartedAtRef = useRef<number>(0);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general",
    topicCustom: "",
    budget: "unspecified",
    budgetCustom: "",
    timeline: "unspecified",
    timelineCustom: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialStatus === "error" ? "Could not send your message. Please try again." : "");

  const trimmedMessage = form.message.trim();
  const remainingMessageChars = Math.max(0, MIN_MESSAGE_CHARS - trimmedMessage.length);
  // Show the hint whenever the message is under the minimum.
  // This also ensures it appears in the initial server-rendered HTML.
  const shouldShowWriteMoreHint = remainingMessageChars > 0;
  const isMessageLengthError = /between\s+10\s+and\s+5000|at\s+least\s+10|10\s+characters/i.test(error);

  useEffect(() => {
    // If JS fails and the browser falls back to a full form POST to /api/contact,
    // the API redirects back with ?contact=success|error.
    const params = new URLSearchParams(window.location.search);
    const contact = params.get("contact");

    if (contact === "success") {
      setSubmitted(true);
      setError("");
      setDeliveryId(null);
    } else if (contact === "error") {
      setSubmitted(false);
      setError("Could not send your message. Please try again.");
      setDeliveryId(null);
    } else {
      return;
    }

    // Clean URL so refresh/back doesn't keep the same banner.
    const url = new URL(window.location.href);
    url.searchParams.delete("contact");
    window.history.replaceState({}, "", url.toString());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    setLoading(true);
    setError("");

    const message = trimmedMessage;
    if (message.length < MIN_MESSAGE_CHARS) {
      // Don't show a generic "retry" state for short messages; guide the user to write more.
      setError(`Please write at least ${MIN_MESSAGE_CHARS} characters.`);
      setLoading(false);
      messageRef.current?.focus();
      return;
    }

    const topic = form.topic === "custom" ? form.topicCustom.trim() : form.topic;
    const budget = form.budget === "custom" ? form.budgetCustom.trim() : form.budget;
    const timeline = form.timeline === "custom" ? form.timelineCustom.trim() : form.timeline;

    if (form.topic === "custom" && topic.length < 2) {
      setError("Please enter a custom topic.");
      setLoading(false);
      return;
    }
    if (form.budget === "custom" && budget.length < 2) {
      setError("Please enter a custom budget.");
      setLoading(false);
      return;
    }
    if (form.timeline === "custom" && timeline.length < 2) {
      setError("Please enter a custom timeline.");
      setLoading(false);
      return;
    }

    if (!formStartedAtRef.current) {
      // If the user submits instantly (or autofill submits), avoid failing the anti-spam timer.
      formStartedAtRef.current = Date.now() - 5000;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          topic,
          budget,
          timeline,
          message,
          company: "",
          formStartedAt: String(formStartedAtRef.current),
        }),
      });

      const raw = await res.text();
      const payload = ((): null | { error?: string; deliveryId?: string } => {
        try {
          return JSON.parse(raw) as { error?: string; deliveryId?: string };
        } catch {
          return null;
        }
      })();

      if (!res.ok) {
        setError(payload?.error ?? "Could not send message. Please try again later.");
        return;
      }
      setSubmitted(true);
      setDeliveryId(payload?.deliveryId ?? null);
      setForm({
        name: "",
        email: "",
        topic: "general",
        topicCustom: "",
        budget: "unspecified",
        budgetCustom: "",
        timeline: "unspecified",
        timelineCustom: "",
        message: "",
      });
      formStartedAtRef.current = 0;
    } catch (err) {
      setError("Could not send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (!formStartedAtRef.current) {
      formStartedAtRef.current = Date.now();
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <section id="contact" className="section fade-in">
      <div className="glass tilt-3d tilt-soft max-w-xl mx-auto p-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">Contact Me</h2>
        {submitted ? (
          <div className="text-green-400 font-semibold">
            Thank you! Your message has been sent.
            {deliveryId ? <div className="text-zinc-400 text-sm mt-2">Delivery reference: {deliveryId}</div> : null}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            method="post"
            action="/api/contact"
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
            />

            <div className="grid sm:grid-cols-3 gap-3">
              <select
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
              >
                <option value="general">Topic</option>
                <option value="web-app">Full-stack web app</option>
                <option value="ai-automation">AI automation</option>
                <option value="backend">Backend/API systems</option>
                <option value="consulting">Technical consulting</option>
                <option value="custom">Custom…</option>
              </select>

              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
              >
                <option value="unspecified">Budget</option>
                <option value="lt-500">Less than $500</option>
                <option value="500-1500">$500 - $1,500</option>
                <option value="1500-5000">$1,500 - $5,000</option>
                <option value="gt-5000">$5,000+</option>
                <option value="custom">Custom…</option>
              </select>

              <select
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
              >
                <option value="unspecified">Timeline</option>
                <option value="asap">ASAP</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="1-month">Within 1 month</option>
                <option value="flexible">Flexible</option>
                <option value="custom">Custom…</option>
              </select>
            </div>

            {form.topic === "custom" ? (
              <input
                type="text"
                name="topicCustom"
                placeholder="Custom topic"
                value={form.topicCustom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
              />
            ) : null}

            {form.budget === "custom" ? (
              <input
                type="text"
                name="budgetCustom"
                placeholder="Custom budget"
                value={form.budgetCustom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
              />
            ) : null}

            {form.timeline === "custom" ? (
              <input
                type="text"
                name="timelineCustom"
                placeholder="Custom timeline"
                value={form.timelineCustom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
              />
            ) : null}
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              maxLength={5000}
              ref={messageRef}
              className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
            />
            {shouldShowWriteMoreHint ? (
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
                  Write a bit more (add a few more words — {remainingMessageChars} more character{remainingMessageChars === 1 ? "" : "s"} minimum).
                </span>
              </div>
            ) : null}
            <div role="status" aria-live="polite">
              {error ? <div className="text-red-400 text-sm">{error}</div> : null}
            </div>
            <button
              type="submit"
              className="featured-btn w-full mt-2"
              disabled={loading}
              onClick={() => setSubmitAttempted(true)}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {loading ? (
                  <span
                    className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-zinc-200/40 border-t-zinc-200 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {loading
                  ? "Sending..."
                  : error
                    ? isMessageLengthError
                      ? "Write More"
                      : "Retry Send Message"
                    : "Send Message"}
              </span>
            </button>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-anim mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#63d2b440] bg-[#10162466] px-6 py-2 text-sm font-semibold text-[#63d2b4] hover:bg-[#63d2b420]"
            >
              Or book a strategy call
            </a>
          </form>
        )}
      </div>
    </section>
  );
}
