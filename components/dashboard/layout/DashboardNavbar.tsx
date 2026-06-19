"use client";

import Image from "next/image";
import { useClerk, useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  Bell, Menu, Search, Settings, User, LogOut,
  CheckCircle2, AlertTriangle, XCircle, Info,
  Zap, Crown, X, Shield, Terminal, Database,
  LayoutDashboard, Network, Vault, FileText,
  ChevronRight, Loader2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "@/hooks/useSubscription";
import { useNotifications } from "@/components/dashboard/context/NotificationContext";
import type { DbNotification } from "@/components/dashboard/context/NotificationContext";

interface Props {
  setSidebarOpen: (value: boolean) => void;
}

// ── Static searchable pages ────────────────────────────────────────────────
const PAGES = [
  { label: "Dashboard",          desc: "Overview & stats",             href: "/dashboard",                    icon: "dashboard" },
  { label: "Threat Intelligence",desc: "Scan & detect threats",        href: "/dashboard/threat-intelligence", icon: "shield"    },
  { label: "Network Shield",     desc: "Network monitoring",           href: "/dashboard/network-shield",      icon: "network"   },
  { label: "Vault",              desc: "Reports & scan history",       href: "/dashboard/vault",               icon: "vault"     },
  { label: "AI Terminal",        desc: "AI-powered security assistant",href: "/dashboard/ai-terminal",         icon: "terminal"  },
  { label: "Settings",           desc: "Account & preferences",        href: "/dashboard/settings",            icon: "settings"  },
  { label: "Pricing",            desc: "Upgrade to Pro",               href: "/dashboard/pricing",             icon: "zap"       },
];

interface SearchResult {
  id: string;
  type: "page" | "threat";
  label: string;
  desc: string;
  href?: string;
  severity?: string;
  status?: string;
  icon: string;
}

// ── Notification icon ──────────────────────────────────────────────────────
function NotifIcon({ type }: { type: DbNotification["type"] }) {
  if (type === "success") return <CheckCircle2  size={15} className="notif-icon--success" />;
  if (type === "warning") return <AlertTriangle size={15} className="notif-icon--warning" />;
  if (type === "error")   return <XCircle       size={15} className="notif-icon--error"   />;
  return                         <Info          size={15} className="notif-icon--info"    />;
}

// ── Result icon ────────────────────────────────────────────────────────────
function ResultIcon({ icon, severity }: { icon: string; severity?: string }) {
  const cls = "search-result-icon";
  if (icon === "dashboard") return <LayoutDashboard size={15} className={cls} />;
  if (icon === "shield")    return <Shield          size={15} className={cls} />;
  if (icon === "network")   return <Network         size={15} className={cls} />;
  if (icon === "terminal")  return <Terminal        size={15} className={cls} />;
  if (icon === "settings")  return <Settings        size={15} className={cls} />;
  if (icon === "zap")       return <Zap             size={15} className={cls} />;
  if (icon === "threat") {
    const color = severity === "critical" ? "#ff6b7a"
                : severity === "high"     ? "#c9b3ff"
                : severity === "medium"   ? "#ffd68a"
                : "#8ceefd";
    return <AlertTriangle size={15} className={cls} style={{ color }} />;
  }
  return <FileText size={15} className={cls} />;
}

// ── Relative time ──────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function DashboardNavbar({ setSidebarOpen }: Props) {
  const router  = useRouter();
  const { getToken } = useAuth();

  const [profileOpen,      setProfileOpen]      = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Search state
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState<SearchResult[]>([]);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searching,   setSearching]   = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);

  const { signOut } = useClerk();
  const { user }    = useUser();
  const { isPro, isLoading: subLoading } = useSubscription();

  const {
    notifications, unreadCount, markAllRead, deleteOne, clearAll,
  } = useNotifications();

  const clerkAvatar = user?.imageUrl || "";
  const [avatar, setAvatar] = useState(clerkAvatar);

  const profileRef      = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef       = useRef<HTMLDivElement>(null);
  const searchInputRef  = useRef<HTMLInputElement>(null);
  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Avatar ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadAvatar = () => {
      const saved = localStorage.getItem("user-avatar");
      setAvatar(saved || clerkAvatar);
    };
    loadAvatar();
    window.addEventListener("avatar-updated", loadAvatar);
    return () => window.removeEventListener("avatar-updated", loadAvatar);
  }, [clerkAvatar]);

  // ── Outside click ────────────────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current      && !profileRef.current.contains(e.target as Node))      setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setNotificationOpen(false);
      if (searchRef.current       && !searchRef.current.contains(e.target as Node))       setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Search logic ─────────────────────────────────────────────────────────
  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim().toLowerCase();

    if (!trimmed) {
      setResults([]);
      setSearchOpen(false);
      return;
    }

    // 1. Static pages filter
    const pageResults: SearchResult[] = PAGES
      .filter((p) =>
        p.label.toLowerCase().includes(trimmed) ||
        p.desc.toLowerCase().includes(trimmed)
      )
      .map((p) => ({
        id:    `page-${p.href}`,
        type:  "page",
        label: p.label,
        desc:  p.desc,
        href:  p.href,
        icon:  p.icon,
      }));

    // 2. Live threat search from backend
    let threatResults: SearchResult[] = [];
    try {
      setSearching(true);
      const token = await getToken();
      const res   = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/threats?search=${encodeURIComponent(trimmed)}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const json = await res.json();
        const threats = json.data?.threats || json.data || [];
        threatResults = threats.slice(0, 5).map((t: any) => ({
          id:       `threat-${t.id}`,
          type:     "threat",
          label:    t.threat_type || t.title || "Unknown Threat",
          desc:     `${t.severity || "?"} severity · ${t.status || "unknown"}`,
          href:     "/dashboard/threat-intelligence",
          severity: t.severity?.toLowerCase(),
          status:   t.status,
          icon:     "threat",
        }));
      }
    } catch {
      // silent — page results still show
    } finally {
      setSearching(false);
    }

    const combined = [...pageResults, ...threatResults].slice(0, 8);
    setResults(combined);
    setSearchOpen(combined.length > 0 || trimmed.length > 0);
    setActiveIdx(-1);
  }, [getToken]);

  // ── Debounced input handler ──────────────────────────────────────────────
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 280);
  };

  // ── Keyboard navigation ──────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIdx >= 0 ? results[activeIdx] : results[0];
      if (target?.href) {
        router.push(target.href);
        clearSearch();
      }
    } else if (e.key === "Escape") {
      clearSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchOpen(false);
    setActiveIdx(-1);
    searchInputRef.current?.blur();
  };

  const handleResultClick = (href?: string) => {
    if (href) router.push(href);
    clearSearch();
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      setProfileOpen(false);
      localStorage.clear();
      sessionStorage.clear();
      await signOut({ redirectUrl: "/auth/login" });
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    }
  };

  const handleMarkAllRead = async () => { await markAllRead(); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={18} />
        </button>

        <Link href="/dashboard" className="navbar-logo">
          <Image
            src="/logo.webp"
            alt="Sentinel AI"
            width={34}
            height={34}
            priority
            className="navbar-logo-icon"
          />
          <span>Sentinel AI</span>
        </Link>

        {/* ── SEARCH ──────────────────────────────────────────────────── */}
        <div className="search-wrapper" ref={searchRef}>
          <div className={`search-box ${searchOpen ? "search-box--active" : ""}`}>
            {searching
              ? <Loader2 size={15} className="search-icon spin-icon" />
              : <Search  size={15} className="search-icon" />
            }
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search pages, threats..."
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setSearchOpen(true)}
              autoComplete="off"
            />
            {query && (
              <button className="search-clear-btn" onClick={clearSearch} tabIndex={-1}>
                <X size={13} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="search-dropdown"
              >
                {results.length === 0 ? (
                  <div className="search-empty">
                    <Search size={22} />
                    <p>No results for "<strong>{query}</strong>"</p>
                  </div>
                ) : (
                  <>
                    {/* Pages section */}
                    {results.some((r) => r.type === "page") && (
                      <div className="search-section">
                        <span className="search-section-label">Pages</span>
                        {results.filter((r) => r.type === "page").map((r, i) => (
                          <button
                            key={r.id}
                            className={`search-result-item ${activeIdx === i ? "search-result-item--active" : ""}`}
                            onClick={() => handleResultClick(r.href)}
                          >
                            <ResultIcon icon={r.icon} />
                            <div className="search-result-text">
                              <span className="search-result-label">{r.label}</span>
                              <span className="search-result-desc">{r.desc}</span>
                            </div>
                            <ChevronRight size={13} className="search-result-arrow" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Threats section */}
                    {results.some((r) => r.type === "threat") && (
                      <div className="search-section">
                        <span className="search-section-label">Threats</span>
                        {results.filter((r) => r.type === "threat").map((r, i) => {
                          const idx = results.findIndex((x) => x.id === r.id);
                          return (
                            <button
                              key={r.id}
                              className={`search-result-item ${activeIdx === idx ? "search-result-item--active" : ""}`}
                              onClick={() => handleResultClick(r.href)}
                            >
                              <ResultIcon icon="threat" severity={r.severity} />
                              <div className="search-result-text">
                                <span className="search-result-label">{r.label}</span>
                                <span className="search-result-desc">{r.desc}</span>
                              </div>
                              <ChevronRight size={13} className="search-result-arrow" />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="search-footer">
                      <span>↑↓ navigate</span>
                      <span>↵ open</span>
                      <span>Esc close</span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="navbar-right">

        {/* ── UPGRADE / PRO BADGE ─────────────────────────────────────── */}
        {!subLoading && (
          isPro ? (
            <div className="pro-badge" title="Pro Plan Active">
              <Crown size={13} className="pro-badge__icon" />
              <span className="pro-badge__label">PRO</span>
            </div>
          ) : (
            <button
              className="upgrade-btn"
              onClick={() => router.push("/dashboard/pricing")}
              title="Upgrade to Pro"
            >
              <Zap size={14} className="upgrade-btn__icon" />
              <span className="upgrade-btn__label">Upgrade</span>
            </button>
          )
        )}

        {/* ── NOTIFICATIONS ───────────────────────────────────────────── */}
        <div className="navbar-dropdown-wrapper" ref={notificationRef}>
          <button
            className="navbar-icon-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{    opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.18 }}
                className="dropdown-panel notifications-panel"
              >
                <div className="dropdown-header">
                  <h4>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="notif-count-badge">{unreadCount}</span>
                    )}
                  </h4>
                  <div className="notif-header-actions">
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} title="Mark all read">
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearAll} title="Clear all" className="notif-clear-btn">
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">
                      <Bell size={28} />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`notification-item ${!item.read ? "unread" : ""}`}
                      >
                        <div className="notification-icon">
                          <NotifIcon type={item.type} />
                        </div>
                        <div className="notification-content">
                          <h5>{item.title}</h5>
                          {item.description && <p>{item.description}</p>}
                          <span>{timeAgo(item.created_at)}</span>
                        </div>
                        <button
                          className="notif-delete-btn"
                          onClick={() => deleteOne(item.id)}
                          title="Remove"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SETTINGS ────────────────────────────────────────────────── */}
        <Link href="/dashboard/settings" className="navbar-icon-btn">
          <Settings size={17} />
        </Link>

        {/* ── PROFILE ─────────────────────────────────────────────────── */}
        <div className="navbar-dropdown-wrapper" ref={profileRef}>
          <button
            className="profile-avatar"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {avatar ? (
              <img src={avatar} alt="avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="avatar-initials">
                {user?.firstName?.[0] ?? "U"}
              </div>
            )}
            <span className="online-dot" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1,    y: 0  }}
                exit={{    opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.18 }}
                className="dropdown-panel profile-panel"
              >
                <Link href="/dashboard/settings" className="dropdown-item">
                  <User size={15} />
                  <span>Profile</span>
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}