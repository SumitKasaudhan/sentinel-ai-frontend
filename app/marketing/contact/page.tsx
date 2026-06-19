"use client";

import { useEffect, useRef, useState } from "react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/footer pages/contact.css";

import {
  Globe,
  FileText,
  Send,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";

const REGION_STATUS = [
  { code: "NA-EAST",  place: "Virginia cluster",   latency: "14ms" },
  { code: "EU-WEST",  place: "Frankfurt cluster",   latency: "22ms" },
  { code: "APAC-SE",  place: "Singapore cluster",   latency: "31ms" },
  { code: "SA-SOUTH", place: "São Paulo cluster",   latency: "48ms" },
];

const INQUIRY_OPTIONS = [
  "Technical Diagnostics",
  "Tactical Deployment",
  "Media Relations",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    operator:     "",
    organization: "",
    inquiry:      "Technical Diagnostics",
    message:      "",
    website:      "",
  });

  const [submitted,    setSubmitted]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inquiryOpen,  setInquiryOpen]  = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inquiryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inquiryRef.current && !inquiryRef.current.contains(e.target as Node)) {
        setInquiryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectInquiry = (option: string) => {
    setFormData((prev) => ({ ...prev, inquiry: option }));
    setInquiryOpen(false);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!inquiryOpen) {
        setInquiryOpen(true);
        setHighlightedIndex(Math.max(INQUIRY_OPTIONS.indexOf(formData.inquiry), 0));
      } else {
        setHighlightedIndex((i) => Math.min(i + 1, INQUIRY_OPTIONS.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inquiryOpen) setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && inquiryOpen) {
      e.preventDefault();
      selectInquiry(INQUIRY_OPTIONS[highlightedIndex]);
    } else if (e.key === "Escape") {
      setInquiryOpen(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.operator || !formData.organization || !formData.message) {
      setErrorMessage("All fields are required to transmit.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:         formData.operator,
          organization: formData.organization,
          inquiry_type: formData.inquiry,
          message:      formData.message,
          website:      formData.website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "channel disruption — please retry.");
      }

      setSubmitted(true);
      setFormData({ operator: "", organization: "", inquiry: "Technical Diagnostics", message: "", website: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setErrorMessage(
        `Transmission failed — ${err instanceof Error ? err.message : "please try again."}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <div className="contact-container">

          {/* ── HERO ── */}
          <section className="contact-hero">
            <span className="hero-badge">
              <ShieldCheck size={14} />
              Secure channel
            </span>

            <h1>Initiate communication</h1>

            <p>
              Reach the Sentinel intelligence team directly.
              Every transmission is logged, encrypted in
              transit, and routed to the right desk.
            </p>

            <div className="hero-ticker">
              <span>Uplink stable</span>
              <span className="divider">·</span>
              <span>Avg. response under 4 hours</span>
              <span className="divider">·</span>
              <span>4 regional nodes active</span>
            </div>
          </section>

          {/* ── MAIN GRID ── */}
          <section className="contact-grid">

            {/* FORM */}
            <div className="contact-card">
              <div className="card-head">
                <div className="section-title">
                  <ShieldCheck size={18} />
                  <h3>Transmission form</h3>
                </div>
                <span className="sla-pill">
                  <Clock size={14} />
                  Avg. response under 4 hours
                </span>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                />

                <div className="form-row">
                  <div className="form-group">
                    <label>Operator name</label>
                    <input
                      type="text"
                      name="operator"
                      placeholder="Enter designation"
                      value={formData.operator}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Organization</label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Affiliation"
                      value={formData.organization}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Inquiry type</label>
                  <div className="custom-select" ref={inquiryRef}>
                    <button
                      type="button"
                      className="custom-select-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={inquiryOpen}
                      onKeyDown={handleTriggerKeyDown}
                      onClick={() =>
                        setInquiryOpen((open) => {
                          if (!open) setHighlightedIndex(Math.max(INQUIRY_OPTIONS.indexOf(formData.inquiry), 0));
                          return !open;
                        })
                      }
                    >
                      {formData.inquiry}
                      <ChevronDown size={16} className={inquiryOpen ? "chevron open" : "chevron"} />
                    </button>

                    {inquiryOpen && (
                      <ul className="custom-select-menu" role="listbox">
                        {INQUIRY_OPTIONS.map((option, index) => (
                          <li
                            key={option}
                            role="option"
                            aria-selected={formData.inquiry === option}
                            className={[
                              "custom-select-option",
                              formData.inquiry === option ? "selected" : "",
                              index === highlightedIndex ? "highlighted" : "",
                            ].filter(Boolean).join(" ")}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => selectInquiry(option)}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Secure message</label>
                  <textarea
                    name="message"
                    placeholder="Encrypting payload..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button className="submit-btn" type="submit" disabled={isSubmitting}>
                  <Send size={16} />
                  {isSubmitting ? "Transmitting…" : submitted ? "Transmission sent" : "Transmit data"}
                </button>

                {submitted && (
                  <p className="success-banner">
                    <CheckCircle2 size={16} />
                    Transmission received. Our team typically responds within 24 hours.
                  </p>
                )}

                {errorMessage && (
                  <p className="form-error">
                    <AlertCircle size={14} />
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>

            {/* SIDEBAR — only Global response nodes, no Direct channels */}
            <div className="sidebar">
              <div className="section-title">
                <Globe size={18} />
                <h3>Global response nodes</h3>
              </div>

              <ul className="region-list">
                {REGION_STATUS.map((region) => (
                  <li className="region-row" key={region.code}>
                    <div className="region-identity">
                      <span className="region-code">{region.code}</span>
                      <span className="region-place">{region.place}</span>
                    </div>
                    <span className="region-meta">
                      <span className="status-dot" />
                      {region.latency} · operational
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </section>

          {/* ── SIGNATURE ── */}
          <section className="signature-section">
            <div className="signature-radar" aria-hidden="true">
              <div className="radar-sweep" />
              <svg className="radar-svg" viewBox="0 0 520 520">
                <defs>
                  <filter id="nodeglow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="260" cy="260" r="200" fill="none" stroke="var(--c-line-strong)" strokeWidth="1" />
                <ellipse cx="260" cy="190" rx="187" ry="40" fill="none" stroke="var(--c-line)" strokeWidth="1" />
                <ellipse cx="260" cy="330" rx="187" ry="40" fill="none" stroke="var(--c-line)" strokeWidth="1" />
                <ellipse cx="260" cy="120" rx="143" ry="26" fill="none" stroke="var(--c-line)" strokeWidth="1" />
                <ellipse cx="260" cy="400" rx="143" ry="26" fill="none" stroke="var(--c-line)" strokeWidth="1" />
                <ellipse cx="260" cy="260" rx="55" ry="200" fill="none" stroke="var(--c-line)" strokeWidth="1" transform="rotate(0 260 260)" />
                <ellipse cx="260" cy="260" rx="55" ry="200" fill="none" stroke="var(--c-line)" strokeWidth="1" transform="rotate(45 260 260)" />
                <ellipse cx="260" cy="260" rx="55" ry="200" fill="none" stroke="var(--c-line)" strokeWidth="1" transform="rotate(90 260 260)" />
                <ellipse cx="260" cy="260" rx="55" ry="200" fill="none" stroke="var(--c-line)" strokeWidth="1" transform="rotate(135 260 260)" />
                <path className="network-arc" d="M260,260 Q215,150 170,180" fill="none" stroke="var(--c-signal)" strokeWidth="1.2" opacity="0.45" />
                <path className="network-arc" d="M260,260 Q310,140 340,160" fill="none" stroke="var(--c-signal)" strokeWidth="1.2" opacity="0.45" />
                <path className="network-arc" d="M260,260 Q360,260 370,330" fill="none" stroke="var(--c-signal)" strokeWidth="1.2" opacity="0.45" />
                <path className="network-arc" d="M260,260 Q220,340 190,360" fill="none" stroke="var(--c-signal)" strokeWidth="1.2" opacity="0.45" />
                <circle className="core-node" cx="260" cy="260" r="7" fill="var(--c-signal)" filter="url(#nodeglow)" />
                <circle cx="170" cy="180" r="4" fill="var(--c-amber)" filter="url(#nodeglow)" />
                <text x="180" y="172" fontFamily="var(--font-mono)" fontSize="11" fill="var(--c-ink-1)">NA-EAST</text>
                <circle cx="340" cy="160" r="4" fill="var(--c-amber)" filter="url(#nodeglow)" />
                <text x="350" y="152" fontFamily="var(--font-mono)" fontSize="11" fill="var(--c-ink-1)">EU-WEST</text>
                <circle cx="370" cy="330" r="4" fill="var(--c-amber)" filter="url(#nodeglow)" />
                <text x="380" y="322" fontFamily="var(--font-mono)" fontSize="11" fill="var(--c-ink-1)">APAC-SE</text>
                <circle cx="190" cy="360" r="4" fill="var(--c-amber)" filter="url(#nodeglow)" />
                <text x="120" y="378" fontFamily="var(--font-mono)" fontSize="11" fill="var(--c-ink-1)">SA-SOUTH</text>
              </svg>
            </div>

            <div className="signature-caption">
              <span className="eyebrow">Global threat intelligence network</span>
              <p>
                Sentinel&apos;s monitoring core synchronizes with regional nodes in real time,
                so every signal reaches the right team within minutes.
              </p>
              <span className="network-status-line">
                <span className="status-dot" />
                Network status: operational
              </span>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}