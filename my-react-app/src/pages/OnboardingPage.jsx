import React from "react";
import { Link } from "react-router-dom";
import { Activity, Brain, ShieldAlert } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="landing-hero">
        <p className="landing-eyebrow">SignalCare</p>

        <h1 className="landing-title">
          Detect behavioral change before it becomes critical.
        </h1>

        <p className="landing-subtitle">
          SignalCare analyzes real-time movement and behavioral patterns in
          non-verbal patients, compares them against personal and research
          baselines, and surfaces early signs of deterioration before they
          escalate.
        </p>

        <div className="landing-actions">
  <Link to="/setup" className="primary-btn landing-cta">
    Start Setup
  </Link>
</div>
      </section>

      {/* FEATURES */}
      <section className="landing-features">
        <div className="landing-feature-card">
          <div className="landing-icon">
            <Activity size={20} />
          </div>
          <h3>Real-time behavioral tracking</h3>
          <p>
            Continuously monitors activity, posture, restlessness, and interaction
            from live video input.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-icon">
            <Brain size={20} />
          </div>
          <h3>Baseline-driven insight</h3>
          <p>
            Compares live signals against personal history and research-backed
            expectations to detect meaningful deviation.
          </p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-icon">
            <ShieldAlert size={20} />
          </div>
          <h3>Early risk detection</h3>
          <p>
            Identifies patterns linked to deterioration and surfaces alerts for
            events like falls or abnormal behavioral shifts.
          </p>
        </div>
      </section>

      {/* VALUE STATEMENT */}
      <section className="landing-bottom">
        <p>
          Instead of reacting to visible symptoms, SignalCare helps caregivers
          act on early signals.
        </p>
      </section>
    </div>
  );
}