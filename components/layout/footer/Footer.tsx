"use client";

import Image from "next/image";
import Link from "next/link";

import {
  AtSign,
  Briefcase,
  Code2,
  ShieldCheck,
} from "lucide-react";

import "@/styles/layout/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="about">
      <div className="container footer__grid">
        {/* =====================================
            BRAND
        ===================================== */}

        <div className="footer__brand">
          <Link href="/" className="brand brand--footer" aria-label="Sentinel AI home">
            <Image
              src="/logo.webp"
              alt="Sentinel AI"
              width={36}
              height={36}
              priority
              className="brand__logo"
            />
            <span className="brand__text">Sentinel AI</span>
          </Link>

          <p className="footer__tagline">
            AI-Powered Intelligent Web Security Platform — continuous
            attack surface monitoring for modern teams.
          </p>

          <div className="footer__socials">
            <a href="#" aria-label="Code repository">
              <Code2 size={17} />
            </a>

            <a href="/marketing/contact" aria-label="Email us">
              <AtSign size={17} />
            </a>

            <a href="/marketing/careers" aria-label="Careers">
              <Briefcase size={17} />
            </a>
          </div>
        </div>

        {/* =====================================
            PRODUCT
        ===================================== */}

        <nav className="footer__column" aria-label="Product">
          <h4>Product</h4>
          <Link href="/">Home</Link>
          <Link href="/marketing/features">Features</Link>
          <Link href="/marketing/pricing">Pricing</Link>
          <Link href="/marketing/security">Security</Link>
        </nav>

        {/* =====================================
            COMPANY
        ===================================== */}

        <nav className="footer__column" aria-label="Company">
          <h4>Company</h4>
          <Link href="/marketing/about">About Us</Link>
          <Link href="/marketing/careers">Careers</Link>
          <Link href="/marketing/blog">Blog</Link>
          <Link href="/marketing/contact">Contact</Link>
        </nav>

        {/* =====================================
            LEGAL
        ===================================== */}

        <nav className="footer__column" aria-label="Legal">
          <h4>Legal</h4>
          <Link href="/marketing/privacy">Privacy Policy</Link>
          <Link href="/marketing/terms">Terms of Service</Link>
          <Link href="/marketing/security">Security Center</Link>
        </nav>
      </div>

      {/* =====================================
          BOTTOM
      ===================================== */}

      <div className="container footer__bottom">
        <span className="footer__copy">
          © {year} Sentinel AI. All rights reserved.
        </span>

        <span className="system-status">
          <ShieldCheck size={14} className="system-status__icon" />
          <span className="system-status__dot" />
          All systems operational
        </span>
      </div>
    </footer>
  );
}