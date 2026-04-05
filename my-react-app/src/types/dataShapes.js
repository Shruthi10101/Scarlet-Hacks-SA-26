export const subjectProfileShape = {
  id: "sub_001",
  name: "Milo",
  subjectType: "dog",
  subtype: "adult_dog",
  caregiverName: "Shruthi",
  ageLabel: "Adult",
  notes: "",
};

export const monitoringSettingsShape = {
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

export const cvFrameOutputShape = {
  timestampMs: 0,
  poseDetected: false,
  landmarks: {},
  derived: {
    bodyOrientation: "unknown",
    movementScore: 0,
    restlessnessScore: 0,
    feedingEngagementScore: 0,
    bedExitDetected: false,
    floorPresenceDetected: false,
    fallConfidence: 0,
  },
};