"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";
import { SITE_CONFIG } from "@/lib/config";

type ContactRedirectStatus = "success" | "error";

type ToastState = {
  id: number;
  message: string;
  type: "error" | "success";
};

const CALENDLY_URL = "";

export default function ContactSection({
  initialStatus,
}: {
  initialStatus?: ContactRedirectStatus;
}) {
  const MIN_MESSAGE_CHARS = 20;
  const [submitted, setSubmitted] = useState(initialStatus === "success");
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
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
  const [toast, setToast] = useState<ToastState | null>(null);
  const [copied, setCopied] = useState(false);

  const formStartedAtRef = useRef<number>(0);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
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

    const url = new URL(window.location.href);
    url.searchParams.delete("contact");
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string, type: "error" | "success") => {
    const nextToast = { id: Date.now(), message, type };
    setToast(nextToast);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast((prev) => (prev?.id === nextToast.id ? null : prev));
    }, 3000);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formStartedAtRef.current) {
      formStartedAtRef.current = Date.now();
    }

    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      showToast("Copied!", "success");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast("Something went wrong. Please try again or email me directly.", "error");
    }
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const message = form.message.trim();
    if (message.length < MIN_MESSAGE_CHARS) {
      setLoading(false);
      showToast("Please add more detail about your project 💬", "error");
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
      formStartedAtRef.current = Date.now() - 5000;
    }

    try {
      const response = await fetch("/api/contact", {
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

      const raw = await response.text();
      const payload = (() => {
        try {
          return JSON.parse(raw) as { error?: string; deliveryId?: string };
        } catch {
          return null;
        }
      })();

      if (!response.ok) {
        setError(payload?.error ?? "Could not send message. Please try again later.");
        showToast("Something went wrong. Please try again or email me directly.", "error");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setDeliveryId(payload?.deliveryId ?? null);
      showToast("Message sent! I'll reply within 24 hours ✓", "success");

      window.setTimeout(() => {
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
      }, 2000);
      formStartedAtRef.current = 0;
    } catch {
      setError("Could not send message. Please try again later.");
      showToast("Something went wrong. Please try again or email me directly.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="section scroll-mt-24 pt-10">
      <div className="relative">
        <span className="section-number" aria-hidden="true">03</span>
        <ScrollReveal distance={20} duration={600} className="relative z-[1] mb-6">
          <h2 className="section-title text-[#e2e8f0]">Let&apos;s Build Something Together</h2>
          <p className="mt-2 text-sm text-[#94a3b8]">Tell me about your project and I will get back to you within 24 hours.</p>
        </ScrollReveal>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        <ScrollReveal distance={20} duration={600}>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1626] p-6">
            <h3 className="text-lg font-semibold text-white">Why work with me?</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              <li>✦ 48hr response guarantee</li>
              <li>✦ Clean, documented MERN stack code</li>
              <li>✦ AI integrations that actually work</li>
              <li>✦ Affordable rates, professional results</li>
              <li>✦ Direct communication - no middlemen</li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#080d14] p-3">
              <div className="text-xs text-[#64748b]">Email</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-sm text-[#e2e8f0] break-all">{SITE_CONFIG.email}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1 text-xs text-[#94a3b8] hover:text-white transition-colors duration-200"
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal distance={20} duration={600}>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1626] p-6">
            {submitted ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                <div className="inline-flex items-center gap-2 font-semibold">
                  <Check size={16} />
                  Message sent!
                </div>
                {deliveryId ? <div className="mt-1 text-xs text-green-200/80">Delivery reference: {deliveryId}</div> : null}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4" method="post" action="/api/contact" encType="multipart/form-data">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={onChange}
                required
                className="contact-field w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={onChange}
                required
                className="contact-field w-full"
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <select name="topic" value={form.topic} onChange={onChange} className="contact-field w-full">
                  <option value="general">Topic</option>
                  <option value="web-app">Full-stack web app</option>
                  <option value="ai-automation">AI automation</option>
                  <option value="backend">Backend/API systems</option>
                  <option value="consulting">Technical consulting</option>
                  <option value="custom">Custom…</option>
                </select>

                <select name="budget" value={form.budget} onChange={onChange} className="contact-field w-full">
                  <option value="unspecified">Budget</option>
                  <option value="lt-500">Less than $500</option>
                  <option value="500-1500">$500 - $1,500</option>
                  <option value="1500-5000">$1,500 - $5,000</option>
                  <option value="gt-5000">$5,000+</option>
                  <option value="custom">Custom…</option>
                </select>

                <select name="timeline" value={form.timeline} onChange={onChange} className="contact-field w-full">
                  <option value="unspecified">Timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="2-weeks">Within 2 weeks</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="flexible">Flexible</option>
                  <option value="custom">Custom…</option>
                </select>
              </div>

              {form.topic === "custom" ? (
                <input type="text" name="topicCustom" placeholder="Custom topic" value={form.topicCustom} onChange={onChange} required className="contact-field w-full" />
              ) : null}

              {form.budget === "custom" ? (
                <input type="text" name="budgetCustom" placeholder="Custom budget" value={form.budgetCustom} onChange={onChange} required className="contact-field w-full" />
              ) : null}

              {form.timeline === "custom" ? (
                <input type="text" name="timelineCustom" placeholder="Custom timeline" value={form.timelineCustom} onChange={onChange} required className="contact-field w-full" />
              ) : null}

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={onChange}
                required
                rows={5}
                maxLength={5000}
                className="contact-field w-full"
              />

              {error ? <div className="text-sm text-red-400">{error}</div> : null}

              <button
                type="submit"
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 text-base font-bold text-black transition-all duration-200 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? "Sending..." : "Send Message"}
              </button>

              {CALENDLY_URL && (
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-anim inline-flex w-full items-center justify-center rounded-full border border-white/[0.12] bg-transparent px-6 py-2 text-sm font-semibold text-[#94a3b8] transition-all duration-200 hover:bg-white/5"
                >
                  Or book a strategy call
                </a>
              )}
              {/* TODO: Add your Calendly URL in /lib/config.ts */}
            </form>
          </div>
        </ScrollReveal>
      </div>

      {toast ? (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      ) : null}
    </section>
  );
}
