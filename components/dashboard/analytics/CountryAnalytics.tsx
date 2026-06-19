"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { getCountryAnalytics } from "@/services/analytics.service";

const FLAG_MAP: Record<string, string> = {
  China:         "🇨🇳",
  Russia:        "🇷🇺",
  "North Korea": "🇰🇵",
  Iran:          "🇮🇷",
  Brazil:        "🇧🇷",
  India:         "🇮🇳",
  Vietnam:       "🇻🇳",
  USA:           "🇺🇸",
  Germany:       "🇩🇪",
  Ukraine:       "🇺🇦",
  Netherlands:   "🇳🇱",
  France:        "🇫🇷",
  Pakistan:      "🇵🇰",
  Nigeria:       "🇳🇬",
  Indonesia:     "🇮🇩",
};

function getFlag(country: string): string {
  return FLAG_MAP[country] ?? "🌐";
}

export default function CountryAnalytics() {
  const { getToken } = useAuth();

  const [data, setData] = useState<
    { country: string; count: number }[]
  >([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const token = await getToken();

        if (!token) return;

const result = await getCountryAnalytics(token);

console.log("COUNTRY RESPONSE", result);
console.log("IS ARRAY", Array.isArray(result));
console.log("DATA ARRAY", Array.isArray(result?.data));

setData(
  Array.isArray(result?.data)
    ? result.data
    : []
);
      } catch (error) {
        console.error(
          "Failed to load countries:",
          error
        );
      }
    };

    loadCountries();
  }, [getToken]);

  const maxCount = data.length ? Math.max(...data.map((d) => d.count)) : 1;

  return (
    <motion.div
      className="dv2-country-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="dv2-card-header">
        <div>
          <div className="dv2-card-title">Top Threat Source Countries</div>
          <div className="dv2-card-subtitle">By attack volume</div>
        </div>
        <Globe size={14} className="dv2-card-icon" />
      </div>

      {/* List */}
      <div className="dv2-country-list">
        {data.length === 0 && (
          <div style={{ color: "#62748E", fontSize: 12, padding: "20px 0" }}>
            Loading country data...
          </div>
        )}

        {data.map((item) => {
          const pct = (item.count / maxCount) * 100;
          return (
            <div key={item.country} className="dv2-country-row">
              <div className="dv2-country-info">
                <div className="dv2-country-name-row">
                  <span className="dv2-country-flag">{getFlag(item.country)}</span>
                  <span>{item.country}</span>
                </div>
                <span className="dv2-country-count">{item.count.toLocaleString()}</span>
              </div>
              <div className="dv2-country-bar-track">
                <motion.div
                  className="dv2-country-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}