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
      title: "1. Acceptance of Terms",
      content:
        "By creating an account, accessing the dashboard, or using any API, scanning, or reporting feature of Sentinel AI (\"Service\"), you agree to be bound by these Terms of Service (\"Terms\") and our Privacy Policy. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization, and \"you\" refers to that organization. If you do not agree to these Terms, you must not access or use the Service.",
    },

    {
      title: "2. Eligibility & Account Registration",
      content:
        "You must be at least 18 years old and capable of forming a binding contract to use the Service. Account credentials (including those issued through email/password, Google OAuth, or one-time-passcode login) are personal to you and must not be shared. You are responsible for all activity that occurs under your account, and must notify us immediately at security@sentinel-ai.me of any unauthorized access or suspected compromise.",
    },

    {
      title: "3. Authorized Use of Scanning Features",
      content:
        "Sentinel AI provides external attack surface management, including domain reconnaissance, port and service scanning, vulnerability assessment, and related reporting. You may only submit domains, IP addresses, or infrastructure for scanning that you own or for which you have obtained explicit written authorization to test. Submitting third-party assets without authorization is a violation of these Terms and may also violate applicable computer-misuse and cybersecurity laws. Sentinel AI reserves the right to suspend or terminate accounts found to be scanning unauthorized targets, and may report such activity to relevant authorities where required by law.",
    },

    {
      title: "4. Prohibited Conduct",
      content:
        "You agree not to: (a) reverse engineer, decompile, or attempt to extract the source code of the Service except as permitted by law; (b) use the Service to launch, facilitate, or support attacks against systems you do not own or have authorization to test; (c) circumvent or attempt to circumvent rate limits, authentication, or access controls; (d) submit malicious payloads, malware, or attempt to exploit vulnerabilities in the Service itself; (e) use automated means to scrape, copy, or republish Service data without prior written consent; or (f) resell or sublicense access to the Service without an enterprise agreement permitting such use.",
    },

    {
      title: "5. Subscription Plans, Billing & Cancellation",
      content:
        "Paid plans are billed in advance on a recurring basis (monthly or annually, as selected at checkout) through our payment processor, Dodo Payments. By subscribing, you authorize recurring charges to your selected payment method until you cancel. You may cancel at any time from the Settings page; cancellation takes effect at the end of the current billing cycle, and no partial-period refunds are provided except where required by applicable law. Failure to pay may result in suspension or downgrade of your account to the free tier. Prices and plan features are subject to change with prior notice published on our pricing page.",
    },

    {
      title: "6. Data, Privacy & Security",
      content:
        "Your use of the Service is also governed by our Privacy Policy, which describes how we collect, process, and store account information, scan results, and telemetry data. We apply industry-standard safeguards, including encryption in transit, role-based access controls, and isolated data storage per organization. We do not sell your scan data or vulnerability findings to third parties. You retain ownership of the data you submit; we process it solely to provide, secure, and improve the Service.",
    },

    {
      title: "7. Service Availability & Maintenance",
      content:
        "We aim to maintain high service availability but do not guarantee uninterrupted access. Sentinel AI may perform scheduled maintenance, emergency security patching, or infrastructure upgrades that temporarily affect availability. Where practical, we will provide advance notice of planned maintenance windows through the dashboard or status page.",
    },

    {
      title: "8. Intellectual Property",
      content:
        "The Service, including its software, design, branding, documentation, and underlying technology, is the property of Sentinel AI and its licensors and is protected by applicable intellectual property laws. These Terms grant you a limited, non-exclusive, non-transferable license to access and use the Service for your internal business purposes. No other rights are granted by implication, estoppel, or otherwise.",
    },

    {
      title: "9. Disclaimers",
      content:
        "The Service is provided \"as is\" and \"as available.\" While Sentinel AI uses commercially reasonable efforts to deliver accurate vulnerability detection and reporting, no security tool can guarantee the identification of all vulnerabilities, misconfigurations, or threats. The Service is not a substitute for comprehensive penetration testing, manual security review, or professional security advisory services. To the fullest extent permitted by law, Sentinel AI disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
    },

    {
      title: "10. Limitation of Liability",
      content:
        "To the maximum extent permitted by applicable law, Sentinel AI and its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or business opportunity, arising out of or related to your use of the Service. In all cases, Sentinel AI's aggregate liability for any claim arising from these Terms or the Service shall not exceed the amount you paid to Sentinel AI in the twelve (12) months preceding the event giving rise to the claim.",
    },

    {
      title: "11. Indemnification",
      content:
        "You agree to indemnify and hold harmless Sentinel AI and its affiliates from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from: (a) your unauthorized use of the Service to scan or test assets you do not own; (b) your violation of these Terms; or (c) your violation of any applicable law or third-party rights.",
    },

    {
      title: "12. Termination",
      content:
        "We may suspend or terminate your access to the Service, with or without notice, if we reasonably believe you have violated these Terms, engaged in unauthorized scanning, or posed a security or legal risk to Sentinel AI or third parties. You may terminate your account at any time through Settings. Upon termination, your right to access the Service ceases immediately; certain data may be retained as required by law or as described in our Privacy Policy.",
    },

    {
      title: "13. Governing Law & Dispute Resolution",
      content:
        "These Terms are governed by the laws of India, without regard to conflict-of-law principles. Any dispute arising out of or relating to these Terms or the Service shall first be addressed through good-faith negotiation between the parties. If unresolved within thirty (30) days, disputes shall be subject to the exclusive jurisdiction of the competent courts having jurisdiction over Sentinel AI's principal place of business.",
    },

    {
      title: "14. Changes to These Terms",
      content:
        "We may update these Terms from time to time to reflect changes in our practices, features, or legal requirements. Material changes will be communicated via email or an in-dashboard notice prior to taking effect. Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.",
    },

    {
      title: "15. Contact",
      content:
        "Questions about these Terms, billing, or account matters can be directed to our compliance and operations team using the contact details on our Contact page. For security vulnerability reports, please refer to our published security.txt disclosure policy.",
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
            Last Updated · June 2026
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