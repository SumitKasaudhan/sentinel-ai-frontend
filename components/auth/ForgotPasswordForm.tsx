"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";

export default function ForgotPasswordForm() {
  const { signIn, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const handleForgotPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setSuccess(true);

    } catch (err: any) {
      console.error(err);

      setError(
        err?.errors?.[0]?.longMessage ||
        "Recovery initialization failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-card">

      {/* TOP TECH LINE */}
      <div className="forgot-top-line" />

      {/* CORNER ACCENTS */}
      <div className="forgot-corner forgot-corner-top" />
      <div className="forgot-corner forgot-corner-bottom" />

      {/* HEADER */}
      <div className="forgot-header">

        <div className="forgot-badge">
          <span className="forgot-badge-icon">
            🛡
          </span>

          <span className="forgot-badge-text">
            SENTINEL AI
          </span>
        </div>

        <h1 className="forgot-title">
          RECOVER ACCESS
        </h1>

        <p className="forgot-subtitle">
          Initialize identity verification to reset your encryption keys
        </p>

      </div>

      {/* SUCCESS */}
      {success ? (
        <div className="forgot-success">

          <div className="forgot-success-icon">
            ✓
          </div>

          <h2 className="forgot-success-title">
            Recovery Link Sent
          </h2>

          <p className="forgot-success-text">
            Secure recovery instructions have been transmitted to:
          </p>

          <p className="forgot-success-email">
            {email}
          </p>

          <Link
            href="/auth/login"
            className="forgot-back-link"
          >
            ← Return to Login
          </Link>

        </div>
      ) : (
        <>
          {/* FORM */}
          <form
            className="forgot-form"
            onSubmit={handleForgotPassword}
          >

            <div className="forgot-field">

              <label className="forgot-label">
                Operative ID (Email)
              </label>

              <div className="forgot-input-wrapper">

                <span className="forgot-input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  required
                  placeholder="Enter identification string..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="forgot-input"
                />

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="forgot-error">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="forgot-button"
            >
              {loading
                ? "INITIALIZING..."
                : "SEND RECOVERY LINK"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="forgot-divider">
            <div className="forgot-divider-line" />

            <span className="forgot-divider-text">
              SYSTEM MSG
            </span>

            <div className="forgot-divider-line" />
          </div>

          {/* FOOTER */}
          <div className="forgot-footer">
            <Link
              href="/auth/login"
              className="forgot-back-link"
            >
              ← Return to Login
            </Link>
          </div>
        </>
      )}

    </div>
  );
}