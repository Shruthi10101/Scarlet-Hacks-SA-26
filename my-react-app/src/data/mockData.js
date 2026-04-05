export const subject = {
  id: "sub_001",
  name: "Milo",
  type: "dog",
  subtype: "adult_dog",
  caregiver: "Shruthi",
  ageLabel: "Adult",
  notes: "Usually active in the morning and slows down after 7 PM.",
};

export const monitoringSettings = {
  mode: "day",
  sleepWindow: {
    start: "22:00",
    end: "06:00",
  },
  feedingWindows: ["08:00", "13:00", "19:00"],
  sensitivity: "moderate",
  roomZones: {
    bedZoneEnabled: true,
    floorZoneEnabled: true,
    feedingZoneEnabled: true,
  },
};

export const liveMetrics = {
  activity: 54,
  restlessness: 28,
  appetite: 62,
  interaction: 58,
};

export const personalBaselineProfile = {
  subjectId: "sub_001",
  contexts: {
    daytimeActivity: {
      avg7: 76,
      avg30: 81,
      weighted7: 74,
    },
    nighttimeRestlessness: {
      avg7: 18,
      avg30: 16,
      weighted7: 19,
    },
    feedingEngagement: {
      avg7: 72,
      avg30: 78,
      weighted7: 70,
    },
    appetite: {
      avg7: 68,
      avg30: 74,
      weighted7: 67,
    },
    interaction: {
      avg7: 69,
      avg30: 73,
      weighted7: 67,
    },
  },
  lastUpdated: "2026-04-04",
};

export const researchReferenceProfile = {
  subjectType: "dog",
  subtype: "adult_dog",
  references: {
    daytimeActivityRange: {
      min: 60,
      max: 90,
      sourceLabel: "Research reference",
    },
    feedingEngagementRange: {
      min: 55,
      max: 85,
      sourceLabel: "Research reference",
    },
    appetiteRange: {
      min: 60,
      max: 90,
      sourceLabel: "Research reference",
    },
  },
};

export const onboardingHighlights = [
  "Tracks behavior for non-verbal subjects such as dogs, infants, and elderly individuals",
  "Combines passive monitoring with caregiver-entered signals",
  "Detects deviation from short-term and long-term personal baseline",
  "Generates urgent safety alerts and behavioral recommendations",
];

export const setupFields = {
  sleepWindow: "10:00 PM - 6:00 AM",
  sensitivity: "Moderate",
  baselineActivity: "Normal daytime movement with 2 walks",
  baselineRestlessness: "Low overnight movement",
  notes: "Milo usually slows down after 7 PM but remains responsive.",
};

export const activityTrend = [
  { label: "Mon", current: 74, avg7: 79, avg30: 81 },
  { label: "Tue", current: 72, avg7: 79, avg30: 81 },
  { label: "Wed", current: 67, avg7: 78, avg30: 80 },
  { label: "Thu", current: 64, avg7: 78, avg30: 80 },
  { label: "Fri", current: 61, avg7: 77, avg30: 79 },
  { label: "Sat", current: 57, avg7: 77, avg30: 79 },
  { label: "Sun", current: 54, avg7: 76, avg30: 78 },
];

export const sleepTrend = [
  { label: "Week 1", current: 18, avg7: 16, avg30: 15 },
  { label: "Week 2", current: 21, avg7: 17, avg30: 15 },
  { label: "Week 3", current: 24, avg7: 18, avg30: 16 },
  { label: "Week 4", current: 28, avg7: 19, avg30: 16 },
];

export const caregiverLogs = [
  { day: "Mon", appetite: 82, interaction: 77 },
  { day: "Tue", appetite: 80, interaction: 75 },
  { day: "Wed", appetite: 74, interaction: 69 },
  { day: "Thu", appetite: 70, interaction: 64 },
  { day: "Fri", appetite: 68, interaction: 61 },
  { day: "Sat", appetite: 64, interaction: 59 },
  { day: "Sun", appetite: 62, interaction: 58 },
];

export const dailySummaries = [
  {
    id: "sum_2026_04_04",
    subjectId: "sub_001",
    date: "2026-04-04",
    daytimeActivityScore: 54,
    nighttimeRestlessnessScore: 28,
    feedingEngagementScore: 61,
    appetiteScore: 62,
    interactionScore: 58,
    safetyEventCounts: {
      bedExit: 1,
      floorPresence: 1,
      fallDetected: 0,
    },
    trendFlags: {
      lowActivity: true,
      highRestlessness: true,
      lowFeedingEngagement: false,
    },
  },
];

export const alerts = [
  {
    id: 1,
    level: "Moderate",
    severity: "moderate",
    title: "Activity deviation detected",
    description:
      "Current activity is 29% below the 7-day average and 31% below the monthly baseline.",
    recommendation:
      "Check for fatigue, discomfort, pain, or environmental stressors.",
  },
  {
    id: 2,
    level: "Moderate",
    severity: "moderate",
    title: "Nighttime restlessness increasing",
    description:
      "Restlessness has remained above both short-term and long-term baseline for 4 consecutive nights.",
    recommendation:
      "Review sleep environment, routine, noise, temperature, or signs of distress.",
  },
  {
    id: 3,
    level: "Low",
    severity: "low",
    title: "Caregiver log trend change",
    description:
      "Appetite and interaction scores have shown a gradual decline over the last 7 entries.",
    recommendation:
      "Continue observation and log whether reduced engagement persists across multiple days.",
  },
];