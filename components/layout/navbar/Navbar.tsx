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
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

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
      }`}
    >
      <div className="container navbar__inner">
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
          <Link href="/" className="nav-link">
            Home
          </Link>

          <Link
            href="/marketing/features"
            className="nav-link"
          >
            Features
          </Link>

          <Link
            href="/marketing/pricing"
            className="nav-link"
          >
            Pricing
          </Link>

          <Link href="/marketing/about" className="nav-link">
            About
          </Link>
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
          MOBILE NAV
      ========================================= */}

      <div
        className={`mobile-nav ${
          mobileOpen
            ? "mobile-nav--open"
            : ""
        }`}
      >
        <div className="mobile-nav__panel">
          <Link
            href="/"
            className="mobile-nav__link"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            Home
          </Link>

          <Link
            href="/marketing/features"
            className="mobile-nav__link"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            Features
          </Link>

          <Link
            href="/marketing/pricing"
            className="mobile-nav__link"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            Pricing
          </Link>

          <Link
            href="/marketing/about"
            className="mobile-nav__link"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}