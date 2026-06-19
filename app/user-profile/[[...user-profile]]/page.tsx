"use client";

import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          `
          radial-gradient(
            circle at top,
            rgba(34,211,238,0.08),
            transparent 30%
          ),
          #020617
          `,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* GRID */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            `
            linear-gradient(
              rgba(255,255,255,0.03) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.03) 1px,
              transparent 1px
            )
            `,
          backgroundSize: "40px 40px",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* CONTAINER */}

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "28px",
          overflow: "hidden",

          border:
            "1px solid rgba(34,211,238,0.12)",

          background:
            "rgba(2,6,23,0.92)",

          backdropFilter: "blur(20px)",

          boxShadow:
            `
            0 0 60px rgba(34,211,238,0.08),
            inset 0 1px 0 rgba(255,255,255,0.03)
            `,
        }}
      >

        <UserProfile
          path="/user-profile"
          routing="path"

          appearance={{

            variables: {
              colorPrimary: "#22d3ee",

              colorBackground: "#020617",

              colorInputBackground:
                "rgba(15,23,42,0.9)",

              colorInputText: "#ffffff",

              colorText: "#ffffff",

              colorTextSecondary: "#94a3b8",

              borderRadius: "16px",
            },

            elements: {

              rootBox: {
                width: "100%",
              },

              card: {
                width: "100%",
                maxWidth: "100%",
                background: "transparent",
                boxShadow: "none",
                border: "none",
              },

              navbar: {
                background:
                  "rgba(15,23,42,0.55)",

                borderRight:
                  "1px solid rgba(255,255,255,0.05)",
              },

              navbarButton: {
                color: "#ffffff",
              },

              navbarButtonActive: {
                background:
                  "rgba(34,211,238,0.12)",

                color: "#22d3ee",

                border:
                  "1px solid rgba(34,211,238,0.15)",
              },

              profileSectionPrimaryButton: {
                background:
                  "linear-gradient(90deg,#22d3ee,#38bdf8)",

                color: "#02131d",

                fontWeight: 700,

                border: "none",
              },

              formButtonPrimary: {
                background:
                  "linear-gradient(90deg,#22d3ee,#38bdf8)",

                color: "#02131d",

                fontWeight: 700,
              },

              formFieldInput: {
                background:
                  "rgba(15,23,42,0.9)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",
              },

              badge: {
                background:
                  "rgba(34,211,238,0.14)",

                color: "#22d3ee",
              },

              footer: {
                display: "none",
              },
            },
          }}
        />

      </div>

    </div>
  );
}