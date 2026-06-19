export const PORT_MAP = {
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