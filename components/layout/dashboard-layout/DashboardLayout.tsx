"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  useAuth,
  useUser,
} from "@clerk/nextjs";

import DashboardNavbar from "../../dashboard/layout/DashboardNavbar";
import DashboardSidebar from "../../dashboard/layout/DashboardSidebar";

import { syncUserToSupabase } from "@/lib/syncUser";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const router = useRouter();

  const {
    isLoaded,
    isSignedIn,
  } = useAuth();

  const { user } = useUser();

  /* ======================================
     PROTECT DASHBOARD
  ====================================== */

  useEffect(() => {
    if (!isLoaded) return;

    // User logged out
    // redirect to login

    if (!isSignedIn) {
      router.replace("/auth/login");
    }
  }, [
    isLoaded,
    isSignedIn,
    router,
  ]);

  /* ======================================
     SYNC USER TO SUPABASE
  ====================================== */

  useEffect(() => {
    if (!user?.id) return;

    syncUserToSupabase(user);
  }, [user?.id]);

  /* ======================================
     CLOSE SIDEBAR ON DESKTOP
  ====================================== */

  useEffect(() => {
    const handleResize = () => {
      if (
        window.innerWidth > 900
      ) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  /* ======================================
     WAIT FOR CLERK
  ====================================== */

  if (!isLoaded) {
    return null;
  }

  /* ======================================
     LOADING WHILE REDIRECTING
  ====================================== */

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="dashboard-shell">
      {/* SIDEBAR */}

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      {/* MAIN */}

      <div className="dashboard-main">
        {/* NAVBAR */}

        <DashboardNavbar
          setSidebarOpen={
            setSidebarOpen
          }
        />

        {/* PAGE CONTENT */}

        <main className="dashboard-content">
          <div className="dashboard-content-inner">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}
    </div>
  );
}