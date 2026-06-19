"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import "@/styles/marketing/footer pages/security.css";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Zap,
  Globe2,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  Server,
  AlertTriangle,
} from "lucide-react";

/* ─── Threat feed mock data ─── */
const FEED_EVENTS = [
  { id: 1, type: "BLOCKED",  region: "AS-EAST",   threat: "SQL Injection attempt",       ip: "185.220.101.47"  },
  { id: 2, type: "BLOCKED",  region: "EU-WEST",   threat: "Credential stuffing attack",  ip: "91.108.4.102"    },
  { id: 3, type: "MITIGATED",region: "US-EAST",   threat: "DDoS layer-7 flood",          ip: "103.21.244.0"    },
  { id: 4, type: "BLOCKED",  region: "AP-SOUTH",  threat: "XSS payload injection",       ip: "198.54.117.10"   },
  { id: 5, type: "QUARANTINED",region:"EU-NORTH", threat: "Ransomware signature match",  ip: "45.95.147.236"   },
  { id: 6, type: "BLOCKED",  region: "US-WEST",   threat: "Zero-day exploit probe",      ip: "104.21.55.30"    },
  { id: 7, type: "MITIGATED",region: "SA-EAST",   threat: "Brute-force SSH sweep",       ip: "177.53.144.21"   },
  { id: 8, type: "BLOCKED",  region: "AF-SOUTH",  threat: "CSRF token forgery",          ip: "196.216.2.10"    },
];

export default function SecurityPage() {

  /* ── Live counters ── */
  const [threats, setThreats] = useState(14_892);
  const [nodes,   setNodes]   = useState(412);
  const [latency, setLatency] = useState(12);
  const [feedIdx, setFeedIdx] = useState(0);
  const [feedVisible, setFeedVisible] = useState(true);

  /* ── Encryption bar ── */
  const [encStrength, setEncStrength] = useState(98);

  /* ── Hero counter animation ── */
  const [heroCount, setHeroCount] = useState(0);
  const heroTarget = 14_892;
  const heroStarted = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── Intersection Observer for hero counter ── */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !heroStarted.current) {
          heroStarted.current = true;
          let start = 0;
          const step = Math.ceil(heroTarget / 80);
          const t = setInterval(() => {
            start += step;
            if (start >= heroTarget) { setHeroCount(heroTarget); clearInterval(t); }
            else setHeroCount(start);
          }, 18);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Periodic live updates ── */
  useEffect(() => {
    const t = setInterval(() => {
      setThreats(p => p + Math.floor(Math.random() * 5));
      setNodes(410 + Math.floor(Math.random() * 8));
      setLatency(10 + Math.floor(Math.random() * 5));
      setEncStrength(96 + Math.floor(Math.random() * 4));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  /* ── Threat feed rotation ── */
  useEffect(() => {
    const t = setInterval(() => {
      setFeedVisible(false);
      setTimeout(() => {
        setFeedIdx(p => (p + 1) % FEED_EVENTS.length);
        setFeedVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const currentEvent = FEED_EVENTS[feedIdx];

  /* ── Compliance items ── */
  const compliance = useMemo(() => [
    {
      icon: <ShieldCheck size={20} />,
      label: "01",
      title: "SOC 2 Type II",
      description: "Continuous operational security auditing against the AICPA trust service criteria.",
    },
    {
      icon: <Lock size={20} />,
      label: "02",
      title: "AES-256 Encryption",
      description: "Military-grade encryption covers all telemetry, storage, and transit channels.",
    },
    {
      icon: <Database size={20} />,
      label: "03",
      title: "Zero Trust Architecture",
      description: "Identity-verified access at every layer. No implicit trust, ever.",
    },
    {
      icon: <Eye size={20} />,
      label: "04",
      title: "Continuous Monitoring",
      description: "24/7 behavioural anomaly detection across all connected infrastructure nodes.",
    },
    {
      icon: <Zap size={20} />,
      label: "05",
      title: "Instant Threat Response",
      description: "Sub-second automated isolation and remediation on critical threat signatures.",
    },
    {
      icon: <Globe2 size={20} />,
      label: "06",
      title: "Global Edge Coverage",
      description: "Distributed defence nodes across 6 continents with regional data residency.",
    },
  ], []);

  const pillars = useMemo(() => [
    {
      icon: <Lock size={22} />,
      title: "End-to-End Encryption",
      body: "All inter-service communication and stored data is protected with AES-256. Keys rotate on a 90-day cycle with HSM-backed storage.",
    },
    {
      icon: <Activity size={22} />,
      title: "Behavioural Analytics",
      body: "ML models trained on billions of event signals surface novel attack patterns before signatures exist for them.",
    },
    {
      icon: <Server size={22} />,
      title: "Isolated Blast Radius",
      body: "Micro-segmented workloads ensure a compromised node cannot propagate laterally within your environment.",
    },
  ], []);

  const typeColor: Record<string, string> = {
    BLOCKED:    "var(--sec-cyan)",
    MITIGATED:  "var(--sec-indigo-light)",
    QUARANTINED:"var(--sec-amber)",
  };

  return (
    <>
      <Navbar />

      <main className="sec-page">

        {/* ── Live threat ticker ── */}
        <div className="sec-ticker">
          <span className="sec-ticker__label">
            <span className="sec-ticker__dot" />
            LIVE FEED
          </span>
          <div className={`sec-ticker__event ${feedVisible ? "visible" : ""}`}>
            <span
              className="sec-ticker__type"
              style={{ color: typeColor[currentEvent.type] }}
            >
              {currentEvent.type}
            </span>
            <span className="sec-ticker__sep">·</span>
            <span className="sec-ticker__region">{currentEvent.region}</span>
            <span className="sec-ticker__sep">·</span>
            <span className="sec-ticker__threat">{currentEvent.threat}</span>
            <span className="sec-ticker__sep">·</span>
            <span className="sec-ticker__ip">{currentEvent.ip}</span>
          </div>
          <span className="sec-ticker__status">
            <CheckCircle2 size={12} />
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>

        <div className="sec-container">

          {/* ════════ HERO ════════ */}
          <section className="sec-hero">

            <div className="sec-hero__left">
              <div className="sec-hero__eyebrow">
                <span className="sec-dot" />
                Enterprise Security Platform
              </div>

              <h1 className="sec-hero__h1">
                Security that<br />
                <span className="sec-hero__accent">never sleeps.</span>
              </h1>

              <p className="sec-hero__sub">
                Autonomous threat detection, encrypted neural telemetry,
                and adaptive zero-trust defence — built for infrastructure
                that cannot afford downtime.
              </p>

              <button
                className="sec-cta-btn"
                onClick={() => (window.location.href = "/marketing/contact")}
              >
                Talk to our security team
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Right: live stats panel */}
            <div className="sec-hero__right" ref={heroRef}>

              <div className="sec-hero__panel">

                <div className="sec-panel__header">
                  <span className="sec-panel__title">Sentinel AI — Global Defence Status</span>
                  <span className="sec-panel__live">
                    <span className="sec-dot sec-dot--sm" />
                    LIVE
                  </span>
                </div>

                <div className="sec-panel__big">
                  <span className="sec-panel__num">
                    {heroCount.toLocaleString()}
                  </span>
                  <span className="sec-panel__numlabel">
                    threats neutralised today
                  </span>
                </div>

                <div className="sec-panel__row3">
                  <div className="sec-panel__metric">
                    <span className="sec-panel__mval">{nodes}</span>
                    <span className="sec-panel__mkey">Active Nodes</span>
                  </div>
                  <div className="sec-panel__divider" />
                  <div className="sec-panel__metric">
                    <span className="sec-panel__mval">99.999%</span>
                    <span className="sec-panel__mkey">Uptime SLA</span>
                  </div>
                  <div className="sec-panel__divider" />
                  <div className="sec-panel__metric">
                    <span className="sec-panel__mval">{latency}ms</span>
                    <span className="sec-panel__mkey">Response p95</span>
                  </div>
                </div>

                {/* mini terminal */}
                <div className="sec-panel__terminal">
                  <div className="sec-term-line"><span className="sec-term-prompt">$</span> sentinel status --global</div>
                  <div className="sec-term-line sec-term-ok">[OK] Encryption layer — AES-256-GCM active</div>
                  <div className="sec-term-line sec-term-ok">[OK] Zero-trust policy engine — enforcing</div>
                  <div className="sec-term-line sec-term-ok">[OK] Anomaly models — {encStrength}% confidence</div>
                  <div className="sec-term-line sec-term-ok">[OK] Edge nodes — {nodes}/420 online</div>
                  <div className="sec-term-line sec-term-blink">[  ] Scanning horizon…</div>
                </div>

              </div>
            </div>
          </section>

          {/* ════════ COMPLIANCE GRID ════════ */}
          <section className="sec-section">
            <div className="sec-section__head">
              <h2 className="sec-section__h2">Compliance &amp; Standards</h2>
              <p className="sec-section__sub">
                Every control independently verified. No security-theatre.
              </p>
            </div>

            <div className="sec-compliance-grid">
              {compliance.map((item) => (
                <div key={item.label} className="sec-comp-card">
                  <div className="sec-comp-card__top">
                    <span className="sec-comp-card__icon">{item.icon}</span>
                    <span className="sec-comp-card__num">{item.label}</span>
                  </div>
                  <h3 className="sec-comp-card__title">{item.title}</h3>
                  <p className="sec-comp-card__desc">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ════════ ENCRYPTION / ARCHITECTURE ════════ */}
          <section className="sec-arch">

            <div className="sec-arch__left">
              <div className="sec-section__head" style={{ marginBottom: "2.5rem" }}>
                <h2 className="sec-section__h2">Defence Architecture</h2>
                <p className="sec-section__sub">
                  Three interlocking layers that make lateral movement statistically impossible.
                </p>
              </div>

              {pillars.map((p, i) => (
                <div key={i} className="sec-pillar">
                  <div className="sec-pillar__icon">{p.icon}</div>
                  <div>
                    <h3 className="sec-pillar__title">{p.title}</h3>
                    <p className="sec-pillar__body">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sec-arch__right">
              {/* Encryption strength meter */}
              <div className="sec-meter-card">
                <div className="sec-meter-card__head">
                  <span>Encryption Strength</span>
                  <span className="sec-meter-card__val">{encStrength}%</span>
                </div>
                <div className="sec-meter-track">
                  <div
                    className="sec-meter-fill"
                    style={{
                      width: `${encStrength}%`,
                      transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                </div>

                {/* Segmented signal bars */}
                <div className="sec-signal-grid">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="sec-signal-bar"
                      style={{
                        opacity: i / 20 < encStrength / 100 ? 1 : 0.15,
                        height: `${8 + i * 2}px`,
                        transition: `opacity 0.5s ease ${i * 20}ms`,
                      }}
                    />
                  ))}
                </div>

                <div className="sec-cipher-list">
                  <div className="sec-cipher-item">
                    <CheckCircle2 size={14} />
                    <span>AES-256-GCM data-at-rest</span>
                  </div>
                  <div className="sec-cipher-item">
                    <CheckCircle2 size={14} />
                    <span>TLS 1.3 data-in-transit</span>
                  </div>
                  <div className="sec-cipher-item">
                    <CheckCircle2 size={14} />
                    <span>ECDH ephemeral key exchange</span>
                  </div>
                  <div className="sec-cipher-item">
                    <CheckCircle2 size={14} />
                    <span>HSM-backed key storage</span>
                  </div>
                </div>
              </div>

              {/* Threat origin map placeholder */}
              <div className="sec-origin-card">
                <div className="sec-origin-card__head">
                  <AlertTriangle size={14} />
                  <span>Threat Origin Heat — Last 24h</span>
                </div>
                <div className="sec-heatmap">
                  {[
                    { region: "Asia Pacific",    pct: 38 },
                    { region: "Eastern Europe",  pct: 27 },
                    { region: "North America",   pct: 18 },
                    { region: "Western Europe",  pct: 10 },
                    { region: "Other",           pct: 7  },
                  ].map((r) => (
                    <div key={r.region} className="sec-heatmap__row">
                      <span className="sec-heatmap__region">{r.region}</span>
                      <div className="sec-heatmap__track">
                        <div
                          className="sec-heatmap__fill"
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span className="sec-heatmap__pct">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ════════ ETHICS / GOVERNANCE ════════ */}
          <section className="sec-ethics">
            <div className="sec-ethics__badge">Responsible AI</div>
            <h2 className="sec-ethics__h2">
              Governance you can<br />audit end-to-end.
            </h2>
            <p className="sec-ethics__sub">
              Security tooling that acts invisibly is a liability. Sentinel AI exposes every
              decision, every action, every escalation — so your team is always in control.
            </p>

            <div className="sec-ethics__grid">
              {[
                { label: "Transparent decision logs",      desc: "Every automated action is logged, timestamped, and attributable." },
                { label: "Human override on all automations", desc: "One-click pause or rollback for any policy enforcement." },
                { label: "Privacy-first data handling",    desc: "Zero telemetry sold. Your data never trains third-party models." },
                { label: "Explainable threat scoring",     desc: "Each risk score comes with a ranked evidence breakdown." },
              ].map((item) => (
                <div key={item.label} className="sec-ethics__item">
                  <CheckCircle2 size={16} className="sec-ethics__check" />
                  <div>
                    <p className="sec-ethics__item-title">{item.label}</p>
                    <p className="sec-ethics__item-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════════ CTA ════════ */}
          <section className="sec-bottom-cta">
            <div className="sec-bottom-cta__inner">
              <div className="sec-bottom-cta__text">
                <h3>Need enterprise security documentation?</h3>
                <p>
                  Architecture reviews, penetration test reports, and compliance
                  packs are available to qualified enterprise prospects.
                </p>
              </div>
              <button
                className="sec-cta-btn sec-cta-btn--light"
                onClick={() => (window.location.href = "/marketing/contact")}
              >
                Contact Security Team
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}