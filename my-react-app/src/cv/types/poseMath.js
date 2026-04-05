export function averageY(...points) {
  const valid = points.filter((p) => p && typeof p.y === "number");
  if (!valid.length) return null;
  return valid.reduce((sum, p) => sum + p.y, 0) / valid.length;
}

export function averageX(...points) {
  const valid = points.filter((p) => p && typeof p.x === "number");
  if (!valid.length) return null;
  return valid.reduce((sum, p) => sum + p.x, 0) / valid.length;
}

export function getBodyOrientation({
  leftShoulder,
  rightShoulder,
  leftHip,
  rightHip,
  leftKnee,
  rightKnee,
}) {
  const shoulderY = averageY(leftShoulder, rightShoulder);
  const hipY = averageY(leftHip, rightHip);
  const kneeY = averageY(leftKnee, rightKnee);

  if (shoulderY == null || hipY == null) return "unknown";

  const torsoDiff = hipY - shoulderY;
  const legDiff = kneeY == null ? null : kneeY - hipY;

  if (torsoDiff < 0.075) return "lying";
  if (torsoDiff > 0.125) return "upright";
  if (legDiff != null && legDiff > 0.12) return "upright";

  return "sitting";
}

export function calculateMovement(prevPose, currentPose) {
  if (!prevPose || !currentPose) return 0;

  const prevHipY = averageY(prevPose.leftHip, prevPose.rightHip);
  const currentHipY = averageY(currentPose.leftHip, currentPose.rightHip);

  const prevHipX = averageX(prevPose.leftHip, prevPose.rightHip);
  const currentHipX = averageX(currentPose.leftHip, currentPose.rightHip);

  const prevShoulderY = averageY(prevPose.leftShoulder, prevPose.rightShoulder);
  const currentShoulderY = averageY(
    currentPose.leftShoulder,
    currentPose.rightShoulder
  );

  const prevShoulderX = averageX(prevPose.leftShoulder, prevPose.rightShoulder);
  const currentShoulderX = averageX(
    currentPose.leftShoulder,
    currentPose.rightShoulder
  );

  const hipVertical =
    prevHipY != null && currentHipY != null
      ? Math.abs(currentHipY - prevHipY)
      : 0;

  const hipHorizontal =
    prevHipX != null && currentHipX != null
      ? Math.abs(currentHipX - prevHipX)
      : 0;

  const shoulderVertical =
    prevShoulderY != null && currentShoulderY != null
      ? Math.abs(currentShoulderY - prevShoulderY)
      : 0;

  const shoulderHorizontal =
    prevShoulderX != null && currentShoulderX != null
      ? Math.abs(currentShoulderX - prevShoulderX)
      : 0;

  // walking should count more than quick sit/stand spikes
  return (
    hipVertical * 0.25 +
    hipHorizontal * 0.35 +
    shoulderVertical * 0.15 +
    shoulderHorizontal * 0.25
  );
}

export function detectFall({
  prevHipY,
  currentHipY,
  orientation,
  movement,
  previousOrientation = "unknown",
  mode = "day",
}) {
  if (prevHipY == null || currentHipY == null) {
    return 0.05;
  }

  const drop = currentHipY - prevHipY;
  const cameFromActivePosture =
    previousOrientation === "upright" || previousOrientation === "sitting";

  const dropThreshold = mode === "sleep" ? 0.06 : 0.03;
  const movementThreshold = mode === "sleep" ? 0.045 : 0.025;

  if (
    drop > 0.06 &&
    movement > 0.05 &&
    orientation === "lying" &&
    cameFromActivePosture
  ) {
    return 0.95;
  }

  if (
    drop > dropThreshold &&
    movement > movementThreshold &&
    orientation === "lying" &&
    cameFromActivePosture
  ) {
    return 0.85;
  }

  if (orientation === "lying" && drop > 0.02 && movement > 0.02) {
    return 0.72;
  }

  if (orientation === "sitting") {
    return 0.04;
  }

  return 0.08;
}