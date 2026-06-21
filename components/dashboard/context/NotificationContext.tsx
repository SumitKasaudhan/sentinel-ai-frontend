'use client';

// context/NotificationContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global notification system for Sentinel AI dashboard.
//
// Usage in any page/component:
//   const notify = useNotify();
//   notify('Scan complete', 'startup.com scan finished', 'success');
//
// This does TWO things simultaneously:
//   1. Shows a toast popup (bottom-right, auto-dismisses in 4s)
//   2. Saves notification to Supabase → appears in navbar bell
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext, useCallback, useContext,
  useEffect, useRef, useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import {
  CheckCircle2, AlertTriangle, XCircle, Info, X,
  ShieldCheck, Download, Trash2, Share2, FileText,
  Shield, Scan, Search,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotifType = 'success' | 'warning' | 'error' | 'info';

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: NotifType;
  read: boolean;
  created_at: string;
}

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: NotifType;
}

interface NotifContextValue {
  /** Fire a notification — shows toast + saves to DB */
  notify: (title: string, description?: string, type?: NotifType) => void;
  /** Real notifications from DB (used by navbar) */
  notifications: DbNotification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  /** Manually refresh from DB */
  refresh: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotifContext = createContext<NotifContextValue | null>(null);

export function useNotify() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotify must be used inside NotificationProvider');
  return ctx.notify;
}

export function useNotifications() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}

// ─── Toast icon map ───────────────────────────────────────────────────────────

function ToastIcon({ type, title }: { type: NotifType; title: string }) {
  const t = title.toLowerCase();

  // Contextual icon based on action keyword in title
  if (t.includes('scan'))     return <Search    size={15} />;
  if (t.includes('download')) return <Download  size={15} />;
  if (t.includes('delete') || t.includes('deleted')) return <Trash2 size={15} />;
  if (t.includes('share') || t.includes('copied'))   return <Share2 size={15} />;
  if (t.includes('report'))   return <FileText  size={15} />;
  if (t.includes('threat') || t.includes('block'))   return <Shield size={15} />;

  // Fallback: type-based
  if (type === 'success') return <CheckCircle2  size={15} />;
  if (type === 'warning') return <AlertTriangle size={15} />;
  if (type === 'error')   return <XCircle       size={15} />;
  return <Info size={15} />;
}

// ─── Toast Stack UI ───────────────────────────────────────────────────────────

function ToastStack({ toasts, onDismiss }: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="gn-toast-stack" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`gn-toast gn-toast--${t.type}`}
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 16,  scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            <span className="gn-toast__icon">
              <ToastIcon type={t.type} title={t.title} />
            </span>
            <div className="gn-toast__body">
              <span className="gn-toast__title">{t.title}</span>
              {t.description && (
                <span className="gn-toast__desc">{t.description}</span>
              )}
            </div>
            <button
              className="gn-toast__close"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // already has /api suffix

  const [toasts,        setToasts]        = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ── Fetch from DB ───────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // silently fail — notifications are non-critical
    }
  }, [getToken]);

  // Poll every 45 seconds for new notifications from other sources
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ── Dismiss toast ───────────────────────────────────────────────────────────
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timerRefs.current.get(id);
    if (timer) { clearTimeout(timer); timerRefs.current.delete(id); }
  }, []);

  // ── Main notify function ────────────────────────────────────────────────────
  const notify = useCallback((
    title: string,
    description?: string,
    type: NotifType = 'info',
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // 1. Show toast immediately
    const toast: Toast = { id, title, description, type };
    setToasts((prev) => [...prev.slice(-4), toast]); // max 5 stacked

    // Auto-dismiss after 4s
    const timer = setTimeout(() => dismissToast(id), 4000);
    timerRefs.current.set(id, timer);

    // 2. Save to DB async (fire-and-forget)
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const r = await fetch(`${API_URL}/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, type }),
        });
        if (!r.ok) return;
        const data = await r.json();
        if (data?.notification) {
          // Prepend to local list instantly (no refetch needed)
          setNotifications((prev) => [data.notification, ...prev.slice(0, 49)]);
          setUnreadCount((c) => c + 1);
        }
      } catch {
        // non-critical
      }
    })();
  }, [dismissToast, getToken]);

  // ── Mark all read ───────────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    await fetch(`${API_URL}/notifications`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [getToken]);

  // ── Clear all ───────────────────────────────────────────────────────────────
  const clearAll = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    await fetch(`${API_URL}/notifications`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications([]);
    setUnreadCount(0);
  }, [getToken]);

  // ── Delete one ──────────────────────────────────────────────────────────────
  const deleteOne = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    await fetch(`${API_URL}/notifications?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => {
      const removed = prev.find((n) => n.id === id);
      const next    = prev.filter((n) => n.id !== id);
      if (removed && !removed.read) setUnreadCount((c) => Math.max(0, c - 1));
      return next;
    });
  }, [getToken]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timerRefs.current;
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <NotifContext.Provider value={{
      notify, notifications, unreadCount,
      markAllRead, clearAll, deleteOne, refresh: fetchNotifications,
    }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </NotifContext.Provider>
  );
}