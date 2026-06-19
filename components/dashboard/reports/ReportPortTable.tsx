"use client";

interface Props {
  ports: number[];
}

const PORT_MAP: Record<
  number,
  {
    service: string;
    risk: string;
  }
> = {
  21: {
    service: "FTP",
    risk: "HIGH",
  },

  22: {
    service: "SSH",
    risk: "MEDIUM",
  },

  80: {
    service: "HTTP",
    risk: "MEDIUM",
  },

  443: {
    service: "HTTPS",
    risk: "LOW",
  },

  3306: {
    service: "MySQL",
    risk: "HIGH",
  },

  5432: {
    service: "PostgreSQL",
    risk: "HIGH",
  },

  8080: {
    service: "HTTP Alt",
    risk: "MEDIUM",
  },
};

export default function ReportPortTable({
  ports,
}: Props) {
  return (
    <div className="port-table-card">
      <h3>Open Port Intelligence</h3>

      <table className="security-table">
        <thead>
          <tr>
            <th>Port</th>
            <th>Service</th>
            <th>Risk</th>
          </tr>
        </thead>

        <tbody>
          {ports?.map((port) => (
            <tr key={port}>
              <td>{port}</td>

              <td>
                {PORT_MAP[port]?.service ||
                  "Unknown"}
              </td>

              <td>
                {PORT_MAP[port]?.risk ||
                  "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}