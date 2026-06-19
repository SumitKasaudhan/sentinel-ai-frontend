"use client";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />

      <main className="forgot-page">

        {/* GRID */}
        <div className="cyber-grid" />

        {/* SCANLINES */}
        <div className="scanlines" />

        {/* ATMOSPHERIC GLOWS */}
        <div className="glow-top" />
        <div className="glow-bottom" />

        {/* CENTER CONTENT */}
        <div className="forgot-container">
          <ForgotPasswordForm />
        </div>

      </main>

      <Footer />
    </>
  );
}