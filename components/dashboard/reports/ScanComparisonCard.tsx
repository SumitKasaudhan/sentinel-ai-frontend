"use client";

interface Props {
  currentScore: number;
  previousScore: number | null;
  scoreDelta: number;
  resolvedFindings: number;
  newFindings: number;
  firstScan: boolean;
}

export default function ScanComparisonCard({
  currentScore,
  previousScore,
  scoreDelta,
  resolvedFindings,
  newFindings,
  firstScan,
}: Props) {

  if (firstScan) {
    return (
      <div className="comparison-card">

        <div className="comparison-header">

          <h2>
            Security Improvement
          </h2>

          <div className="comparison-badge">
            FIRST SCAN
          </div>

        </div>

        <div className="comparison-empty">

          <p>
            This is the first scan available
            for this target.
          </p>

          <span>
            Future scans will display
            risk improvements,
            resolved findings,
            and security posture trends.
          </span>

        </div>

      </div>
    );
  }

  const improved = scoreDelta > 0;
  const degraded = scoreDelta < 0;

  return (
    <div className="comparison-card">

      <div className="comparison-header">

        <h2>
          Security Improvement
        </h2>

        <div
          className={
            improved
              ? "comparison-badge success"
              : degraded
              ? "comparison-badge danger"
              : "comparison-badge warning"
          }
        >
          {improved
            ? "SECURITY IMPROVED"
            : degraded
            ? "RISK INCREASED"
            : "NO CHANGE"}
        </div>

      </div>

      <div className="comparison-grid">

        <div className="comparison-item">

          <span>
            Previous Score
          </span>

          <h3>
            {previousScore}
          </h3>

        </div>

        <div className="comparison-item">

          <span>
            Current Score
          </span>

          <h3>
            {currentScore}
          </h3>

        </div>

        <div className="comparison-item">

          <span>
            Score Delta
          </span>

          <h3
            className={
              improved
                ? "success-text"
                : degraded
                ? "danger-text"
                : ""
            }
          >
            {scoreDelta > 0 ? "+" : ""}
            {scoreDelta}
          </h3>

        </div>

        <div className="comparison-item">

          <span>
            Resolved Findings
          </span>

          <h3 className="success-text">
            {resolvedFindings}
          </h3>

        </div>

        <div className="comparison-item">

          <span>
            New Findings
          </span>

          <h3 className="danger-text">
            {newFindings}
          </h3>

        </div>

      </div>

      <div className="comparison-footer">

        {improved && (
          <p className="success-text">
            Security posture improved
            compared to previous scan.
          </p>
        )}

        {degraded && (
          <p className="danger-text">
            Risk increased compared
            to previous scan.
          </p>
        )}

        {!improved &&
          !degraded && (
            <p>
              No significant change
              detected between scans.
            </p>
          )}

      </div>

    </div>
  );
}