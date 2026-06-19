"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import {
  Globe,
  Shield,
  Play,
} from "lucide-react";

import "@/styles/marketing/hero/hero.css";
import "@/styles/marketing/hero/globe.css";

function GlobeVisual() {
  return (
    <div className="hero__visual hero-visual-responsive">

      {/* Ambient sparks */}
      <span className="spark spark--1" />
      <span className="spark spark--2" />
      <span className="spark spark--3" />

      {/* Floating stat bubbles */}
      <div className="stat-bubble stat-bubble--a">
        <span className="stat-bubble__label">
          Threats / 24h
        </span>

        <span className="stat-bubble__val">
          2.4M
        </span>
      </div>

      <div className="stat-bubble stat-bubble--b">
        <span className="stat-bubble__label">
          Uptime
        </span>

        <span className="stat-bubble__val">
          99.98%
        </span>
      </div>

      {/* Rotating diamond frame */}
      <div className="orbital-frame">
        <div className="orbital-inner">

          <div className="globe-shell">

            <div className="globe-sphere">

              {/* Latitude */}
              <div className="globe-grid globe-grid--lat" />

              {/* Longitude */}
              <div className="globe-grid globe-grid--lon" />

              {/* Scan */}
              <div className="globe-scan" />

              {/* Halos */}
              <div className="globe-halo" />

              <div className="globe-halo globe-halo--2" />

              {/* Center icon */}
              <div className="globe-icon">
                <Globe
                  size={46}
                  strokeWidth={1.2}
                />
              </div>
            </div>

            {/* Orbit rings */}
            <div className="orbit-ring orbit-ring--1">
              <div className="orbit-dot" />
            </div>

            <div className="orbit-ring orbit-ring--2">
              <div className="orbit-dot" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > 10);

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid container hero-grid-responsive">

          {/* LEFT CONTENT */}
          <div className="hero-copy-block hero-copy-responsive">

            <div className="pill">
              <span className="pill__dot" />
              SYSTEM ONLINE
            </div>

            <h1 className="hero-title">
              AI-Powered{" "}

              <span className="gradient-text">
                Intelligent Web Security
              </span>
            </h1>

            <p className="hero-description">
              Deploy military-grade threat
              detection. Sentinel AI
              neutralizes zero-day
              vulnerabilities, SQL
              injections, and complex XSS
              attacks in real-time before
              they breach your perimeter.
            </p>

            {/* BUTTONS */}
            <div className="hero-actions">

              {/* REGISTER REDIRECT */}
              <Link
                href="/auth/register"
                className="btn btn-primary"
              >
                <Shield size={18} />
                Start Free Scan
              </Link>

              {/* FEATURES SCROLL */}
              <a
                href="#features"
                className="btn btn-secondary"
              >
                <Play size={18} />
                View Demo
              </a>
            </div>
          </div>

          {/* RIGHT GLOBE */}
          <GlobeVisual />
        </div>
      </section>
    </>
  );
}