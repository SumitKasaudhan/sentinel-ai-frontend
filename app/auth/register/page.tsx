"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff, Shield, Scan, FileText, Zap } from "lucide-react";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import "@/styles/auth/register.css";
import { validateEmail } from "@/lib/emailValidator";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP fallback — only shown if Clerk still requires email verification
  const [pendingVerification, setPendingVerification] = useState(false);
  // Email already registered in Clerk — show login prompt
  const [emailTaken, setEmailTaken] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect already-signed-in users immediately after render
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  // Password strength
  const getStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };
  const strengthLabels = ["NONE", "WEAK", "FAIR", "STRONG", "MAX"];
  const strengthColors = ["#333", "#ff4444", "#ffaa00", "#44aaff", "#4be9ff"];
  const strength = getStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const validateForm = () => {
    const errs = { fullName: "", email: "", password: "", confirmPassword: "" };
    let ok = true;
    if (!formData.fullName.trim()) { errs.fullName = "Operator designation required"; ok = false; }
    if (!formData.email.trim()) { errs.email = "Communications link required"; ok = false; }
    else {
      const emailCheck = validateEmail(formData.email);
      if (!emailCheck.valid) { errs.email = emailCheck.error; ok = false; }
    }
    if (!formData.password) { errs.password = "Access cipher required"; ok = false; }
    else if (formData.password.length < 8) { errs.password = "Minimum 8 characters required"; ok = false; }
    if (formData.password !== formData.confirmPassword) { errs.confirmPassword = "Ciphers do not match"; ok = false; }
    setErrors(errs);
    return ok;
  };

  // ── EMAIL REGISTER ────────────────────────────────────────────────────────
  // Auto-generates a username in case Clerk requires it.
  // Handles all missing_requirements states without showing confusing errors.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!validateForm()) return;
    if (!formData.agree) { setError("You must agree to the Terms & Privacy Policy."); return; }

    try {
      setLoading(true);
      setError("");
      if (isSignedIn) { router.replace("/dashboard"); return; }

      const nameParts = formData.fullName.trim().split(" ");
      // Auto-generate username — handles case where Clerk requires it
      const autoUsername =
        formData.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") +
        "_" + Math.random().toString(36).slice(2, 6);

      let result = await signUp.create({
        firstName: nameParts[0] || undefined,
        lastName: nameParts.slice(1).join(" ") || undefined,
        emailAddress: formData.email,
        password: formData.password,
        username: autoUsername,
      });

      console.log("[Register] status:", result.status, "| missing:", result.missingFields, "| unverified:", result.unverifiedFields);

      // CASE 1: All good — session is active
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        return;
      }

      // CASE 2: Something else is missing — inspect and resolve
      if (result.status === "missing_requirements") {
        const missing = result.missingFields ?? [];
        const unverified = result.unverifiedFields ?? [];

        // If username wasn't accepted upfront, update explicitly
        if (missing.includes("username")) {
          result = await signUp.update({ username: autoUsername });
          console.log("[Register] after username update:", result.status, result.missingFields);
          if (result.status === "complete") {
            await setActive({ session: result.createdSessionId });
            router.push("/dashboard");
            return;
          }
        }

        // If email verification is the remaining requirement — show OTP UI
        if (unverified.includes("email_address")) {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setPendingVerification(true);
          return;
        }

        // Anything else — show dev-readable error
        const remaining = [...new Set([...missing, ...unverified])];
        setError(
          remaining.length > 0
            ? `Setup needs: ${remaining.join(", ")}. Check your Clerk Dashboard → User & Authentication settings.`
            : "Signup incomplete. Check your Clerk Dashboard configuration."
        );
      }
    } catch (err: any) {
      console.error("[Register] ERROR:", err);
      const clerkCode = err.errors?.[0]?.code || "";
      const clerkMsg  = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "";
      // Email already registered in Clerk — show login prompt instead of raw error
      if (
        clerkCode === "form_identifier_exists" ||
        clerkMsg.toLowerCase().includes("already taken") ||
        clerkMsg.toLowerCase().includes("already exists") ||
        clerkMsg.toLowerCase().includes("email address is taken")
      ) {
        setEmailTaken(true);
        return;
      }
      setError(clerkMsg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── EMAIL VERIFICATION FALLBACK ───────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !verificationCode.trim()) { setError("Please enter the verification code."); return; }
    try {
      setLoading(true);
      setError("");
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── GOOGLE OAUTH ──────────────────────────────────────────────────────────
  const handleGoogleSignup = async () => {
    if (!isLoaded) return;
    try {
      setGoogleLoading(true);
      setError("");
      if (isSignedIn) { router.replace("/dashboard"); return; }
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Google signup failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── APPLE OAUTH ───────────────────────────────────────────────────────────
  const handleAppleSignup = async () => {
    if (!isLoaded) return;
    try {
      setAppleLoading(true);
      setError("");
      if (isSignedIn) { router.replace("/dashboard"); return; }
      await signUp.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Apple signup failed.");
    } finally {
      setAppleLoading(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="reg-page">
        <div className="reg-split-card">

          {/* LEFT PANEL */}
          <div className="reg-left">
            <div className="reg-left-inner">

              {/* ── OTP FALLBACK (only if Clerk requires email verification) ── */}
              {pendingVerification ? (
                <>
                  <div className="reg-status-badge">
                    <span className="reg-status-dot" />
                    Email Verification
                  </div>
                  <h1 className="reg-title">Check Your Email</h1>
                  <p className="reg-subtitle">
                    A code was sent to <strong>{formData.email}</strong>. Enter it below.
                  </p>
                  {error && <div className="reg-error-banner" role="alert">{error}</div>}
                  <form onSubmit={handleVerify} className="reg-form" style={{ marginTop: "1.5rem" }}>
                    <div className="reg-field">
                      <label className="reg-label">Verification Code</label>
                      <div className="reg-input-wrap">
                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => { setVerificationCode(e.target.value); if (error) setError(""); }}
                          maxLength={6}
                          autoFocus
                          autoComplete="one-time-code"
                        />
                      </div>
                    </div>
                    <button type="submit" className="reg-submit-btn" disabled={loading}>
                      {loading ? <><span className="reg-spinner" /> VERIFYING...</> : <>VERIFY & ACTIVATE <Scan size={16} /></>}
                    </button>
                  </form>
                  <p className="reg-signin-link" style={{ marginTop: "1rem" }}>
                    Didn&apos;t receive it?{" "}
                    <button
                      type="button"
                      className="reg-text-btn"
                      onClick={async () => {
                      try {
                      if (!signUp) return;   // ← add this one line
                      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                          setError("");
                        } catch {
                          setError("Failed to resend. Please wait a moment.");
                        }
                      }}
                    >
                      Resend Code
                    </button>
                  </p>
                </>
              ) : (
                <>
                  {/* ── MAIN REGISTRATION FORM ── */}
                  <div className="reg-status-badge">
                    <span className="reg-status-dot" />
                    System Status: Ready
                  </div>
                  <h1 className="reg-title">Initialize Sequence</h1>
                  <p className="reg-subtitle">
                    Create your operator profile to deploy elite security countermeasures.
                  </p>

                  {/* SOCIAL BUTTONS */}
                  <div className="reg-social-row">
                    <button
                      type="button"
                      className="reg-social-btn"
                      onClick={handleGoogleSignup}
                      disabled={googleLoading || appleLoading || loading}
                    >
                      {googleLoading ? (
                        <span className="reg-spinner" />
                      ) : (
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={18} height={18} />
                      )}
                      {googleLoading ? "Connecting..." : "Google"}
                    </button>

                    <button
                      type="button"
                      className="reg-social-btn"
                      onClick={handleAppleSignup}
                      disabled={googleLoading || appleLoading || loading}
                    >
                      {appleLoading ? (
                        <span className="reg-spinner" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
                          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.7-57.2-155.5-127.4C46.7 790.7 0 663 0 541.8c0-194.3 127.4-297.5 252.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                        </svg>
                      )}
                      {appleLoading ? "Connecting..." : "Apple"}
                    </button>
                  </div>

                  <div className="reg-divider">
                    <span />
                    <p>OR REGISTER WITH EMAIL</p>
                    <span />
                  </div>

                  {/* EMAIL ALREADY TAKEN — friendly redirect to login */}
                  {emailTaken && (
                    <div className="reg-email-taken-banner" role="alert">
                      <span>⚠</span>
                      <div>
                        <strong>An account with this email already exists.</strong>
                        <p>
                          <button type="button" className="reg-text-btn" onClick={() => { setEmailTaken(false); setFormData(prev => ({ ...prev, email: "", password: "", confirmPassword: "" })); }}>
                            Try a different email
                          </button>
                          {" or "}
                          <a href="/auth/login" className="reg-taken-login-link">Sign in instead →</a>
                        </p>
                      </div>
                    </div>
                  )}

                  {error && <div className="reg-error-banner" role="alert">{error}</div>}

                  <form onSubmit={handleSubmit} className="reg-form">
                    {/* OPERATOR DESIGNATION */}
                    <div className="reg-field">
                      <label className="reg-label"><User size={14} /> Operator Designation</label>
                      <div className={`reg-input-wrap ${errors.fullName ? "has-error" : ""}`}>
                        <input type="text" name="fullName" placeholder="Enter full name" value={formData.fullName} onChange={handleChange} autoComplete="name" />
                      </div>
                      {errors.fullName && <span className="reg-field-error">{errors.fullName}</span>}
                    </div>

                    {/* COMMUNICATIONS LINK */}
                    <div className="reg-field">
                      <label className="reg-label"><Mail size={14} /> Communications Link</label>
                      <div className={`reg-input-wrap ${errors.email ? "has-error" : ""}`}>
                        <input type="email" name="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} autoComplete="email" />
                      </div>
                      {errors.email && <span className="reg-field-error">{errors.email}</span>}
                    </div>

                    {/* ACCESS CIPHER */}
                    <div className="reg-field">
                      <label className="reg-label"><Lock size={14} /> Access Cipher</label>
                      <div className={`reg-input-wrap ${errors.password ? "has-error" : ""}`}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {/* ENCRYPTION LEVEL BAR */}
                      <div className="reg-strength-bar-wrap">
                        <div className="reg-strength-track">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="reg-strength-seg" style={{ background: strength >= i ? strengthColors[strength] : "rgba(255,255,255,0.07)" }} />
                          ))}
                        </div>
                        <span className="reg-strength-label" style={{ color: strengthColors[strength] }}>
                          ENCRYPTION LEVEL: {strengthLabels[strength]}
                        </span>
                      </div>
                      {errors.password && <span className="reg-field-error">{errors.password}</span>}
                    </div>

                    {/* VERIFY CIPHER */}
                    <div className="reg-field">
                      <label className="reg-label"><Lock size={14} /> Verify Cipher</label>
                      <div className={`reg-input-wrap ${errors.confirmPassword ? "has-error" : ""}`}>
                        <input
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        <button type="button" className="reg-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="reg-field-error">{errors.confirmPassword}</span>}
                    </div>

                    {/* TERMS */}
                    <label className="reg-checkbox-label">
                      <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} />
                      <span className="reg-checkbox-custom" />
                      <span className="reg-checkbox-text">
                        I agree to{" "}
                        <Link href="/marketing/terms" target="_blank">Terms</Link>
                        {" "}& <Link href="/marketing/privacy" target="_blank">Privacy Policy</Link>
                      </span>
                    </label>

                    <button type="submit" className="reg-submit-btn" disabled={loading || googleLoading || appleLoading}>
                      {loading ? (
                        <><span className="reg-spinner" /> INITIALIZING...</>
                      ) : (
                        <>START FREE SCAN <Scan size={16} /></>
                      )}
                    </button>
                  </form>

                  <p className="reg-signin-link">
                    Existing operative? <Link href="/auth/login">Authenticate Here</Link>
                  </p>
                </>
              )}

            </div>
          </div>

          {/* RIGHT PANEL — FEATURES */}
          <div className="reg-right">
            <div className="reg-right-overlay" />
            <div className="reg-right-content">
              <div className="reg-module-tag">MODULE: CAPABILITIES_PREVIEW</div>
              <h2 className="reg-right-headline">
                Uncompromising Defense.{" "}
                <span className="reg-right-accent">Automated Intelligence.</span>
              </h2>
              <div className="reg-features">
                <div className="reg-feature">
                  <div className="reg-feature-icon"><Shield size={18} /></div>
                  <div>
                    <h4>Advanced SQLi/XSS Detection</h4>
                    <p>Military-grade heuristic analysis to identify and neutralize deep-layer injection vectors in real-time.</p>
                  </div>
                </div>
                <div className="reg-feature">
                  <div className="reg-feature-icon"><Zap size={18} /></div>
                  <div>
                    <h4>AI Remediation Tips</h4>
                    <p>Context-aware, actionable code patches generated instantly by our proprietary security language models.</p>
                  </div>
                </div>
                <div className="reg-feature">
                  <div className="reg-feature-icon"><FileText size={18} /></div>
                  <div>
                    <h4>Professional PDF Reports</h4>
                    <p>Export boardroom-ready threat intelligence briefings detailing vulnerability severity and mitigation roadmaps.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}