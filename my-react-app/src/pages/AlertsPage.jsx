import React from "react";
import SectionCard from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";

function AlertCard({ alert }) {
  const levelClass =
    alert.severity === "urgent"
      ? "alert-level urgent"
      : alert.severity === "high"
      ? "alert-level high"
      : alert.severity === "moderate"
      ? "alert-level moderate"
      : "alert-level low";

  return (
    <SectionCard
      title={alert.title}
      subtitle={`${alert.category === "safety" ? "Safety Alert" : "Trend Alert"} • ${alert.createdAt}`}
      rightContent={<span className={levelClass}>{alert.severity}</span>}
    >
      <div className="alert-body">
        <div>
          <h4>Detected Pattern</h4>
          <p>{alert.description}</p>
        </div>

        <div>
          <h4>Recommendation</h4>
          <p>{alert.recommendation}</p>
        </div>
      </div>

      <div className="alert-meta">
        <span>
          Notification:{" "}
          <strong>
            {alert.notificationSent ? `Sent via ${alert.notificationChannel}` : "In-app only"}
          </strong>
        </span>
      </div>
    </SectionCard>
  );
}

export default function AlertsPage() {
  const { safetyAlerts, trendAlerts } = useAppContext();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Alerts & Recommendations</p>
          <h1>Caregiver Action Center</h1>
          <p className="page-subtitle">
            Safety alerts are immediate. Trend alerts are generated from baseline deviation over time.
          </p>
        </div>
      </div>

      <div className="stack">
        <SectionCard
          title="Urgent Safety Alerts"
          subtitle="Immediate events such as falls, bed exits, and floor presence"
        >
          <div className="stack">
            {safetyAlerts.length === 0 ? (
              <p className="body-copy">No safety alerts currently active.</p>
            ) : (
              safetyAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Behavior Trend Alerts"
          subtitle="Slower deviations compared to personal baseline"
        >
          <div className="stack">
            {trendAlerts.length === 0 ? (
              <p className="body-copy">No trend alerts currently active.</p>
            ) : (
              trendAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}