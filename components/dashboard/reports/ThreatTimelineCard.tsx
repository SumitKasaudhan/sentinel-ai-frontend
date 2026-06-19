"use client";

import {
  Globe,
  Lock,
  Search,
  Shield,
  Network,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from "lucide-react";

interface TimelineEvent {
  title: string;
  description: string;
  status: "success" | "warning" | "critical";
  time?: string;
}

interface Props {
  timeline?: TimelineEvent[];
}

const fallbackTimeline: TimelineEvent[] = [
  {
    title: "DNS Resolution",
    description: "Target domain resolved successfully",
    status: "success",
    time: "01s",
  },
  {
    title: "SSL Inspection",
    description: "SSL certificate analyzed",
    status: "success",
    time: "03s",
  },
  {
    title: "WHOIS Analysis",
    description: "Domain registration data collected",
    status: "success",
    time: "05s",
  },
  {
    title: "VirusTotal Scan",
    description: "Threat intelligence checked",
    status: "success",
    time: "08s",
  },
  {
    title: "Security Headers",
    description: "Missing CSP and HSTS detected",
    status: "warning",
    time: "10s",
  },
  {
    title: "Port Intelligence",
    description: "FTP service exposed on port 21",
    status: "warning",
    time: "12s",
  },
  {
    title: "Risk Assessment",
    description: "Security score calculated: 65 (Medium Risk)",
    status: "critical",
    time: "14s",
  },
  {
    title: "Executive Report",
    description: "Executive security report generated",
    status: "success",
    time: "16s",
  },
];

const getIcon = (title: string) => {
  switch (title) {
    case "DNS Resolution":
      return <Globe size={18} />;

    case "SSL Inspection":
      return <Lock size={18} />;

    case "WHOIS Analysis":
      return <Search size={18} />;

    case "VirusTotal Scan":
      return <Shield size={18} />;

    case "Security Headers":
      return <AlertTriangle size={18} />;

    case "Port Intelligence":
      return <Network size={18} />;

    case "Risk Assessment":
      return <AlertTriangle size={18} />;

    case "Executive Report":
      return <FileText size={18} />;

    default:
      return <CheckCircle2 size={18} />;
  }
};

export default function ThreatTimelineCard({
  timeline = fallbackTimeline,
}: Props) {
  return (
    <section className="threat-timeline-card">
      <div className="timeline-header">
        <div>
          <h2 className="timeline-title">
            Threat Timeline
          </h2>

          <p className="timeline-subtitle">
            Complete security assessment workflow
            and findings.
          </p>
        </div>

        <div className="timeline-counter">
          {timeline.length} Events
        </div>
      </div>

      <div className="timeline-wrapper">
        {timeline.map((event, index) => (
          <div
            key={index}
            className={`timeline-item ${event.status}`}
          >
            <div className="timeline-dot" />

            <div className="timeline-content">
              <div className="timeline-top">
                <div className="timeline-left">
                  <div className="timeline-icon">
                    {getIcon(event.title)}
                  </div>

                  <div>
                    <h4 className="timeline-event-title">
                      {event.title}
                    </h4>

                    <p className="timeline-description">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="timeline-right">
                  <span
                    className={`timeline-badge ${event.status}`}
                  >
                    {event.status.toUpperCase()}
                  </span>

                  <span className="timeline-time">
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}