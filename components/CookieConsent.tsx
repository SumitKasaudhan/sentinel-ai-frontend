'use client'

// FILE: components/CookieConsent.tsx (new file)
// Add to your root layout: <CookieConsent /> inside <body>, after {children}

import { useState, useEffect } from 'react'

type ConsentState = { necessary: true; analytics: boolean; marketing: boolean }
const CONSENT_KEY = 'sentinel_cookie_consent'
const CONSENT_VERSION = '1'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({ necessary: true, analytics: false, marketing: false })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) { setVisible(true); return }
      const parsed = JSON.parse(stored)
      if (parsed.version !== CONSENT_VERSION) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function saveConsent(c: ConsentState) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, version: CONSENT_VERSION, timestamp: new Date().toISOString() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        width: 'min(560px, calc(100vw - 2rem))', background: '#111', border: '1px solid #333',
        borderRadius: '12px', padding: '1.25rem 1.5rem', zIndex: 9999, color: '#fff',
        fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <h2 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '0.5rem' }}>We use cookies</h2>
      <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '1rem' }}>
        We use essential cookies (Clerk session, Supabase auth) to keep the platform running.
        With your consent, we also use analytics cookies. We never sell your data.{' '}
        <a href="/marketing/privacy" style={{ color: '#60a5fa' }}>Privacy policy</a>
      </p>

      {showDetails && (
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
            <input type="checkbox" checked disabled />
            <span><strong>Necessary</strong> — Clerk/Supabase sessions, security. Always active.</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
            <input type="checkbox" checked={consent.analytics} onChange={e => setConsent(c => ({ ...c, analytics: e.target.checked }))} />
            <span><strong>Analytics</strong> — Helps us understand usage. No data sold.</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
            <input type="checkbox" checked={consent.marketing} onChange={e => setConsent(c => ({ ...c, marketing: e.target.checked }))} />
            <span><strong>Marketing</strong> — Relevant content about Sentinel AI.</span>
          </label>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}
          style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
          Accept all
        </button>
        <button onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })}
          style={{ background: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
          Reject non-essential
        </button>
        {showDetails ? (
          <button onClick={() => saveConsent(consent)}
            style={{ background: 'transparent', color: '#60a5fa', border: '1px solid #2563eb', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
            Save preferences
          </button>
        ) : (
          <button onClick={() => setShowDetails(true)}
            style={{ background: 'transparent', color: '#888', border: 'none', padding: '8px 4px', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
            Customize
          </button>
        )}
      </div>
    </div>
  )
}