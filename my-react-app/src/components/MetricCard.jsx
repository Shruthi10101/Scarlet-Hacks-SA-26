import React from "react";

export default function MetricCard({ title, value, subtitle, icon, tone = "blue" }) {
  return (
    <div className={`metric-card tone-${tone}`}>
      <div className="metric-top">
        <div>
          <p className="metric-title">{title}</p>
          <h3 className="metric-value">{value}</h3>
          {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        </div>
        <div className="metric-icon">{icon}</div>
      </div>
    </div>
  );
}