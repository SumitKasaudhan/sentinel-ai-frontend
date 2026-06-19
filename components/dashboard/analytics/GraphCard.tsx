"use client";

const graphData = [
  40,
  60,
  35,
  80,
  55,
  90,
  70,
  50,
  95,
  65,
  85,
  45,
];

export default function GraphCard() {
  return (
    <section className="graph-card">
      <div className="graph-header">
        <h3>Vulnerability Trends (30 Days)</h3>

        <div className="graph-legends">
          <span>
            <i className="cyan" />
            Exploits
          </span>

          <span>
            <i className="gray" />
            Probes
          </span>
        </div>
      </div>

      <div className="graph-container">
        {graphData.map((item, index) => (
          <div className="graph-bar-wrap" key={index}>
            <div
              className="graph-bar"
              style={{
                height: `${item}%`,
              }}
            />

            <small>D{index + 1}</small>
          </div>
        ))}
      </div>
    </section>
  );
}