"use client";

import { useState } from "react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/marketing/footer pages/terms.css";

import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";

export default function TermsPage() {
  /* =========================================
     ACTIVE ACCORDION
  ========================================= */

  const [activeIndex, setActiveIndex] =
    useState<number | null>(0);

  /* =========================================
     TOGGLE
  ========================================= */

  const toggleAccordion = (
    index: number
  ) => {
    setActiveIndex((prev) =>
      prev === index ? null : index
    );
  };

  /* =========================================
     TERMS DATA
  ========================================= */

  const terms = [
    {
      title:
        "Acceptance of Terms",

      content:
        "By accessing Sentinel AI systems, services, or infrastructure, you acknowledge and agree to comply with all operational policies, security requirements, and legal obligations defined within this agreement.",
    },

    {
      title:
        "Authorized Usage",

      content:
        "Users may only access Sentinel AI services through approved interfaces and authenticated channels. Any misuse, reverse engineering, or unauthorized automation attempts are strictly prohibited.",
    },

    {
      title:
        "Data & Privacy",

      content:
        "All platform telemetry, user interactions, and operational metadata are governed by Sentinel AI privacy standards and enterprise-grade security protocols.",
    },

    {
      title:
        "Threat Monitoring",

      content:
        "Sentinel AI continuously monitors infrastructure traffic, authentication systems, and platform events to detect anomalies, intrusions, and malicious activity.",
    },

    {
      title:
        "Service Availability",

      content:
        "While we maintain high availability infrastructure, Sentinel AI reserves the right to perform maintenance, upgrades, or emergency security operations that may temporarily affect service accessibility.",
    },

    {
      title:
        "Account Responsibility",

      content:
        "Users are responsible for maintaining credential confidentiality, enforcing access restrictions, and immediately reporting unauthorized activity.",
    },

    {
      title:
        "Compliance & Enforcement",

      content:
        "Violation of operational, legal, or ethical standards may result in account suspension, service restriction, or escalation to regulatory authorities.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="terms-page">

        <div className="terms-container">

          {/* =========================================
              BREADCRUMB
          ========================================= */}

          <div className="terms-breadcrumb">
            Home / Legal / Terms
          </div>

          {/* =========================================
              HEADER
          ========================================= */}

          <h1 className="terms-title">
            Terms of Service
          </h1>

          <div className="terms-date">
            Last Updated · January 2026
          </div>

          <p className="terms-description">
            These operational terms govern
            the usage of Sentinel AI
            systems, services, security
            infrastructure, and platform
            integrations.
          </p>

          {/* =========================================
              ACCORDION
          ========================================= */}

          <section className="terms-accordion">

            {terms.map(
              (term, index) => (
                <div
                  key={index}
                  className={`terms-item ${
                    activeIndex ===
                    index
                      ? "active"
                      : ""
                  }`}
                >
                  {/* TRIGGER */}

                  <button
                    className="terms-trigger"
                    onClick={() =>
                      toggleAccordion(
                        index
                      )
                    }
                  >
                    <span>
                      {term.title}
                    </span>

                    {activeIndex ===
                    index ? (
                      <ChevronUp
                        size={22}
                      />
                    ) : (
                      <ChevronDown
                        size={22}
                      />
                    )}
                  </button>

                  {/* CONTENT */}

                  <div
                    className={`terms-content ${
                      activeIndex ===
                      index
                        ? "terms-content--open"
                        : ""
                    }`}
                  >
                    <div className="terms-content__inner">
                      <p>
                        {
                          term.content
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </section>

          {/* =========================================
              CONTACT
          ========================================= */}

          <section className="terms-contact">

            <div>
              <h3>
                Need Legal Assistance?
              </h3>

              <p>
                Contact our compliance and
                operations division for
                additional information
                regarding Sentinel AI legal
                policies.
              </p>
            </div>

            <button
              onClick={() =>
                (window.location.href =
                  "/marketing/contact")
              }
            >
              Contact Operations

              <ArrowUpRight
                size={18}
              />
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}