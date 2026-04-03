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
  const [submitted, setSubmitted] = useState(initialStatus === "success");
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const formStartedAtRef = useRef<number>(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialStatus === "error" ? "Could not send your message. Please try again." : "");

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
    setLoading(true);
    setError("");

    const message = form.message.trim();
    if (message.length < 10) {
      setError("Message must be at least 10 characters.");
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
      setForm({ name: "", email: "", message: "" });
      formStartedAtRef.current = 0;
    } catch (err) {
      setError("Could not send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              maxLength={5000}
              className="w-full px-4 py-2 rounded bg-[#232946] border border-[#63d2b430] text-zinc-200"
            />
            <div role="status" aria-live="polite">
              {error ? <div className="text-red-400 text-sm">{error}</div> : null}
            </div>
            <button
              type="submit"
              className="featured-btn w-full mt-2"
              disabled={loading}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {loading ? (
                  <span
                    className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-zinc-200/40 border-t-zinc-200 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {loading ? "Sending..." : error ? "Retry Send Message" : "Send Message"}
              </span>
            </button>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mt-4 text-[#63d2b4] underline"
            >
              Or book a strategy call
            </a>
          </form>
        )}
      </div>
    </section>
  );
}
