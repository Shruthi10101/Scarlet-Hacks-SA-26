import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { getBodyOrientation, calculateMovement } from "./poseMath";

export function usePoseMonitor(videoRef, isRunning, mode = "day") {
  const poseRef = useRef(null);
  const frameRef = useRef(null);
  const prevPoseRef = useRef(null);

  const [poseState, setPoseState] = useState({
    ready: false,
    poseDetected: false,
    movementScore: 0,
    orientation: "unknown",
    fallDetected: false,
    fallConfidence: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const pose = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      if (cancelled) return;

      poseRef.current = pose;
      setPoseState((prev) => ({ ...prev, ready: true }));
    }

    init();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    function detect() {
      const video = videoRef.current;
      const pose = poseRef.current;

      if (!video || !pose || !isRunning || video.paused || video.ended) {
        frameRef.current = requestAnimationFrame(detect);
        return;
      }

      const result = pose.detectForVideo(video, performance.now());
      const landmarks = result.landmarks?.[0];

      if (!landmarks) {
        setPoseState((prev) => ({
          ...prev,
          poseDetected: false,
          movementScore: 0,
          orientation: "unknown",
          fallDetected: false,
          fallConfidence: 0,
        }));
        frameRef.current = requestAnimationFrame(detect);
        return;
      }

      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const leftKnee = landmarks[25];
      const rightKnee = landmarks[26];

      const currentPose = {
        leftShoulder,
        rightShoulder,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
      };

      const movement = calculateMovement(prevPoseRef.current, currentPose);
      const movementScore = Math.min(1, movement * 30);

      const orientation = getBodyOrientation(currentPose);

      // DEMO RULE: lying = fall
      const fallDetected = orientation === "lying";
      const fallConfidence = fallDetected ? 0.99 : 0.05;

      prevPoseRef.current = currentPose;

      setPoseState({
        ready: true,
        poseDetected: true,
        movementScore,
        orientation,
        fallDetected,
        fallConfidence,
      });

      frameRef.current = requestAnimationFrame(detect);
    }

    frameRef.current = requestAnimationFrame(detect);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [videoRef, isRunning, mode]);

  return poseState;
}