import { ValidationResult } from "../types/validation";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

/**
 * Validates that the forehead is visible in the photo
 * Uses forehead landmarks to check visibility
 */
export function validateForeheadVisible(
  landmarks: FaceLandmarkerResult,
): ValidationResult {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return {
      passed: false,
      message: "No face landmarks detected",
      severity: "error",
    };
  }

  const faceLandmarks = landmarks.faceLandmarks[0];

  // Forehead landmarks: 10 (top of head), 107, 336 (forehead points)
  // Eyes: 33 (left eye), 263 (right eye)
  const topOfHead = faceLandmarks[10];
  const foreheadLeft = faceLandmarks[107];
  const foreheadRight = faceLandmarks[336];
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];

  // Calculate eye level
  const eyeY = (leftEye.y + rightEye.y) / 2;

  // Calculate forehead points average
  const foreheadY = (topOfHead.y + foreheadLeft.y + foreheadRight.y) / 3;

  // Forehead should be significantly above the eyes
  const foreheadToEyeDistance = eyeY - foreheadY;

  // Calculate the full face height for comparison
  const chin = faceLandmarks[152];
  const faceHeight = chin.y - topOfHead.y;

  // Forehead should occupy at least 15% of the face height
  const foreheadPercentage = (foreheadToEyeDistance / faceHeight) * 100;

  if (foreheadPercentage < 15) {
    return {
      passed: false,
      message: "Forehead is not fully visible. Please ensure your hairline is visible.",
      severity: "error",
    };
  }

  if (foreheadPercentage < 20) {
    return {
      passed: true,
      message: "Forehead is visible but close to the edge",
      severity: "warning",
    };
  }

  return {
    passed: true,
    message: "Forehead is clearly visible",
    severity: "success",
  };
}

/**
 * Validates that ears are visible in the photo
 * MediaPipe landmarks for ears: left ear (234), right ear (454)
 */
export function validateEarsVisible(
  landmarks: FaceLandmarkerResult,
): ValidationResult {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return {
      passed: false,
      message: "No face landmarks detected",
      severity: "error",
    };
  }

  const faceLandmarks = landmarks.faceLandmarks[0];

  // Ear landmarks
  const leftEar = faceLandmarks[234]; // Left ear
  const rightEar = faceLandmarks[454]; // Right ear

  // Face outer contour for reference
  const leftFaceEdge = faceLandmarks[234];
  const rightFaceEdge = faceLandmarks[454];
  const leftCheek = faceLandmarks[123];
  const rightCheek = faceLandmarks[352];

  // Calculate visibility based on z-coordinate (depth)
  // Ears should be visible (not too far back)
  const leftEarVisibility = leftEar.z !== undefined ? Math.abs(leftEar.z) : 0;
  const rightEarVisibility = rightEar.z !== undefined ? Math.abs(rightEar.z) : 0;

  // Check if ears are visible based on their position relative to face
  const leftCheekX = leftCheek.x;
  const rightCheekX = rightCheek.x;
  const leftEarX = leftEar.x;
  const rightEarX = rightEar.x;

  // Ears should be visible on the sides
  const leftEarVisible = leftEarX < leftCheekX - 0.02; // Left ear should be to the left
  const rightEarVisible = rightEarX > rightCheekX + 0.02; // Right ear should be to the right

  if (!leftEarVisible && !rightEarVisible) {
    return {
      passed: false,
      message: "Ears are not visible. Please ensure at least one ear is visible or face is positioned correctly.",
      severity: "warning",
    };
  }

  if (leftEarVisible && rightEarVisible) {
    return {
      passed: true,
      message: "Both ears are visible",
      severity: "success",
    };
  }

  return {
    passed: true,
    message: leftEarVisible ? "Left ear is visible" : "Right ear is visible",
    severity: "success",
  };
}

/**
 * Check individual ear visibility for measurements
 */
export function checkEarVisibility(
  landmarks: FaceLandmarkerResult,
): { leftEar: boolean; rightEar: boolean } {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return { leftEar: false, rightEar: false };
  }

  const faceLandmarks = landmarks.faceLandmarks[0];

  const leftEar = faceLandmarks[234];
  const rightEar = faceLandmarks[454];
  const leftCheek = faceLandmarks[123];
  const rightCheek = faceLandmarks[352];

  const leftEarVisible = leftEar.x < leftCheek.x - 0.02;
  const rightEarVisible = rightEar.x > rightCheek.x + 0.02;

  return { leftEar: leftEarVisible, rightEar: rightEarVisible };
}

/**
 * Check if forehead is visible for measurements
 */
export function checkForeheadVisibility(
  landmarks: FaceLandmarkerResult,
): boolean {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return false;
  }

  const faceLandmarks = landmarks.faceLandmarks[0];

  const topOfHead = faceLandmarks[10];
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];
  const chin = faceLandmarks[152];

  const eyeY = (leftEye.y + rightEye.y) / 2;
  const foreheadToEyeDistance = eyeY - topOfHead.y;
  const faceHeight = chin.y - topOfHead.y;
  const foreheadPercentage = (foreheadToEyeDistance / faceHeight) * 100;

  return foreheadPercentage >= 15;
}
