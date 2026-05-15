import {
  ValidationResult,
  PassportPhotoRequirements,
} from "../types/validation";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export function validateFaceSize(
  landmarks: FaceLandmarkerResult,
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

  // Get top of head (landmark 10) and chin (landmark 152)
  const topOfHead = faceLandmarks[10];
  const chin = faceLandmarks[152];

  const faceHeightPixels = Math.abs(chin.y - topOfHead.y) * imageHeight;
  const faceHeightPercentage = (faceHeightPixels / imageHeight) * 100;

  if (faceHeightPercentage < requirements.faceHeightMin) {
    return {
      passed: false,
      message: `Face is too small (${faceHeightPercentage.toFixed(1)}% of image). Required: ${requirements.faceHeightMin}-${requirements.faceHeightMax}%`,
      severity: "error",
    };
  }

  if (faceHeightPercentage > requirements.faceHeightMax) {
    return {
      passed: false,
      message: `Face is too large (${faceHeightPercentage.toFixed(1)}% of image). Required: ${requirements.faceHeightMin}-${requirements.faceHeightMax}%`,
      severity: "error",
    };
  }

  return {
    passed: true,
    message: `Face size is correct (${faceHeightPercentage.toFixed(1)}% of image)`,
    severity: "success",
  };
}

export function calculateFaceHeight(
  landmarks: FaceLandmarkerResult,
  imageHeight: number,
): number | null {
  if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
    return null;
  }

  const faceLandmarks = landmarks.faceLandmarks[0];
  const topOfHead = faceLandmarks[10];
  const chin = faceLandmarks[152];

  return Math.abs(chin.y - topOfHead.y) * imageHeight;
}

export function validateEyeLevel(
  landmarks: FaceLandmarkerResult,
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
  const leftEye = faceLandmarks[33];
  const rightEye = faceLandmarks[263];

  const eyeY = ((leftEye.y + rightEye.y) / 2) * imageHeight;
  const eyeLevelFromBottom = ((imageHeight - eyeY) / imageHeight) * 100;

  if (eyeLevelFromBottom < requirements.eyeLevelMin) {
    return {
      passed: false,
      message: `Eyes are too low (${eyeLevelFromBottom.toFixed(1)}% from bottom). Required: ${requirements.eyeLevelMin}-${requirements.eyeLevelMax}%`,
      severity: "error",
    };
  }

  if (eyeLevelFromBottom > requirements.eyeLevelMax) {
    return {
      passed: false,
      message: `Eyes are too high (${eyeLevelFromBottom.toFixed(1)}% from bottom). Required: ${requirements.eyeLevelMin}-${requirements.eyeLevelMax}%`,
      severity: "error",
    };
  }

  return {
    passed: true,
    message: `Eye level is correct (${eyeLevelFromBottom.toFixed(1)}% from bottom)`,
    severity: "success",
  };
}
