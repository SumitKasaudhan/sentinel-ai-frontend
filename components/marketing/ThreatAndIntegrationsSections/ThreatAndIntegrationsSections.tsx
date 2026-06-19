"use client";

import { motion, type Variants } from "framer-motion";
import styles from "@/styles/marketing/Threats/ThreatAndIntegrationsSections.module.css";

const pipeline = [
  {
    step: "01",
    title: "Global Traffic Ingestion",
    text: "Predictive threat monitoring across every request, endpoint, and telemetry stream at planetary scale.",
    icon: (
      <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20" /><path d="M2 12h20" />
        <path d="M12 2c2.8 2.7 4.4 6.2 4.4 10S14.8 19.3 12 22" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Real-Time AI Analysis",
    text: "AI continuously correlates behavioural anomalies and pattern deviations before attacks can escalate.",
    icon: (
      <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4h16v4H4z" /><path d="M4 10h10v4H4z" /><path d="M4 16h6v4H4z" />
        <circle cx="19" cy="18" r="3" /><path d="m21.5 20.5-1.5-1.5" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Instant Threat Neutralization",
    text: "Critical threats are isolated and eliminated automatically through autonomous mitigation workflows.",
    icon: (
      <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

/* Replaces the old ecosystem network diagram */
const connectFeatures = [
  {
    title: "Seamless Integrations",
    text: "Connect with your favorite tools and platforms in just a few steps.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.07 0l1.93-1.93a5 5 0 0 0-7.07-7.07L10.5 5.43" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-1.93 1.93a5 5 0 0 0 7.07 7.07L13.5 18.57" />
      </svg>
    ),
  },
  {
    title: "Automated Workflows",
    text: "Trigger and sync data across your ecosystem.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M13 2 3 14h7l-1 8 11-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Secure & Reliable",
    text: "Built with enterprise-grade security and 99.9% uptime.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const ServerSVG = () => (
  <svg className={styles.server3d} viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sTop"    x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" /></linearGradient>
      <linearGradient id="sFront"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2d42" /><stop offset="100%" stopColor="#0c1629" /></linearGradient>
      <linearGradient id="sSide"   x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0a1628" /><stop offset="100%" stopColor="#061020" /></linearGradient>
      <linearGradient id="sShield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(44,230,255,.65)" /><stop offset="100%" stopColor="rgba(44,230,255,.12)" /></linearGradient>
      <filter id="g"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    <ellipse cx="255" cy="385" rx="130" ry="20" fill="rgba(0,0,0,.35)" />
    <polygon points="140,100 140,310 195,355 195,145" fill="url(#sSide)"  stroke="rgba(44,230,255,.12)" strokeWidth="1" />
    <polygon points="140,100 370,100 370,310 140,310" fill="url(#sFront)" stroke="rgba(44,230,255,.18)" strokeWidth="1" />
    <polygon points="140,100 195,55 425,55 370,100"   fill="url(#sTop)"   stroke="rgba(44,230,255,.22)" strokeWidth="1" />
    <polygon points="370,100 425,55 425,265 370,310"  fill="url(#sSide)"  stroke="rgba(44,230,255,.1)"  strokeWidth="1" />
    <line x1="140" y1="140" x2="370" y2="140" stroke="rgba(44,230,255,.08)" strokeWidth="1" />
    <line x1="140" y1="180" x2="370" y2="180" stroke="rgba(44,230,255,.08)" strokeWidth="1" />
    <line x1="140" y1="220" x2="370" y2="220" stroke="rgba(44,230,255,.08)" strokeWidth="1" />
    <line x1="140" y1="260" x2="370" y2="260" stroke="rgba(44,230,255,.08)" strokeWidth="1" />
    <circle cx="165" cy="120" r="4.5" fill="#2ce6ff" opacity=".85" filter="url(#g)" />
    <circle cx="183" cy="120" r="4.5" fill="#4ade80" opacity=".85" filter="url(#g)" />
    <circle cx="201" cy="120" r="4.5" fill="#2ce6ff" opacity=".5" />
    <circle cx="219" cy="120" r="4.5" fill="#2ce6ff" opacity=".35" />
    <circle cx="165" cy="160" r="4.5" fill="#2ce6ff" opacity=".85" filter="url(#g)" />
    <circle cx="183" cy="160" r="4.5" fill="#2ce6ff" opacity=".45" />
    <circle cx="201" cy="160" r="4.5" fill="#ef4444" opacity=".75" filter="url(#g)" />
    <circle cx="219" cy="160" r="4.5" fill="#4ade80" opacity=".85" filter="url(#g)" />
    <rect x="270" y="108" width="80" height="20" rx="3" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
    <rect x="270" y="136" width="80" height="20" rx="3" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
    <rect x="270" y="164" width="80" height="20" rx="3" fill="rgba(44,230,255,.05)"  stroke="rgba(44,230,255,.12)"  strokeWidth="1" />
    <rect x="270" y="192" width="80" height="20" rx="3" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
    <line x1="370" y1="130" x2="436" y2="92"  stroke="rgba(44,230,255,.4)"  strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="370" y1="160" x2="444" y2="150" stroke="rgba(44,230,255,.28)" strokeWidth="1"   strokeDasharray="3 4" />
    <line x1="370" y1="198" x2="440" y2="208" stroke="rgba(44,230,255,.2)"  strokeWidth="1"   strokeDasharray="3 4" />
    <rect x="406" y="62" width="74" height="48" rx="5" fill="rgba(44,230,255,.07)" stroke="rgba(44,230,255,.22)" strokeWidth="1" />
    <line x1="416" y1="76"  x2="470" y2="76"  stroke="rgba(44,230,255,.35)" strokeWidth="1.5" />
    <line x1="416" y1="85"  x2="462" y2="85"  stroke="rgba(44,230,255,.2)"  strokeWidth="1" />
    <line x1="416" y1="94"  x2="468" y2="94"  stroke="rgba(44,230,255,.25)" strokeWidth="1" />
    <line x1="416" y1="103" x2="455" y2="103" stroke="rgba(44,230,255,.16)" strokeWidth="1" />
    <g transform="translate(152, 202) scale(0.80)">
      <ellipse cx="85" cy="90" rx="70" ry="76" fill="rgba(44,230,255,.05)" filter="url(#g)" />
      <path d="M85 8 L155 38 L155 92 Q155 148 85 172 Q15 148 15 92 L15 38 Z" fill="url(#sShield)" stroke="rgba(44,230,255,.6)" strokeWidth="2" opacity=".82" />
      <path d="M85 26 L140 50 L140 92 Q140 136 85 155 Q30 136 30 92 L30 50 Z" fill="rgba(44,230,255,.05)" stroke="rgba(44,230,255,.25)" strokeWidth="1" />
      <path d="M60 88 L78 106 L112 72" stroke="rgba(44,230,255,.9)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#g)" />
      <circle cx="85" cy="90" r="48" stroke="rgba(44,230,255,.12)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
    </g>
    <g opacity=".7">
      <polygon points="62,235 90,247 62,259 71,247" fill="#ef4444" opacity=".65" />
      <polygon points="41,210 69,222 41,234 50,222" fill="#ef4444" opacity=".45" />
      <polygon points="49,267 77,279 49,291 58,279" fill="#f97316" opacity=".55" />
    </g>
  </svg>
);

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function ThreatAndIntegrationsSections() {
  return (
    <section className={styles.section}>
      <div className={styles.bgGrid} />
      <div className={styles.blurOne} />
      <div className={styles.blurTwo} />

      <div className={styles.container}>

        {/* ══ SECTION 1 — THREAT PIPELINE ══ */}
        <div className={styles.sectionEyebrow}>
          <span className={styles.eyebrowText}>Defence Architecture</span>
        </div>

        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className={styles.miniTag}>Threat Pipeline</div>
          <h2 className={styles.heading}>
            How Sentinel AI Defends:{" "}
            <span className={styles.headingAccent}>The Threat Pipeline</span>
          </h2>
          <p className={styles.subText}>
            Every request to your infrastructure passes through hardened layers
            of autonomous AI-powered analysis before reaching your servers.
          </p>
        </motion.div>

        <div className={styles.topGrid}>
          <div className={styles.steps}>
            {pipeline.map((item, i) => (
              <motion.div
                key={i}
                className={styles.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={cardVariant}
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className={styles.stepIcon}>{item.icon}</div>
                <div className={styles.stepBody}>
                  <div className={styles.stepNumber}>Step {item.step}</div>
                  <div className={styles.stepTitle}>{item.title}</div>
                  <div className={styles.stepText}>{item.text}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, amount: 0.25 }}
            className={styles.imageWrap}
          >
            <div className={styles.imageGlow} />
            <div className={styles.serverVisual}>
              <div className={`${styles.packet} ${styles.packetBad} ${styles.p1}`}>SQL</div>
              <div className={`${styles.packet} ${styles.packetBad} ${styles.p2}`}>XSS</div>
              <div className={`${styles.packet} ${styles.packetOk}  ${styles.p3}`}>OK</div>
              <div className={`${styles.packet} ${styles.packetBad} ${styles.p4}`}>DDoS</div>
              <div className={`${styles.packet} ${styles.packetOk}  ${styles.p5}`}>OK</div>
              <div className={styles.scanWrap}><div className={styles.scanLine} /></div>
              <ServerSVG />
            </div>
          </motion.div>
        </div>

        <div className={styles.divider} />

        {/* ══ SECTION 2 — INTEGRATIONS ══ */}
        <div className={styles.sectionEyebrow}>
          <span className={styles.eyebrowText}>Platform Connectivity</span>
        </div>

        <div className={styles.bottomGrid}>

          {/* LEFT — Connect What Matters */}
          <motion.div
            className={styles.connectCol}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className={styles.connectHeading}>
              <h2 className={styles.connectTitle}>
                Connect What
                <br />
                <span className={styles.connectAccent}>Matters.</span>
              </h2>
              <p className={styles.connectSubText}>
                Seamlessly integrate AI into your existing tools and
                workflows. Simple setup. Maximum impact.
              </p>
            </div>

            <div className={styles.connectList}>
              {connectFeatures.map((item, i) => (
                <motion.div
                  key={item.title}
                  className={styles.connectRow}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariant}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className={styles.connectIconBox}>{item.icon}</div>
                  <div className={styles.connectRowBody}>
                    <div className={styles.connectRowTitle}>{item.title}</div>
                    <div className={styles.connectRowText}>{item.text}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — terminal */}
          <motion.div
            className={styles.bottomCol}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className={styles.bottomTitle}>
              Developer-Ready API &amp; CLI
            </h2>

            <div className={styles.terminal}>
              {/* ── Header: dots only + LIVE badge ── */}
              <div className={styles.termHeader}>
                <span className={`${styles.dot} ${styles.dotR}`} />
                <span className={`${styles.dot} ${styles.dotY}`} />
                <span className={`${styles.dot} ${styles.dotG}`} />
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot} />LIVE
                </div>
              </div>

              <div className={styles.termBody}>
                <div><span className={styles.tBrace}>{"{"}</span></div>
                <div className={styles.tIndent}><span className={styles.tKey}>&quot;status&quot;</span><span className={styles.tColon}>: </span><span className={styles.tCrit}>&quot;blocked&quot;</span>,</div>
                <div className={`${styles.tIndent} ${styles.tMt}`}><span className={styles.tKey}>&quot;threat&quot;</span><span className={styles.tColon}>: </span><span className={styles.tStr}>&quot;SQL injection attack&quot;</span>,</div>
                <div className={`${styles.tIndent} ${styles.tMt}`}><span className={styles.tKey}>&quot;response&quot;</span><span className={styles.tColon}>: </span><span className={styles.tStr}>&quot;Threat neutralized automatically&quot;</span>,</div>
                <div className={`${styles.tIndent} ${styles.tMt}`}><span className={styles.tKey}>&quot;severity&quot;</span><span className={styles.tColon}>: </span><span className={styles.tWarn}>&quot;critical&quot;</span>,</div>
                <div className={`${styles.tIndent} ${styles.tMt}`}><span className={styles.tKey}>&quot;metrics&quot;</span><span className={styles.tColon}>: </span><span className={styles.tBrace}>{"{"}</span></div>
                <div className={styles.tIndent2}><span className={styles.tKey}>&quot;score&quot;</span><span className={styles.tColon}>: </span><span className={styles.tNum}>&quot;9.8/10&quot;</span>,</div>
                <div className={styles.tIndent2}><span className={styles.tKey}>&quot;latency&quot;</span><span className={styles.tColon}>: </span><span className={styles.tNum}>&quot;18ms&quot;</span>,</div>
                <div className={styles.tIndent2}><span className={styles.tKey}>&quot;action&quot;</span><span className={styles.tColon}>: </span><span className={styles.tStr}>&quot;AI mitigation&quot;</span></div>
                <div className={styles.tIndent}><span className={styles.tBrace}>{"}"}</span></div>
                <div><span className={styles.tBrace}>{"}"}</span><span className={styles.termCursor} /></div>
              </div>
              <div className={styles.termGlow} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}