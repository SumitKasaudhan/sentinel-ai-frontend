"use client";

interface Props {
  headers: any;
}

export default function ReportHeaderMatrix({
  headers,
}: Props) {
  const rows = [
    {
      name: "Content-Security-Policy",
      status: headers?.csp,
      severity: "HIGH",
    },
    {
      name: "HSTS",
      status: headers?.hsts,
      severity: "HIGH",
    },
    {
      name: "X-Frame-Options",
      status: headers?.xFrameOptions,
      severity: "MEDIUM",
    },
    {
      name: "X-Content-Type-Options",
      status: headers?.xContentTypeOptions,
      severity: "MEDIUM",
    },
  ];

  return (
    <div className="header-matrix-card">
      <h3>Security Header Matrix</h3>

      <table className="security-table">
        <thead>
          <tr>
            <th>Header</th>
            <th>Status</th>
            <th>Severity</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>

              <td>
                {row.status
                  ? "Present"
                  : "Missing"}
              </td>

              <td>{row.severity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}