"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Bot,
  LayoutDashboard,
  Shield,
  Lock,
  Network,
  X,
  FileText,
  Settings,
} from "lucide-react";

import { usePathname } from "next/navigation";

import {
  useState,
} from "react";

import DeployPatchModal from "@/components/dashboard/modal/DeployPatchModal";

interface Props {
  sidebarOpen: boolean;

  setSidebarOpen: (
    value: boolean
  ) => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Threat Intelligence",
    href: "/dashboard/threat-intelligence",
    icon: Shield,
  },
  {
    label: "Network Shield",
    href: "/dashboard/network-shield",
    icon: Network,
  },
  {
    label: "Vault",
    href: "/dashboard/vault",
    icon: Lock,
  },
  {
    label: "AI Terminal",
    href: "/dashboard/ai-terminal",
    icon: Bot,
  },
  {
    label: "Reports",
    href: "/dashboard/report",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const pathname = usePathname();

  /* MODAL STATE */

  const [
    showDeployModal,
    setShowDeployModal,
  ] = useState(false);

  /* CLOSE SIDEBAR */

  const closeSidebar = () =>
    setSidebarOpen(false);

  /* OPEN DEPLOY MODAL */

  const handleDeployOpen = () => {
    setShowDeployModal(true);
  };

  /* CLOSE DEPLOY MODAL */

  const handleDeployClose = () => {
    setShowDeployModal(false);
  };

  return (
    <>
      {/* OVERLAY */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "active" : ""
        }`}
        onClick={closeSidebar}
      />

      {/* SIDEBAR */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "active" : ""
        }`}
      >
        {/* TOP */}

        <div className="sidebar-top">
          <Link
            href="/dashboard"
            className="sidebar-brand"
            onClick={closeSidebar}
          >
            <Image
              src="/logo.webp"
              alt="Sentinel AI"
              width={34}
              height={34}
              priority
              className="brand-icon"
            />

            <span>Sentinel AI</span>
          </Link>

          <button
            className="close-sidebar-btn"
            onClick={closeSidebar}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* SYSTEM STATUS */}

{/* SYSTEM STATUS */}

<div className="system-box">
  <div className="system-left">
    <div className="system-icon-wrapper">
      <Shield
        size={18}
        className="system-icon"
      />
    </div>

    <div className="system-info">
      <h4>SENTINEL-01</h4>

      <p>
        STATUS:
        <span> SECURE</span>
      </p>
    </div>
  </div>

  <div className="status-dot" />
</div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`sidebar-link ${
                  isActive
                    ? "active"
                    : ""
                }`}
              >
                <div className="sidebar-link-left">
                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}

        <div className="sidebar-footer">
          <button
            className="deploy-btn"
            onClick={
              handleDeployOpen
            }
          >
            Deploy Patch
          </button>
        </div>
      </aside>

      {/* DEPLOY PATCH MODAL */}

      {showDeployModal && (
        <DeployPatchModal
          onClose={
            handleDeployClose
          }
        />
      )}
    </>
  );
}