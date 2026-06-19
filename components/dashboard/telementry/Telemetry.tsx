"use client";

import { motion, type Variants } from "framer-motion";
import { AlertTriangle, Gauge, ScanSearch } from "lucide-react";
import "@/styles/dashboard/telemetry/telemetry.css";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Telemetry() {
  return (
    <section className="section section--compact">
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Live Telemetry</h2>
          <p>Global threat landscape analysis</p>
        </motion.div>

        <div className="telemetry-grid">
          <motion.article
            className="metric-card metric-card--large"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="metric-card__top">
              <span className="metric-label">THREATS NEUTRALIZED (24H)</span>
              <ScanSearch size={16} className="metric-icon" />
            </div>
            <div className="metric-value">2.4M</div>
            <div className="metric-subvalue">↗ +14.2% vs yesterday</div>

            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                whileInView={{ width: "78%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.article>

          <motion.article
            className="metric-card"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="metric-card__top">
              <span className="metric-label">CRITICAL ALERTS</span>
              <AlertTriangle size={16} className="metric-icon metric-icon--warn" />
            </div>
            <div className="metric-value metric-value--small">14</div>
            <div className="chip chip--warn">Requires Action</div>
          </motion.article>

          <motion.article
            className="metric-card"
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="metric-card__top">
              <span className="metric-label">NETWORK LOAD</span>
              <Gauge size={16} className="metric-icon" />
            </div>
            <div className="metric-value metric-value--small">84%</div>
            <div className="metric-note">Optimal Capacity</div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}