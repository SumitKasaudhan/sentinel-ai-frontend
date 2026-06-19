import http from 'k6/http';
import { sleep, check, group } from 'k6';

const BASE_FRONTEND = 'http://localhost:3001';
const BASE_BACKEND  = 'http://localhost:5000';

const HEADERS = { 'Content-Type': 'application/json' };

export const options = {
  stages: [
    { duration: '1m', target: 100  },
    { duration: '2m', target: 300  },
    { duration: '2m', target: 600  },
    { duration: '2m', target: 1000 },
    { duration: '3m', target: 1000 }, // sustain peak load
    { duration: '2m', target: 0    }, // graceful ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
  },
};

// 200/401/403/404 — server ne respond kiya = ok for load test
function isOk(r) {
  return r.status === 200 || r.status === 401 || r.status === 403;
}

export default function () {

  // ─── 1. HEALTH ───────────────────────────────────────────────
  group('1. Health', () => {
    check(http.get(`${BASE_BACKEND}/api/health`),
      { '✅ health': (r) => r.status === 200 });
  });

  // ─── 2. FRONTEND PAGES ───────────────────────────────────────
  group('2. Frontend Pages', () => {
    check(http.get(`${BASE_FRONTEND}/`),                     { '✅ homepage':    isOk });
    check(http.get(`${BASE_FRONTEND}/auth/login`),           { '✅ login':        isOk });
    check(http.get(`${BASE_FRONTEND}/auth/register`),        { '✅ register':     isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/about`),      { '✅ about':        isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/features`),   { '✅ features':     isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/pricing`),    { '✅ pricing':      isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/blog`),       { '✅ blog':         isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/contact`),    { '✅ contact page': isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/security`),   { '✅ security page':isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/terms`),      { '✅ terms':        isOk });
    check(http.get(`${BASE_FRONTEND}/marketing/privacy`),    { '✅ privacy':      isOk });
  });

  // ─── 3. DASHBOARD ────────────────────────────────────────────
  group('3. Dashboard', () => {
    check(http.get(`${BASE_BACKEND}/api/dashboard/stats`, { headers: HEADERS }),
      { '✅ dashboard stats': isOk });
  });

  // ─── 4. SCANNER ──────────────────────────────────────────────
  group('4. Scanner', () => {
    check(http.get(`${BASE_BACKEND}/api/scanner/test`),
      { '✅ scanner test route': (r) => r.status === 200 });

    check(http.get(`${BASE_BACKEND}/api/scanner/history`, { headers: HEADERS }),
      { '✅ scan history': isOk });

    check(http.get(`${BASE_BACKEND}/api/scanner/validate`, { headers: HEADERS }),
      { '✅ domain validate': isOk });
  });

  // ─── 5. REPORTS ──────────────────────────────────────────────
  group('5. Reports', () => {
    check(http.get(`${BASE_BACKEND}/api/reports/list`, { headers: HEADERS }),
      { '✅ reports list': isOk });

    check(http.get(`${BASE_BACKEND}/api/reports/overview`, { headers: HEADERS }),
      { '✅ reports overview': isOk });

    check(http.get(`${BASE_BACKEND}/api/reports/charts`, { headers: HEADERS }),
      { '✅ reports charts': isOk });
  });

  // ─── 6. VAULT ────────────────────────────────────────────────
  group('6. Vault', () => {
    check(http.get(`${BASE_BACKEND}/api/vault/overview`, { headers: HEADERS }),
      { '✅ vault overview': isOk });

    check(http.get(`${BASE_BACKEND}/api/vault/reports`, { headers: HEADERS }),
      { '✅ vault reports': isOk });

    check(http.get(`${BASE_BACKEND}/api/vault/scans`, { headers: HEADERS }),
      { '✅ vault scans': isOk });
  });

  // ─── 7. THREATS ──────────────────────────────────────────────
  group('7. Threats', () => {
    check(http.get(`${BASE_BACKEND}/api/threats`, { headers: HEADERS }),
      { '✅ threats': isOk });
  });

  // ─── 8. SUBSCRIPTION ─────────────────────────────────────────
  group('8. Subscription', () => {
    check(http.get(`${BASE_BACKEND}/api/subscription/status`, { headers: HEADERS }),
      { '✅ subscription status': isOk });

    check(http.get(`${BASE_BACKEND}/api/subscription/pro-feature`, { headers: HEADERS }),
      { '✅ subscription pro-feature': isOk });
  });

  // ─── 9. ANALYTICS ────────────────────────────────────────────
  group('9. Analytics', () => {
    check(http.get(`${BASE_BACKEND}/api/analytics`, { headers: HEADERS }),
      { '✅ analytics': isOk });
  });

  // ─── 10. TELEMETRY ───────────────────────────────────────────
  group('10. Telemetry', () => {
    check(http.get(`${BASE_BACKEND}/api/telemetry`, { headers: HEADERS }),
      { '✅ telemetry': isOk });
  });

  // ─── 11. NETWORK SHIELD ──────────────────────────────────────
  group('11. Network Shield', () => {
    check(http.get(`${BASE_BACKEND}/api/network-shield/overview`, { headers: HEADERS }),
      { '✅ network shield overview': isOk });
  });

  // ─── 12. NOTIFICATIONS ───────────────────────────────────────
  group('12. Notifications', () => {
    check(http.get(`${BASE_BACKEND}/api/notifications`, { headers: HEADERS }),
      { '✅ notifications': isOk });
  });

  // ─── 13. AI TERMINAL ─────────────────────────────────────────
  group('13. AI Terminal', () => {
    check(http.get(`${BASE_BACKEND}/api/ai-terminal`, { headers: HEADERS }),
      { '✅ ai terminal': isOk });
  });

  // ─── 14. DEPLOY PATCH ────────────────────────────────────────
  group('14. Deploy Patch', () => {
    check(http.get(`${BASE_BACKEND}/api/deploy-patch`, { headers: HEADERS }),
      { '✅ deploy patch': isOk });
  });

  // ─── 15. USERS ───────────────────────────────────────────────
  group('15. Users', () => {
    check(http.get(`${BASE_BACKEND}/api/users/profile`, { headers: HEADERS }),
      { '✅ users profile': isOk });
  });

  sleep(1);
}