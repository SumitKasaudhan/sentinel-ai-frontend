"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/footer pages/about.css";

import {
  Shield,
  Radar,
  BrainCircuit,
  ArrowRight,
  Terminal,
} from "lucide-react";

const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "Overview" },
  { id: "mission", label: "Mission" },
  { id: "platform", label: "Platform" },
  { id: "why", label: "Why Us" },
  { id: "team", label: "Team" },
  { id: "cta", label: "Get Started" },
];

const CONSOLE_MESSAGES = [
  "scanning external attack surface...",
  "correlating threat intelligence feeds...",
  "0 critical exposures found",
  "monitoring active — status: operational",
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [consoleLine, setConsoleLine] = useState(0);

  // Rotate the console readout text
  useEffect(() => {
    const interval = setInterval(() => {
      setConsoleLine((prev) => (prev + 1) % CONSOLE_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Track which section is in view for the side rail
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <Navbar />

      <main className="about-page">
        <div className="about-grid-overlay" aria-hidden="true" />

        {/* SECTION PROGRESS RAIL */}
        <nav className="about-section-rail" aria-label="Page sections">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`about-rail-dot ${
                activeSection === s.id ? "active" : ""
              }`}
            >
              <span className="about-rail-label">{s.label}</span>
            </a>
          ))}
        </nav>

        <div className="about-container">
          {/* HERO */}
          <section id="hero" className="about-hero">
            <div className="about-hero-content">
              <span className="about-eyebrow">
                <span className="about-eyebrow-bracket">//</span> ABOUT
                SENTINEL AI
              </span>

              <h1>
                Building the future of{" "}
                <span className="about-text-accent">AI-powered</span>{" "}
                cybersecurity.
              </h1>

              <p>
                Sentinel AI helps organizations discover, monitor and secure
                their external attack surface through intelligent
                automation, threat intelligence and AI-driven analysis.
              </p>

              <div className="about-hero-actions">
                <Link href="/auth/register" className="about-primary-btn">
                  Start Free Scan
                  <ArrowRight size={16} />
                </Link>

                <Link href="/marketing/contact" className="about-secondary-btn">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="about-hero-visual">
              <svg
                className="about-radar-svg"
                viewBox="0 0 400 400"
                aria-hidden="true"
              >
                <circle cx="200" cy="200" r="170" className="about-radar-ring" />
                <circle cx="200" cy="200" r="120" className="about-radar-ring" />
                <circle cx="200" cy="200" r="70" className="about-radar-ring" />
                <line x1="200" y1="20" x2="200" y2="380" className="about-radar-crosshair" />
                <line x1="20" y1="200" x2="380" y2="200" className="about-radar-crosshair" />

                <g className="about-radar-sweep">
                  <path
                    d="M200,200 L200,30 A170,170 0 0 1 309.3,69.8 Z"
                    className="about-radar-sweep-fill"
                  />
                </g>

                <circle cx="260" cy="120" r="5" className="about-radar-node" style={{ animationDelay: "0s" }} />
                <circle cx="300" cy="260" r="5" className="about-radar-node" style={{ animationDelay: "0.6s" }} />
                <circle cx="140" cy="270" r="5" className="about-radar-node" style={{ animationDelay: "1.2s" }} />
                <circle cx="125" cy="145" r="4" className="about-radar-node" style={{ animationDelay: "1.8s" }} />
              </svg>

              <div className="about-console">
                <div className="about-console-header">
                  <span className="about-console-dot" />
                  <span className="about-console-dot" />
                  <span className="about-console-dot" />
                  <span className="about-console-title">sentinel://status</span>
                </div>

                <div className="about-console-body">
                  <p className="about-console-line">
                    <span className="about-prompt">$</span>{" "}
                    {CONSOLE_MESSAGES[consoleLine]}
                    <span className="about-cursor" />
                  </p>

                  <div className="about-console-stat">
                    <span>UPTIME</span>
                    <span className="about-stat-value">99.9%</span>
                  </div>

                  <div className="about-console-stat">
                    <span>STATUS</span>
                    <span className="about-stat-value about-status-live">
                      <span className="about-pulse-dot" />
                      OPERATIONAL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MISSION */}
          <section id="mission" className="about-mission-section">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                <span className="about-eyebrow-bracket">01</span> OUR MISSION
              </span>
              <h2>Security teams deserve better tools.</h2>
            </div>

            <div className="about-mission-grid">
              <p className="about-mission-lead">
                Modern organizations face increasingly sophisticated cyber
                threats.
              </p>
              <p>
                Traditional security workflows often create complexity, slow
                investigations and fragmented visibility. Sentinel AI was
                built to help security teams gain clarity, accelerate
                response and make smarter security decisions through
                automation and artificial intelligence.
              </p>
            </div>
          </section>

          {/* PLATFORM */}
          <section id="platform" className="about-platform-section">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                <span className="about-eyebrow-bracket">02</span> PLATFORM
              </span>
              <h2>What we build</h2>
            </div>

            <div className="about-platform-grid">
              <div className="about-platform-card">
                <div className="about-card-top">
                  <div className="about-icon-frame">
                    <Shield size={20} />
                  </div>
                  <span className="about-module-id">SEC.01</span>
                </div>
                <h3>Attack Surface Management</h3>
                <p>
                  Discover exposed assets, vulnerabilities and security
                  risks across your environment.
                </p>
              </div>

              <div className="about-platform-card">
                <div className="about-card-top">
                  <div className="about-icon-frame">
                    <Radar size={20} />
                  </div>
                  <span className="about-module-id">SEC.02</span>
                </div>
                <h3>Threat Intelligence</h3>
                <p>
                  Monitor emerging threats, enrich investigations and
                  improve security visibility.
                </p>
              </div>

              <div className="about-platform-card">
                <div className="about-card-top">
                  <div className="about-icon-frame">
                    <BrainCircuit size={20} />
                  </div>
                  <span className="about-module-id">SEC.03</span>
                </div>
                <h3>AI Security Operations</h3>
                <p>
                  Use AI-powered insights to accelerate investigations and
                  response workflows.
                </p>
              </div>
            </div>
          </section>

          {/* WHY */}
          <section id="why" className="about-why-section">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                <span className="about-eyebrow-bracket">03</span> WHY
                SENTINEL AI
              </span>
              <h2>Designed for modern security teams.</h2>
            </div>

            <div className="about-why-list">
              <div className="about-why-row">
                <span className="about-why-index">01</span>
                <h3>Security First</h3>
                <p>Every decision begins with customer security and trust.</p>
              </div>

              <div className="about-why-row">
                <span className="about-why-index">02</span>
                <h3>Built for Operators</h3>
                <p>Designed for analysts, engineers and security leaders.</p>
              </div>

              <div className="about-why-row">
                <span className="about-why-index">03</span>
                <h3>Continuous Innovation</h3>
                <p>Threats evolve rapidly. Our platform evolves faster.</p>
              </div>
            </div>
          </section>

          {/* TEAM */}
          <section id="team" className="about-team-section">
            <div className="about-team-content">
              <div className="about-team-text">
                <span className="about-eyebrow">
                  <span className="about-eyebrow-bracket">04</span> TEAM
                </span>
                <h2>Remote-first. Global mindset.</h2>
                <p>
                  Sentinel AI is built by engineers, security researchers
                  and product builders focused on helping organizations
                  stay ahead of threats.
                </p>
              </div>

              <div className="about-team-visual">
                <svg
                  className="about-globe-svg"
                  viewBox="0 0 400 400"
                  aria-hidden="true"
                >
                  <circle cx="200" cy="200" r="150" className="about-globe-outline" />
                  <ellipse cx="200" cy="200" rx="60" ry="150" className="about-globe-line" />
                  <ellipse cx="200" cy="200" rx="110" ry="150" className="about-globe-line" />
                  <ellipse cx="200" cy="150" rx="150" ry="35" className="about-globe-line" />
                  <ellipse cx="200" cy="200" rx="150" ry="55" className="about-globe-line" />
                  <ellipse cx="200" cy="250" rx="150" ry="35" className="about-globe-line" />

                  <path d="M200,50 Q270,150 335,150" className="about-data-arc" />
                  <path d="M335,150 Q320,260 290,320" className="about-data-arc" />
                  <path d="M65,160 Q150,250 110,330" className="about-data-arc" />

                  <circle cx="200" cy="50" r="5" className="about-globe-node" />
                  <circle cx="335" cy="150" r="5" className="about-globe-node" />
                  <circle cx="290" cy="320" r="5" className="about-globe-node" />
                  <circle cx="110" cy="330" r="5" className="about-globe-node" />
                  <circle cx="65" cy="160" r="5" className="about-globe-node" />
                </svg>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section id="cta" className="about-cta-section">
            <span className="about-eyebrow">
              <span className="about-eyebrow-bracket">//</span> GET STARTED
            </span>

            <h2>Ready to strengthen your security posture?</h2>
            <p>Start monitoring your attack surface with Sentinel AI today.</p>

            <Link href="/scan" className="about-cta-btn">
              <Terminal size={16} />
              Launch Free Scan
              <ArrowRight size={18} />
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}