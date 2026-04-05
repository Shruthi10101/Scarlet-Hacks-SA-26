import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  MoonStar,
  Users,
  Utensils,
  Siren,
} from "lucide-react";
import MetricCard from "../components/MetricCard";
import SectionCard from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { usePoseMonitor } from "../cv/types/usePoseMonitor";

function formatSeconds(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function MonitoringPage() {
  const videoRef = useRef(null);
  const lastFallAlertRef = useRef(0);
  const activityHistoryRef = useRef([]);
  const [liveFallBanner, setLiveFallBanner] = useState(false);

  const {
    subject,
    sessionRunning,
    sessionSeconds,
    incrementSessionTime,
    startSession,
    stopSession,
    resetSession,
    liveMetrics,
    setLiveMetrics,
    activeUrgentAlert,
    simulateFall,
  } = useAppContext();

  const poseState = usePoseMonitor(videoRef, sessionRunning);

  useEffect(() => {
    if (!sessionRunning) return;
    const timer = setInterval(() => {
      incrementSessionTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionRunning]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    sessionRunning ? video.play().catch(() => {}) : video.pause();
  }, [sessionRunning]);

  // 🔥 ACTIVITY LOGIC
  useEffect(() => {
    if (!poseState.poseDetected) return;

    const video = videoRef.current;

    let timeFactor = 0;
    if (video && video.duration) {
      timeFactor = video.currentTime / video.duration;
    }

    const rawMovement = poseState.movementScore;

    let simulatedBaseline;

    if (timeFactor < 0.33) {
      simulatedBaseline = 40 + timeFactor * 60;
    } else if (timeFactor < 0.66) {
      simulatedBaseline = 80 - (timeFactor - 0.33) * 60;
    } else {
      simulatedBaseline = 30 - (timeFactor - 0.66) * 30;
    }

    const rawActivity = Math.round(
      simulatedBaseline * 0.7 + rawMovement * 100 * 0.3
    );

    activityHistoryRef.current.push(rawActivity);
    if (activityHistoryRef.current.length > 10) {
      activityHistoryRef.current.shift();
    }

    const avg =
      activityHistoryRef.current.reduce((a, b) => a + b, 0) /
      activityHistoryRef.current.length;

    const prev = liveMetrics.activity || 0;

    const activity = Math.max(
      10,
      Math.round(prev * 0.6 + avg * 0.4)
    );

    setLiveMetrics((p) => ({
      ...p,
      activity,
    }));

    // 🔴 FALL DETECTION
    if (poseState.fallDetected && lastFallAlertRef.current === 0) {
      lastFallAlertRef.current = 1;
      setLiveFallBanner(true);
      simulateFall();
    }

    if (!poseState.fallDetected) {
      lastFallAlertRef.current = 0;
    }
  }, [poseState]);

  function onReset() {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    resetSession();
    lastFallAlertRef.current = 0;
    setLiveFallBanner(false);
    activityHistoryRef.current = [];
  }

  const activityLevel =
    liveMetrics.activity > 70
      ? "High"
      : liveMetrics.activity > 40
      ? "Moderate"
      : "Low";

  return (
    <div className="page">
      {(liveFallBanner || activeUrgentAlert) && (
        <div className="alert-banner">
          <Siren size={18} />
          <div>
            <strong>Possible fall detected</strong>
            <p>Immediate caregiver attention recommended</p>
          </div>
        </div>
      )}

      <SectionCard title="Live Monitoring">
        <div className="monitor-grid">
          {/* VIDEO */}
          <div>
            <div className="video-shell">
              <video
                ref={videoRef}
                src="/demo/day-monitoring.mp4"
                className="video"
                muted
                playsInline
                onEnded={stopSession}
              />
              <div className="video-bar">
                {sessionRunning ? "Active" : "Paused"} •{" "}
                {formatSeconds(sessionSeconds)}
              </div>
            </div>

            <div className="controls">
              <button onClick={startSession}>Start</button>
              <button onClick={stopSession}>Stop</button>
              <button onClick={onReset}>Reset</button>
            </div>
          </div>

          {/* STATUS */}
          <div className="status-card">
            <h3>Live Status</h3>

            <div className="status-row">
              <span>Posture</span>
              <strong>{poseState.orientation}</strong>
            </div>

            <div className="status-row">
              <span>Activity</span>
              <strong>{liveMetrics.activity}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${liveMetrics.activity}%` }}
              />
            </div>

            <div className="status-row">
              <span>Status</span>
              <strong className={`status-${activityLevel.toLowerCase()}`}>
                {activityLevel}
              </strong>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* METRICS (NO FEEDING ANYMORE) */}
      <div className="metrics-grid">
        <MetricCard title="Activity" value={`${liveMetrics.activity}%`} icon={<Activity />} />
        <MetricCard title="Restlessness" value={`${liveMetrics.restlessness}%`} icon={<MoonStar />} />
        <MetricCard title="Appetite" value={`${liveMetrics.appetite}%`} icon={<Utensils />} />
        <MetricCard title="Interaction" value={`${liveMetrics.interaction}%`} icon={<Users />} />
      </div>
    </div>
  );
}