"use client";

import Image from "next/image";
import Link from "next/link";

import {
  AtSign,
  Briefcase,
  Code2,
} from "lucide-react";


import "@/styles/layout/footer.css";

export default function Footer() {
  return (
    <footer
      className="footer"
      id="about"
    >
      <div className="container footer__grid footer-grid-responsive">
        {/* =====================================
            BRAND
        ===================================== */}

<div className="footer__brand">
  <div className="brand brand--footer">
    <Image
      src="/logo.webp"
      alt="Sentinel AI"
      width={34}
      height={34}
      priority
      className="brand__logo"
    />

    <span className="brand__text">
      Sentinel AI
    </span>
  </div>

  <p className="footer__tagline">
    AI-Powered Intelligent Web
    Security Platform
  </p>

  <div className="footer__socials">
    <a
      href="#"
      aria-label="Code repository"
    >
      <Code2 size={16} />
    </a>

    <a
      href="/marketing/contact"
      aria-label="Email"
    >
      <AtSign size={16} />
    </a>

    <a
      href="/marketing/careers"
      aria-label="Careers"
    >
      <Briefcase size={16} />
    </a>
  </div>
</div>

        {/* =====================================
            PRODUCT
        ===================================== */}

        <div className="footer__column">
          <h4>Product</h4>

          <Link href="/">
            Home
          </Link>

          <Link href="/marketing/features">
            Features
          </Link>

          <Link href="/marketing/pricing">
            Pricing
          </Link>

          <Link href="/marketing/security">
            Security
          </Link>
        </div>

        {/* =====================================
            COMPANY
        ===================================== */}

        <div className="footer__column">
          <h4>Company</h4>

          <Link href="/marketing/about">
            About Us
          </Link>

          <Link href="/marketing/careers">
            Careers
          </Link>

          <Link href="/marketing/blog">
            Blog
          </Link>

          <Link href="/marketing/contact">
            Contact
          </Link>
        </div>

        {/* =====================================
            LEGAL
        ===================================== */}

        <div className="footer__column">
          <h4>Legal</h4>

          <Link href="/marketing/privacy">
            Privacy Policy
          </Link>

          <Link href="/marketing/terms">
            Terms of Service
          </Link>

          <Link href="/marketing/security">
            Security Center
          </Link>
        </div>
      </div>

      {/* =====================================
          BOTTOM
      ===================================== */}

      <div className="container footer__bottom">
        <span>
          © 2026 Sentinel AI. All rights
          reserved.
        </span>

        <span className="system-status">
          <span className="system-status__dot" />
          All systems operational
        </span>
      </div>
    </footer>
  );
}