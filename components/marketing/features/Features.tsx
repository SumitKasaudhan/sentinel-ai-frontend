"use client";

import { motion } from "framer-motion";
import { Code2, ScanSearch, Shield } from "lucide-react";
import "@/styles/marketing/features/features.css";

const features = [
  {
    icon: Shield,
    title: "AI Analysis Engine",
    description:
      "Predictive behavioral models identify anomalous traffic patterns before signatures are even established.",
  },
  {
    icon: ScanSearch,
    title: "SQLi Protection",
    description:
      "Deep packet inspection blocks malicious payload injection attempts against your database infrastructure.",
  },
  {
    icon: Code2,
    title: "XSS Mitigation",
    description:
      "Real-time sanitization of input vectors prevents cross-site scripting vulnerabilities from executing on client browsers.",
  },
];

const wrap = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={wrap}
        >
          <h2>Core Capabilities</h2>
          <p>Advanced algorithms designed to protect high-stakes infrastructure.</p>
        </motion.div>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="feature-icon">
                  <Icon size={19} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}