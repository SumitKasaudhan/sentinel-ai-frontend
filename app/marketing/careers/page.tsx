"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/footer pages/careers.css";

const JOBS = [
  {
    title: "Frontend Engineer",
    type: "Full Time",
    location: "Remote",
    description:
      "Build premium enterprise user experiences using Next.js, TypeScript and modern frontend tooling.",
  },
  {
    title: "Security Research Intern",
    type: "Internship",
    location: "Remote",
    description:
      "Research emerging threats, OSINT workflows and AI security attack vectors.",
  },
  {
    title: "Full Stack Engineer",
    type: "Full Time",
    location: "Remote",
    description:
      "Develop core platform services, APIs and intelligence pipelines powering Sentinel AI.",
  },
];

const WHY_POINTS = [
  {
    title: "Mission Driven",
    description:
      "Build products that help organizations defend against modern cyber threats.",
  },
  {
    title: "Remote Friendly",
    description:
      "Work from anywhere while collaborating with a global team.",
  },
  {
    title: "High Ownership",
    description: "Engineers and designers own products end-to-end.",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Application" },
  { step: "02", title: "Intro Call" },
  { step: "03", title: "Technical Round" },
  { step: "04", title: "Final Discussion" },
  { step: "05", title: "Offer" },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />

      <main className="careers-page">
        <div className="careers-grid-overlay" aria-hidden="true" />

        <div className="careers-container">
          {/* HERO */}
          <section className="careers-hero">
            <div className="careers-hero-content">
              <span className="careers-eyebrow">
                <span className="careers-eyebrow-bracket">//</span> CAREERS
                AT SENTINEL AI
              </span>

              <h1>Build the future of AI-powered cybersecurity.</h1>

              <p>
                We&rsquo;re building the next generation of threat
                intelligence, attack surface management and AI security
                tooling.
              </p>

              <div className="careers-hero-actions">
                <a href="#jobs" className="careers-primary-btn">
                  View Open Roles
                  <ArrowRight size={16} />
                </a>

                <Link href="/marketing/contact" className="careers-secondary-btn">
                  Contact Recruiting
                </Link>
              </div>
            </div>

            <div className="careers-hero-visual">
              <svg
                className="careers-orbit-svg"
                viewBox="0 0 400 400"
                aria-hidden="true"
              >
                <circle cx="200" cy="200" r="160" className="careers-orbit-ring" />
                <circle cx="200" cy="200" r="100" className="careers-orbit-ring" />

                <circle cx="340" cy="160" r="5" className="careers-orbit-node" style={{ animationDelay: "0s" }} />
                <circle cx="80" cy="240" r="5" className="careers-orbit-node" style={{ animationDelay: "0.5s" }} />
                <circle cx="250" cy="60" r="4" className="careers-orbit-node" style={{ animationDelay: "1s" }} />
                <circle cx="150" cy="330" r="4" className="careers-orbit-node" style={{ animationDelay: "1.5s" }} />
                <circle cx="200" cy="200" r="4" className="careers-orbit-node" style={{ animationDelay: "2s" }} />
              </svg>

              <div className="careers-console">
                <div className="careers-console-header">
                  <span className="careers-console-dot" />
                  <span className="careers-console-dot" />
                  <span className="careers-console-dot" />
                  <span className="careers-console-title">careers@sentinel:~</span>
                </div>

                <div className="careers-console-body">
                  <p className="careers-console-line">
                    <span className="careers-prompt">$</span> cat status.json
                  </p>
                  <pre className="careers-console-json">{`{
  "open_roles": ${JOBS.length},
  "location": "Remote",
  "hiring": true
}`}</pre>
                  <p className="careers-console-line">
                    <span className="careers-cursor" />
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* WHY US */}
          <section className="careers-why-section">
            <div className="careers-section-heading">
              <span className="careers-eyebrow">
                <span className="careers-eyebrow-bracket">01</span> WHY
                SENTINEL AI
              </span>
              <h2>A small team solving large cybersecurity challenges.</h2>
            </div>

            <div className="careers-why-list">
              {WHY_POINTS.map((point, i) => (
                <div key={point.title} className="careers-why-row">
                  <span className="careers-why-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* JOBS */}
          <section id="jobs" className="careers-jobs-section">
            <div className="careers-section-heading">
              <span className="careers-eyebrow">
                <span className="careers-eyebrow-bracket">02</span> OPEN
                POSITIONS
              </span>
              <h2>Join us in building the future of cybersecurity.</h2>
            </div>

            <div className="careers-jobs-list">
              {JOBS.map((job, i) => (
                <div key={job.title} className="careers-job-row">
                  <span className="careers-job-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="careers-job-main">
                    <div className="careers-job-title-row">
                      <h3>{job.title}</h3>
                      <span className="careers-job-tag">{job.type}</span>
                      <span className="careers-job-tag">{job.location}</span>
                    </div>
                    <p>{job.description}</p>
                  </div>

                  <a
                    href={`mailto:careers@sentinel-ai.com?subject=${encodeURIComponent(
                      "Application: " + job.title
                    )}`}
                    className="careers-job-apply-btn"
                  >
                    Apply
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* PROCESS */}
          <section className="careers-process-section">
            <div className="careers-section-heading">
              <span className="careers-eyebrow">
                <span className="careers-eyebrow-bracket">03</span> HOW WE
                HIRE
              </span>
              <h2>Hiring process</h2>
            </div>

            <div className="careers-process-track">
              {PROCESS_STEPS.map((s) => (
                <div key={s.step} className="careers-process-step">
                  <span className="careers-step-index">{s.step}</span>
                  <h4>{s.title}</h4>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="careers-cta-section">
            <span className="careers-eyebrow">
              <span className="careers-eyebrow-bracket">//</span> GET IN
              TOUCH
            </span>

            <h2>Don&rsquo;t see a role that fits?</h2>

            <p>
              We&rsquo;re always interested in meeting exceptional
              engineers, researchers and designers.
            </p>

            <a href="mailto:careers@sentinel-ai.com" className="careers-cta-btn">
              careers@sentinel-ai.com
              <ArrowRight size={16} />
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}