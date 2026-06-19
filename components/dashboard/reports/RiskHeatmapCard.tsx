"use client";

import {
  Flame,
  ShieldAlert,
} from "lucide-react";

interface HeatmapItem {
  category: string;
  score: number;
  risk: string;
}

interface Props {
  data: {
    heatmap: HeatmapItem[];
  };
}

export default function RiskHeatmapCard({
  data,
}: Props) {
  return (
    <section className="report-card heatmap-card">

      <div className="heatmap-header">

        <div className="heatmap-title">
          <Flame size={22} />
          Risk Heatmap
        </div>

      </div>

      <div className="heatmap-grid">

        {data.heatmap.map(
          (item) => (

            <div
              key={item.category}
              className="heatmap-row"
            >

              <div className="heatmap-left">

                <ShieldAlert size={16} />

                <span>
                  {item.category}
                </span>

              </div>

              <div className="heatmap-center">

                <div className="heatmap-bar">

                  <div
                    className={`heatmap-fill risk-${item.risk.toLowerCase()}`}
                    style={{
                      width: `${item.score}%`,
                    }}
                  />

                </div>

              </div>

              <div
                className={`heatmap-badge risk-${item.risk.toLowerCase()}`}
              >
                {item.risk}
              </div>

            </div>

          )
        )}

      </div>

    </section>
  );
}