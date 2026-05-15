import {
  ValidationResult,
  PassportPhotoRequirements,
} from "../types/validation";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export function validateFacePosition(
  landmarks: FaceLandmarkerResult,
  imageWidth: number,
  imageHeight: number,
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

  // Get eye positions (landmarks 33 and 263 are left and right eyes)
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];

  // Calculate face center
  const faceCenter = {
    x: ((leftEye.x + rightEye.x) / 2) * imageWidth,
    y: ((leftEye.y + rightEye.y) / 2) * imageHeight,
  };

  const imageCenter = imageWidth / 2;
  const horizontalOffset = Math.abs(faceCenter.x - imageCenter);
  const horizontalOffsetPercentage = (horizontalOffset / imageWidth) * 100;

  if (horizontalOffsetPercentage > requirements.horizontalCenterTolerance) {
    return {
      passed: false,
      message: `Face is off-center (${horizontalOffsetPercentage.toFixed(1)}% offset). Please center your face horizontally.`,
      severity: "error",
    };
  }

  return {
    passed: true,
    message: "Face position is correct",
    severity: "success",
  };
}

export function calculateFaceCenter(
  landmarks: FaceLandmarkerResult,
  imageWidth: number,
  imageHeight: number,
): { x: number; y: number } | null {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return null;
  }

  const faceLandmarks = landmarks.faceLandmarks[0];
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];

  return {
    x: ((leftEye.x + rightEye.x) / 2) * imageWidth,
    y: ((leftEye.y + rightEye.y) / 2) * imageHeight,
  };
}
