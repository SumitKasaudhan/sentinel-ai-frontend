"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Check,
} from "lucide-react";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

import "@/styles/auth/login.css";
import "@/styles/auth/Authadditions.css";

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // Redirect already-authenticated users safely after render
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email required";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ── EMAIL + PASSWORD LOGIN ────────────────────────────────────────────────────
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isLoaded) return;
  if (!validateForm()) return;

  try {
    setLoading(true);
    setError("");

    if (isSignedIn) {
      router.replace("/dashboard");
      return;
    }

    const result = await signIn.create({
      identifier: formData.email,
      password: formData.password,
    });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      // FIX: window.location se hard redirect — Clerk session
      // fully set hone ka wait karta hai router.push se better
      window.location.href = "/dashboard";
    } else {
      // result.status "needs_first_factor" etc. — unexpected state
      console.log("Unexpected login status:", result.status);
      setError("Login incomplete. Please try again.");
    }
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    setError(err.errors?.[0]?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // ── GOOGLE LOGIN ──────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    if (!isLoaded) return;

    try {
      setGoogleLoading(true);
      setError("");

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("GOOGLE LOGIN ERROR:", err);
      setError(err.errors?.[0]?.message || "Google login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── APPLE LOGIN ───────────────────────────────────────────────────────────────
  const handleAppleLogin = async () => {
    if (!isLoaded) return;

    try {
      setAppleLoading(true);
      setError("");

      await signIn.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("APPLE LOGIN ERROR:", err);
      setError(err.errors?.[0]?.message || "Apple login failed. Please try again.");
    } finally {
      setAppleLoading(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <main className="login-page">
        <div className="login-overlay" />

        <div className="login-container">
          <div className="login-card">
            <span className="system-version">SYS.AUTH.v9.4</span>

            <div className="login-logo">
              <Shield size={42} />
            </div>

            <h1>Secure Telemetry Access</h1>

            <p className="subtitle">SENTINEL INTELLIGENCE SYSTEM</p>

            {error && (
              <div className="error-banner" role="alert">
                {error}
              </div>
            )}

            {/* SOCIAL BUTTONS ROW — Google + Apple side by side */}
            <div className="social-buttons-row">
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading || appleLoading}
              >
                {googleLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={18}
                    height={18}
                  />
                )}
                <span>{googleLoading ? "Connecting..." : "Google"}</span>
              </button>

              <button
                type="button"
                className="apple-btn"
                onClick={handleAppleLogin}
                disabled={loading || googleLoading || appleLoading}
              >
                {appleLoading ? (
                  <span className="btn-spinner" />
                ) : (
                  /* Apple SVG logo */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 814 1000"
                    fill="currentColor"
                  >
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.7-57.2-155.5-127.4C46.7 790.7 0 663 0 541.8c0-194.3 127.4-297.5 252.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                  </svg>
                )}
                <span>{appleLoading ? "Connecting..." : "Apple"}</span>
              </button>
            </div>

            <div className="divider">
              <span />
              <p>OR</p>
              <span />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>EMAIL •</label>

                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter email..."
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {errors.email && (
                  <p className="error-text">{errors.email}</p>
                )}
              </div>

              <div className="input-group">
                <label>PASSWORD •</label>

                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="error-text">{errors.password}</p>
                )}
              </div>

              <div className="login-options">
                <label className="remember-box">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span className="custom-checkbox">
                    {formData.remember && <Check size={12} />}
                  </span>
                  <span className="remember-text">Remember Me</span>
                </label>

                <Link href="/auth/forgot-password">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading || googleLoading || appleLoading}
              >
                {loading ? "Connecting..." : "Login"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="signup-link">
              <span>Don't have an account?</span>
              <Link href="/auth/register">Register</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}