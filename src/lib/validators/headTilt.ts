import {
  ValidationResult,
  PassportPhotoRequirements,
} from "../types/validation";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export function validateHeadTilt(
  landmarks: FaceLandmarkerResult,
  requirements: PassportPhotoRequirements,
): ValidationResult {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return {
      passed: false,
      message: "No face landmarks detected",
      severity: "error",
    };
  }

  const faceLandmarks = landmarks.faceLandmarks[0];
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];

  // Calculate angle between eyes
  const deltaY = rightEye.y - leftEye.y;
  const deltaX = rightEye.x - leftEye.x;
  const angleRadians = Math.atan2(deltaY, deltaX);
  const angleDegrees = Math.abs(angleRadians * (180 / Math.PI));

  if (angleDegrees > requirements.maxHeadTilt) {
    return {
      passed: false,
      message: `Head is tilted ${angleDegrees.toFixed(1)}°. Keep head straight (max ${requirements.maxHeadTilt}°)`,
      severity: "error",
    };
  }

  return {
    passed: true,
    message: `Head tilt is acceptable (${angleDegrees.toFixed(1)}°)`,
    severity: "success",
  };
}

export function calculateHeadTilt(
  landmarks: FaceLandmarkerResult,
): number | null {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return null;
  }

  const faceLandmarks = landmarks.faceLandmarks[0];
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];

  const deltaY = rightEye.y - leftEye.y;
  const deltaX = rightEye.x - leftEye.x;
  const angleRadians = Math.atan2(deltaY, deltaX);
  return Math.abs(angleRadians * (180 / Math.PI));
}
