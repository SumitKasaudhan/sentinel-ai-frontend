"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/footer pages/privacy.css";

import {
  ShieldCheck,
  Database,
  Lock,
  Globe,
  ChevronRight,
  Mail,
} from "lucide-react";

export default function PrivacyPage() {
  /* =========================================
     ACTIVE SECTION
  ========================================= */

  const [activeSection, setActiveSection] =
    useState("overview");

  /* =========================================
     SECTIONS
  ========================================= */

  const sections = useMemo(
    () => [
      {
        id: "overview",
        title: "Overview",
      },

      {
        id: "collection",
        title: "Data Collection",
      },

      {
        id: "security",
        title: "Security",
      },

      {
        id: "sharing",
        title: "Information Sharing",
      },

      {
        id: "rights",
        title: "User Rights",
      },
    ],
    []
  );

  /* =========================================
     SCROLL SPY
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.scrollY + 140;

      sections.forEach((section) => {
        const element =
          document.getElementById(
            section.id
          );

        if (!element) return;

        const offsetTop =
          element.offsetTop;

        const height =
          element.offsetHeight;

        if (
          scrollPosition >=
            offsetTop &&
          scrollPosition <
            offsetTop + height
        ) {
          setActiveSection(
            section.id
          );
        }
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [sections]);

  /* =========================================
     SCROLL TO SECTION
  ========================================= */

  const scrollToSection = (
    id: string
  ) => {
    const element =
      document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Navbar />

      <main className="privacy-page">

        <div className="privacy-layout">

          {/* =========================================
              SIDEBAR
          ========================================= */}

          <aside className="privacy-sidebar">

            <div className="privacy-sidebar__sticky">

              <div className="privacy-sidebar__label">
                PRIVACY INDEX
              </div>

              <nav className="privacy-nav">

                {sections.map(
                  (section) => (
                    <button
                      key={section.id}
                      className={`privacy-nav__item ${
                        activeSection ===
                        section.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        scrollToSection(
                          section.id
                        )
                      }
                    >
                      <ChevronRight
                        size={16}
                      />

                      {section.title}
                    </button>
                  )
                )}
              </nav>

              {/* HELP */}

              <div className="privacy-help">

                <h4>
                  Need Assistance?
                </h4>

                <p>
                  Contact our privacy
                  operations division for
                  data access or compliance
                  requests.
                </p>

                <button
                  onClick={() =>
                    (window.location.href =
                      "/marketing/contact")
                  }
                >
                  Contact Privacy Team
                </button>
              </div>
            </div>
          </aside>

          {/* =========================================
              CONTENT
          ========================================= */}

          <div className="privacy-content">

            {/* HEADER */}

            <div className="privacy-meta">
              <span>
                LAST UPDATED · 2026
              </span>

              <span>
                GDPR COMPLIANT
              </span>
            </div>

            <h1 className="privacy-title">
              Privacy Policy
            </h1>

            <p className="privacy-subtitle">
              Sentinel AI maintains strict
              governance standards to
              protect user information,
              infrastructure telemetry, and
              operational intelligence.
            </p>

            <div className="privacy-banner" />

            {/* =========================================
                OVERVIEW
            ========================================= */}

            <section
              id="overview"
              className="privacy-section"
            >
              <h2>
                Privacy Overview
              </h2>

              <p>
                We collect minimal
                operational data required
                for platform performance,
                security analytics, and
                threat prevention.
              </p>

              <p>
                All information is encrypted
                in transit and at rest using
                enterprise-grade protection
                standards.
              </p>

              <div className="privacy-list">

                <div className="privacy-list__item">
                  <ShieldCheck
                    size={18}
                  />

                  End-to-end encrypted
                  telemetry systems
                </div>

                <div className="privacy-list__item">
                  <Lock size={18} />

                  Zero-trust infrastructure
                  access controls
                </div>

                <div className="privacy-list__item">
                  <Database
                    size={18}
                  />

                  Minimal data retention
                  architecture
                </div>
              </div>
            </section>

            {/* =========================================
                COLLECTION
            ========================================= */}

            <section
              id="collection"
              className="privacy-section"
            >
              <h2>
                Data Collection
              </h2>

              <p>
                We gather platform
                diagnostics, usage metadata,
                and threat indicators to
                maintain operational
                integrity.
              </p>

              <div className="privacy-cards">

                <div className="privacy-card">
                  <h4>
                    Usage Data
                  </h4>

                  <p>
                    Browser events,
                    interaction metrics,
                    feature utilization.
                  </p>
                </div>

                <div className="privacy-card">
                  <h4>
                    Security Logs
                  </h4>

                  <p>
                    Threat telemetry,
                    anomaly detection,
                    authentication records.
                  </p>
                </div>
              </div>
            </section>

            {/* =========================================
                SECURITY
            ========================================= */}

            <section
              id="security"
              className="privacy-section"
            >
              <h2>
                Security Standards
              </h2>

              <p>
                Sentinel AI operates using
                military-grade defensive
                architecture and continuous
                monitoring protocols.
              </p>

              <div className="privacy-security-grid">

                <div className="security-box">
                  <ShieldCheck
                    size={18}
                  />

                  SOC 2 Certified
                </div>

                <div className="security-box">
                  <Lock size={18} />

                  AES-256 Encryption
                </div>

                <div className="security-box">
                  <Globe size={18} />

                  Global Threat Monitoring
                </div>

                <div className="security-box highlight">
                  ACTIVE SECURITY STATUS

                  <span>
                    NOMINAL
                  </span>
                </div>
              </div>
            </section>

            {/* =========================================
                SHARING
            ========================================= */}

            <section
              id="sharing"
              className="privacy-section"
            >
              <h2>
                Information Sharing
              </h2>

              <p>
                Sentinel AI does not sell
                user data. Information is
                shared only when legally
                required or operationally
                necessary.
              </p>

              <div className="privacy-table">

                <div className="privacy-table__head">
                  <span>
                    CATEGORY
                  </span>

                  <span>
                    PURPOSE
                  </span>
                </div>

                <div className="privacy-table__row">
                  <span>
                    Compliance
                  </span>

                  <span>
                    Regulatory obligations
                    and legal requests
                  </span>
                </div>

                <div className="privacy-table__row">
                  <span>
                    Security Operations
                  </span>

                  <span>
                    Threat mitigation and
                    infrastructure defense
                  </span>
                </div>
              </div>
            </section>

            {/* =========================================
                RIGHTS
            ========================================= */}

            <section
              id="rights"
              className="privacy-section"
            >
              <h2>
                User Rights
              </h2>

              <p>
                Users may request data
                access, deletion, or export
                in compliance with global
                privacy regulations.
              </p>

              <div className="privacy-briefcase">

                <div className="privacy-briefcase__top">
                  <Mail size={18} />

                  Privacy Operations
                </div>

                <p>
                  Contact:
                  privacy@sentinel.ai
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}