import React, { createContext, useContext, useMemo, useState } from "react";
import {
  subject as initialSubject,
  liveMetrics as initialLiveMetrics,
  caregiverLogs as initialCaregiverLogs,
  monitoringSettings as initialMonitoringSettings,
  personalBaselineProfile,
  researchReferenceProfile,
} from "../data/mockData";

const AppContext = createContext(null);

function getTimeString() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildAlert({
  category,
  type,
  severity,
  title,
  description,
  recommendation,
  notificationSent = false,
  notificationChannel = "in-app",
}) {
  return {
    id: `${type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    category,
    type,
    severity,
    title,
    description,
    recommendation,
    createdAt: getTimeString(),
    notificationSent,
    notificationChannel,
    resolved: false,
  };
}

export function AppProvider({ children }) {
  const [subject] = useState(initialSubject);
  const [monitoringSettings, setMonitoringSettings] = useState(
    initialMonitoringSettings
  );

  const [mode, setMode] = useState("day");
  const [sessionRunning, setSessionRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const [liveMetrics, setLiveMetrics] = useState({
    activity: initialLiveMetrics.activity,
    restlessness: initialLiveMetrics.restlessness,
    appetite: initialLiveMetrics.appetite,
    interaction: initialLiveMetrics.interaction,
    feedingEngagement: 66,
  });

  const [liveSignals, setLiveSignals] = useState({
    activityScore: initialLiveMetrics.activity,
    restlessnessScore: initialLiveMetrics.restlessness,
    appetiteScore: initialLiveMetrics.appetite,
    interactionScore: initialLiveMetrics.interaction,
    feedingEngagementScore: 66,
    bodyOrientation: "unknown",
    poseDetected: false,
    fallConfidence: 0,
    floorPresenceDetected: false,
    bedExitDetected: false,
  });

  const [eventFeed, setEventFeed] = useState([
    {
      id: "evt_1",
      message: "Monitoring engine initialized.",
      time: getTimeString(),
      level: "info",
    },
  ]);

  const [alerts, setAlerts] = useState([]);

  const [caregiverLogs] = useState(initialCaregiverLogs);

  const [timelineFlags, setTimelineFlags] = useState({
    introLogged: false,
    lowActivityTriggered: false,
    floorPresenceTriggered: false,
    fallTriggered: false,
    feedingTriggered: false,
    sleepTriggered: false,
  });

  function resetTimelineFlags() {
    setTimelineFlags({
      introLogged: false,
      lowActivityTriggered: false,
      floorPresenceTriggered: false,
      fallTriggered: false,
      feedingTriggered: false,
      sleepTriggered: false,
    });
  }

  function pushEvent(message, level = "info") {
    const newEvent = {
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      message,
      time: getTimeString(),
      level,
    };

    setEventFeed((prev) => [newEvent, ...prev].slice(0, 10));
  }

  function pushAlert(alertInput) {
    const alert = buildAlert(alertInput);
    setAlerts((prev) => [alert, ...prev]);
    return alert;
  }

  function startSession() {
    setSessionRunning(true);
    pushEvent("Live session started.", "info");
  }

  function stopSession() {
    setSessionRunning(false);
    pushEvent("Live session stopped.", "info");
  }

  function resetSession() {
    setSessionRunning(false);
    setSessionSeconds(0);
    resetTimelineFlags();

    setLiveMetrics({
      activity: 54,
      restlessness: 28,
      appetite: initialLiveMetrics.appetite,
      interaction: initialLiveMetrics.interaction,
      feedingEngagement: 66,
    });

    setLiveSignals({
      activityScore: initialLiveMetrics.activity,
      restlessnessScore: initialLiveMetrics.restlessness,
      appetiteScore: initialLiveMetrics.appetite,
      interactionScore: initialLiveMetrics.interaction,
      feedingEngagementScore: 66,
      bodyOrientation: "unknown",
      poseDetected: false,
      fallConfidence: 0,
      floorPresenceDetected: false,
      bedExitDetected: false,
    });

    setAlerts([]);

    setEventFeed([
      {
        id: `evt_reset_${Date.now()}`,
        message: "Session reset. Timeline and metrics restored.",
        time: getTimeString(),
        level: "info",
      },
    ]);
  }

  function incrementSessionTime() {
    setSessionSeconds((prev) => prev + 1);
  }

  function setMonitoringMode(nextMode) {
    setMode(nextMode);
    resetTimelineFlags();
    setSessionSeconds(0);

    setLiveMetrics((prev) => ({
      ...prev,
      activity: 54,
      restlessness: 28,
      feedingEngagement: 66,
    }));

    setLiveSignals((prev) => ({
      ...prev,
      activityScore: 54,
      restlessnessScore: 28,
      feedingEngagementScore: 66,
      bodyOrientation: "unknown",
      poseDetected: false,
      fallConfidence: 0,
      floorPresenceDetected: false,
      bedExitDetected: false,
    }));

    pushEvent(`Monitoring mode changed to ${nextMode}.`, "info");
  }

  function simulateLiveTick() {
    setLiveMetrics((prev) => {
      if (mode === "day") {
        return {
          ...prev,
          activity: Math.max(20, prev.activity - Math.floor(Math.random() * 2)),
          restlessness: Math.min(
            45,
            prev.restlessness + Math.floor(Math.random() * 2)
          ),
        };
      }

      if (mode === "sleep") {
        return {
          ...prev,
          activity: Math.max(10, prev.activity - Math.floor(Math.random() * 2)),
          restlessness: Math.min(
            80,
            prev.restlessness + Math.floor(Math.random() * 3)
          ),
        };
      }

      if (mode === "feeding") {
        return {
          ...prev,
          activity: Math.max(18, prev.activity - Math.floor(Math.random() * 2)),
          feedingEngagement: Math.max(
            18,
            prev.feedingEngagement - Math.floor(Math.random() * 3)
          ),
        };
      }

      return prev;
    });

    setLiveSignals((prev) => {
      if (mode === "day") {
        return {
          ...prev,
          activityScore: Math.max(
            20,
            prev.activityScore - Math.floor(Math.random() * 2)
          ),
          restlessnessScore: Math.min(
            45,
            prev.restlessnessScore + Math.floor(Math.random() * 2)
          ),
        };
      }

      if (mode === "sleep") {
        return {
          ...prev,
          activityScore: Math.max(
            10,
            prev.activityScore - Math.floor(Math.random() * 2)
          ),
          restlessnessScore: Math.min(
            80,
            prev.restlessnessScore + Math.floor(Math.random() * 3)
          ),
        };
      }

      if (mode === "feeding") {
        return {
          ...prev,
          activityScore: Math.max(
            18,
            prev.activityScore - Math.floor(Math.random() * 2)
          ),
          feedingEngagementScore: Math.max(
            18,
            prev.feedingEngagementScore - Math.floor(Math.random() * 3)
          ),
        };
      }

      return prev;
    });
  }

  function simulateLowActivityEvent() {
    setLiveMetrics((prev) => ({
      ...prev,
      activity: Math.max(18, prev.activity - 8),
    }));

    setLiveSignals((prev) => ({
      ...prev,
      activityScore: Math.max(18, prev.activityScore - 8),
    }));

    pushEvent(
      "Daytime activity dropped below expected short-term baseline.",
      "warning"
    );
  }

  function simulateBedExit() {
    pushEvent("Possible bed exit detected during sleep window.", "warning");

    setLiveSignals((prev) => ({
      ...prev,
      bedExitDetected: true,
    }));

    pushAlert({
      category: "safety",
      type: "bed_exit",
      severity: "high",
      title: "Possible bed exit detected",
      description:
        "Subject appears to have left the bed zone during sleep monitoring.",
      recommendation:
        "Check whether the subject is safe, awake, wandering, or in need of assistance.",
      notificationSent: true,
      notificationChannel: "in-app",
    });
  }

  function simulateFloorPresence() {
    pushEvent("Unexpected floor-level posture detected.", "warning");

    setLiveSignals((prev) => ({
      ...prev,
      floorPresenceDetected: true,
      bodyOrientation: "floor-level",
    }));

    pushAlert({
      category: "safety",
      type: "floor_presence",
      severity: "high",
      title: "Floor-level posture detected",
      description:
        "Subject appears to be positioned at floor level unexpectedly.",
      recommendation:
        "Check for possible distress, repositioning need, or a fall-related event.",
      notificationSent: true,
      notificationChannel: "in-app",
    });
  }

  function simulateFall() {
    const alreadyExists = alerts.some(
      (alert) => alert.type === "fall_detected" && !alert.resolved
    );

    if (alreadyExists) return;

    pushEvent("Possible fall detected. Caregiver notification triggered.", "critical");

    setLiveMetrics((prev) => ({
      ...prev,
      activity: Math.max(10, prev.activity - 12),
      restlessness: Math.min(85, prev.restlessness + 10),
    }));

    setLiveSignals((prev) => ({
      ...prev,
      activityScore: Math.max(10, prev.activityScore - 12),
      restlessnessScore: Math.min(85, prev.restlessnessScore + 10),
      fallConfidence: 0.86,
      floorPresenceDetected: true,
      bodyOrientation: "floor-level",
      poseDetected: true,
    }));

    pushAlert({
      category: "safety",
      type: "fall_detected",
      severity: "urgent",
      title: "Possible fall detected",
      description:
        "Rapid downward movement followed by possible floor presence was detected.",
      recommendation:
        "Immediate caregiver check recommended. Assess mobility, injury risk, and responsiveness.",
      notificationSent: true,
      notificationChannel: "caregiver-ping",
    });
  }

  function simulateFeedingConcern() {
    setLiveMetrics((prev) => ({
      ...prev,
      appetite: Math.max(20, prev.appetite - 8),
    }));

    setLiveSignals((prev) => ({
      ...prev,
      appetiteScore: Math.max(20, prev.appetiteScore - 8),
    }));

    pushEvent("Feeding engagement dropped during monitored meal window.", "warning");

    pushAlert({
      category: "trend",
      type: "feeding_deviation",
      severity: "moderate",
      title: "Feeding deviation detected",
      description:
        "Observed feeding engagement is below short-term feeding baseline and appetite logs are trending lower.",
      recommendation:
        "Check feeding environment, interest in food, and whether intake should be logged manually.",
      notificationSent: false,
      notificationChannel: "in-app",
    });
  }

  const safetyAlerts = useMemo(
    () => alerts.filter((alert) => alert.category === "safety"),
    [alerts]
  );

  const trendAlerts = useMemo(
    () => alerts.filter((alert) => alert.category === "trend"),
    [alerts]
  );

  const activeUrgentAlert = useMemo(
    () => alerts.find((alert) => alert.severity === "urgent" && !alert.resolved),
    [alerts]
  );

  const derivedStatus = useMemo(() => {
    if (activeUrgentAlert) return "Alert";
    if (safetyAlerts.some((a) => a.severity === "high")) return "Alert";
    if (
      trendAlerts.length > 0 ||
      liveMetrics.activity < 50 ||
      liveMetrics.restlessness > 40
    ) {
      return "Watch";
    }
    return "Normal";
  }, [activeUrgentAlert, safetyAlerts, trendAlerts, liveMetrics]);

  const value = {
    subject,
    mode,
    setMonitoringMode,
    sessionRunning,
    sessionSeconds,
    incrementSessionTime,
    startSession,
    stopSession,
    resetSession,
    liveMetrics,
    setLiveMetrics,
    liveSignals,
    setLiveSignals,
    eventFeed,
    alerts,
    safetyAlerts,
    trendAlerts,
    caregiverLogs,
    derivedStatus,
    activeUrgentAlert,
    pushEvent,
    simulateLiveTick,
    simulateLowActivityEvent,
    simulateBedExit,
    simulateFloorPresence,
    simulateFall,
    simulateFeedingConcern,
    monitoringSettings,
    setMonitoringSettings,
    personalBaselineProfile,
    researchReferenceProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}