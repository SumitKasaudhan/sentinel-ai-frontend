"use client";

import Link from "next/link";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/features/features2.css";

import {
  Shield,
  Globe,
  Activity,
  FileBarChart2,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Vulnerability Scanning",
    description:
      "Continuous scanning identifies misconfigurations and vulnerabilities across your infrastructure before they can be exploited.",
    icon: Shield,
    badge1: "Continuous Scanning",
    badge2: "CVE Intelligence",
  },
  {
    title: "Real-time Threat Response",
    description:
      "Automated playbooks isolate compromised assets and block malicious traffic the moment a threat is confirmed.",
    icon: Zap,
    stat: "< 2s",
    statLabel: "Time to isolate",
  },
  {
    title: "Global Intelligence Network",
    description:
      "Threat signals shared across the Sentinel network strengthen detection for every customer in real time.",
    icon: Globe,
  },
  {
    title: "Professional Reporting & Telemetry",
    description:
      "Audit-ready reports and detailed scan history, exportable for compliance reviews and stakeholder updates.",
    icon: FileBarChart2,
    compliance: ["SOC 2 Ready", "ISO 27001 Ready"],
  },
];

const liveScans = [
  { domain: "api.client-app.com", status: "critical", detail: "2 findings" },
  { domain: "auth.client-app.com", status: "medium", detail: "1 finding" },
  { domain: "cdn.client-app.com", status: "resolved", detail: "0 findings" },
  { domain: "db.client-app.com", status: "monitoring", detail: "Queued" },
];

const statusLabels: Record<string, string> = {
  critical: "Critical",
  medium: "Medium",
  resolved: "Resolved",
  monitoring: "Monitoring",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      <main className="features-page">
        {/* GRID */}
        <div className="features-grid" />

        {/* HERO */}
        <section className="features-hero">
          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-dot" />
              ALL SYSTEMS MONITORED
            </div>

            <h1>
              Continuous defense for
              <span>modern infrastructure</span>
            </h1>

            <p>
              Sentinel AI scans, detects, and responds to threats around the
              clock — so your team can focus on building, not firefighting.
            </p>

            <Link href="/auth/register" className="hero-btn">
              Start Monitoring
              <ArrowRight size={18} />
            </Link>

            {/* STATS */}
            <div className="hero-stats">
              <div>
                <h3>&lt;2<span>s</span></h3>
                <p>Time to first scan</p>
              </div>

              <div>
                <h3>24<span>/7</span></h3>
                <p>Continuous monitoring</p>
              </div>

              <div>
                <h3>256<span>-bit</span></h3>
                <p>Encryption at rest</p>
              </div>
            </div>
          </div>

          {/* RIGHT — live console mock */}
          <div className="hero-right">
            <div className="console">
              <div className="console-header">
                <span className="console-title">Network Shield</span>
                <span className="console-live">
                  <span className="live-dot" />
                  LIVE
                </span>
              </div>

              <div className="console-body">
                {liveScans.map((scan) => (
                  <div className="console-row" key={scan.domain}>
                    <span className="row-domain">{scan.domain}</span>
                    <span className={`status-pill status-${scan.status}`}>
                      <span className="status-dot" />
                      {statusLabels[scan.status]}
                    </span>
                    <span className="row-detail">{scan.detail}</span>
                  </div>
                ))}
              </div>

              <div className="console-footer">
                <div className="scan-bar">
                  <div className="scan-bar-fill" />
                </div>
                <span>Scanning 247 endpoints…</span>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="capabilities-section">
          <div className="section-heading">
            <h2>Core Capabilities</h2>
            <p>
              Modular defense architecture engineered for enterprise security
              operations.
            </p>
          </div>

          <div className="capabilities-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`feature-card ${index === 0 ? "large" : ""} ${
                    index === 3 ? "wide" : ""
                  }`}
                >
                  <div className="feature-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  {feature.badge1 && (
                    <div className="feature-tags">
                      <span>{feature.badge1}</span>
                      <span>{feature.badge2}</span>
                    </div>
                  )}

                  {feature.stat && (
                    <div className="speed-meter">
                      <div className="speed-row">
                        <span>{feature.statLabel}</span>
                        <span>[{feature.stat}]</span>
                      </div>
                      <div className="speed-bar">
                        <div className="speed-fill" />
                      </div>
                    </div>
                  )}

                  {feature.compliance && (
                    <div className="compliance-grid">
                      {feature.compliance.map((item) => (
                        <div key={item}>
                          <CheckCircle2 size={16} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* INFRASTRUCTURE */}
        <section className="infra-section">
          <div className="infra-header">
            <div>
              <h2>Technical Infrastructure</h2>
              <p>Mission-critical standards for enterprise-grade operations.</p>
            </div>
            <span>[ STATUS: OPERATIONAL ]</span>
          </div>

          <div className="infra-grid">
            <div>
              <h4>ENCRYPTION STANDARD</h4>
              <h3>AES-256-GCM</h3>
              <p>Forward secrecy enabled.</p>
            </div>

            <div>
              <h4>AVAILABILITY SLA</h4>
              <h3>99.999%</h3>
              <p>Financially backed uptime.</p>
            </div>

            <div>
              <h4>DATA LOCALIZATION</h4>
              <h3>Multi-Region</h3>
              <p>GDPR & CCPA routing.</p>
            </div>

            <div>
              <h4>API RATE LIMITS</h4>
              <h3>10k/sec</h3>
              <p>Burst tenant capacity.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <Activity size={36} />
          <h2>See your risk surface in real time.</h2>
          <p>Connect your infrastructure and get your first scan results in minutes.</p>
          <Link href="/auth/register" className="cta-btn">
            Get Started
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}