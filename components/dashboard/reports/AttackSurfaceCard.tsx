"use client";

import {
  Shield,
  Network,
  Globe,
  AlertTriangle,
  Server,
  Activity,
} from "lucide-react";

interface Props {
  data: {
    attackSurfaceScore: number;
    internetExposure: string;
    openServices: number;
    exposedServices: string[];
    externalFacingAssets: number;
    riskLevel: string;
  };
}

export default function AttackSurfaceCard({
  data,
}: Props) {
  return (
    <section className="report-card attack-surface-card">

      {/* HEADER */}

      <div className="attack-surface-header">
        <div className="attack-surface-title">
          <Shield size={22} />
          <span>Attack Surface Intelligence</span>
        </div>
      </div>

      {/* METRICS */}

      <div className="attack-grid">

        {/* HERO SCORE */}

        <div className="attack-score-card">
          <div className="attack-score-label">
            Attack Surface Score
          </div>

          <div className="attack-score-value">
            {data.attackSurfaceScore}
          </div>

          <div className="attack-score-risk">
            {data.riskLevel}
          </div>
        </div>

        {/* EXPOSURE */}

        <div className="attack-metric">
          <div className="attack-metric-label">
            Exposure Level
          </div>

          <div
            className={`attack-metric-value exposure-${data.internetExposure.toLowerCase()}`}
          >
            {data.internetExposure}
          </div>
        </div>

        {/* OPEN SERVICES */}

        <div className="attack-metric">
          <div className="attack-metric-label">
            Open Services
          </div>

          <div className="attack-metric-value">
            {data.openServices}
          </div>
        </div>

        {/* EXTERNAL ASSETS */}

        <div className="attack-metric">
          <div className="attack-metric-label">
            External Assets
          </div>

          <div className="attack-metric-value">
            {data.externalFacingAssets}
          </div>
        </div>

      </div>

      {/* SERVICES */}

      <div className="attack-services">

        <h4>
          <Network size={16} />
          Exposed Services
        </h4>

        <div className="service-tags">

          {data.exposedServices.length > 0 ? (
            data.exposedServices.map((service) => (
              <span
                key={service}
                className="service-tag"
              >
                <Server size={12} />
                {service}
              </span>
            ))
          ) : (
            <span className="service-tag safe">
              No Exposed Services
            </span>
          )}

        </div>

      </div>

      {/* SCORE BAR */}

      <div className="attack-score-bar">

        <div className="attack-score-top">
          <span>
            Surface Exposure
          </span>

          <span>
            {data.attackSurfaceScore}/100
          </span>
        </div>

        <div className="attack-progress">
          <div
            className="attack-progress-fill"
            style={{
              width: `${data.attackSurfaceScore}%`,
            }}
          />
        </div>

      </div>

      {/* FOOTER */}

      <div className="attack-footer">

        <div className="footer-item">
          <Globe size={14} />
          Internet Exposure:
          <strong>
            {data.internetExposure}
          </strong>
        </div>

        <div className="footer-item">
          <AlertTriangle size={14} />
          Risk Level:
          <strong>
            {data.riskLevel}
          </strong>
        </div>

        <div className="footer-item">
          <Activity size={14} />
          Services:
          <strong>
            {data.openServices}
          </strong>
        </div>

      </div>

    </section>
  );
}