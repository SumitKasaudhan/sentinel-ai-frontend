"use client";

import {
  Calendar,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface RoadmapItem {
  phase: string;
  priority: string;
  title: string;
  tasks: string[];
  impact: string;
}

interface Props {
  data: {
    currentScore: number;
    projectedScore: number;
    roadmap: RoadmapItem[];
  };
}

export default function RemediationRoadmapCard({
  data,
}: Props) {

  return (
    <section className="report-card roadmap-card">

      <div className="roadmap-header">

        <div className="roadmap-title">
          <Calendar size={22} />
          Remediation Roadmap
        </div>

        <div className="roadmap-score">
          <span>
            {data.currentScore}
          </span>

          <TrendingUp size={18} />

          <span>
            {data.projectedScore}
          </span>
        </div>

      </div>

      <div className="roadmap-timeline">

        {data.roadmap.map(
          (item, index) => (

            <div
              key={index}
              className="roadmap-phase"
            >

              <div className="phase-left">

                <div className="phase-marker">
                  {index + 1}
                </div>

                <div className="phase-line" />

              </div>

              <div className="phase-content">

                <div className="phase-top">

                  <span className="phase-week">
                    {item.phase}
                  </span>

                  <span
                    className={`phase-priority ${item.priority.toLowerCase()}`}
                  >
                    {item.priority}
                  </span>

                </div>

                <h4>
                  {item.title}
                </h4>

                <ul>

                  {item.tasks.map(
                    (task, i) => (

                      <li key={i}>
                        <CheckCircle2
                          size={14}
                        />
                        {task}
                      </li>

                    )
                  )}

                </ul>

                <div className="phase-impact">
                  {item.impact}
                </div>

              </div>

            </div>

          )
        )}

      </div>

    </section>
  );
}