"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "@/styles/layout/navbar.css";

import {
  ChevronDown,
  Menu,
  X,
  User,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/marketing/features" },
  { name: "Pricing", href: "/marketing/pricing" },
  { name: "About", href: "/marketing/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [mobileProfileOpen, setMobileProfileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const navbarRef =
    useRef<HTMLDivElement>(null);

  const desktopProfileRef =
    useRef<HTMLDivElement>(null);

  const mobileProfileRef =
    useRef<HTMLDivElement>(null);

  /* =========================================
     SCROLL
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================
     LOCK BODY SCROLL WHEN MOBILE MENU OPEN
  ========================================= */

  useEffect(() => {
    document.body.style.overflow = mobileOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* =========================================
     OUTSIDE CLICK CLOSE
  ========================================= */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target = event.target as Node;

      if (
        navbarRef.current &&
        !navbarRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }

      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(
          target
        )
      ) {
        setProfileOpen(false);
      }

      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(
          target
        )
      ) {
        setMobileProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header
      ref={navbarRef}
      className={`navbar ${
        scrolled ? "navbar--scrolled" : ""
      } ${mobileOpen ? "navbar--menu-open" : ""}`}
    >
      <div className="navbar__inner">
        {/* =========================================
            BRAND
        ========================================= */}

        <Link href="/" className="brand">
          <Image
            src="/logo.webp"
            alt="Sentinel AI"
            width={38}
            height={38}
            priority
            className="brand__logo"
          />

          <span className="brand__text">
            Sentinel AI
          </span>
        </Link>

        {/* =========================================
            DESKTOP NAV
        ========================================= */}

        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-link"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* =========================================
            ACTIONS
        ========================================= */}

        <div className="navbar__actions">
          {/* DESKTOP PROFILE */}

          <div
            className="profile-dropdown desktop-profile"
            ref={desktopProfileRef}
          >
            <button
              className="avatar-button"
              onClick={() =>
                setProfileOpen(
                  (prev) => !prev
                )
              }
            >
              <User size={16} />

              <ChevronDown
                size={15}
                className={`dropdown-arrow ${
                  profileOpen
                    ? "rotate"
                    : ""
                }`}
              />
            </button>

            <div
              className={`profile-menu ${
                profileOpen
                  ? "profile-menu--open"
                  : ""
              }`}
            >
              <Link
                href="/auth/login"
                className="profile-item"
                onClick={() => {
                  setProfileOpen(false);
                  setMobileOpen(false);
                }}
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="profile-item"
                onClick={() => {
                  setProfileOpen(false);
                  setMobileOpen(false);
                }}
              >
                Signup
              </Link>
            </div>
          </div>

          {/* MOBILE PROFILE */}

          <div
            className="profile-dropdown mobile-profile-icon"
            ref={mobileProfileRef}
          >
            <button
              className="avatar-button"
              onClick={() =>
                setMobileProfileOpen(
                  (prev) => !prev
                )
              }
            >
              <User size={16} />

              <ChevronDown
                size={15}
                className={`dropdown-arrow ${
                  mobileProfileOpen
                    ? "rotate"
                    : ""
                }`}
              />
            </button>

            <div
              className={`profile-menu ${
                mobileProfileOpen
                  ? "profile-menu--open"
                  : ""
              }`}
            >
              <Link
                href="/auth/login"
                className="profile-item"
                onClick={() =>
                  setMobileProfileOpen(false)
                }
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="profile-item"
                onClick={() =>
                  setMobileProfileOpen(false)
                }
              >
                Signup
              </Link>
            </div>
          </div>

          {/* MOBILE TOGGLE */}

          <button
            className="mobile-toggle"
            onClick={() =>
              setMobileOpen(
                (prev) => !prev
              )
            }
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>
        </div>
      </div>

      {/* =========================================
          MOBILE NAV — full-screen staggered overlay
      ========================================= */}

      <div
        className={`mobile-nav ${
          mobileOpen
            ? "mobile-nav--open"
            : ""
        }`}
      >
        <div className="mobile-nav__panel">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              className="mobile-nav__link"
              style={{
                transitionDelay: mobileOpen
                  ? `${i * 60 + 80}ms`
                  : "0ms",
              }}
              onClick={() =>
                setMobileOpen(false)
              }
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}