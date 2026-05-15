"use client";

import { useState, useCallback } from "react";
import {
  PassportPhotoValidation,
  DEFAULT_REQUIREMENTS,
  ValidationResult,
} from "../lib/types/validation";
import { detectFaces } from "../lib/mediapipe/faceDetector";
import { detectLandmarks } from "../lib/mediapipe/faceLandmarker";
import {
  validateFacePosition,
  calculateFaceCenter,
} from "../lib/validators/facePosition";
import {
  validateFaceSize,
  validateEyeLevel,
  calculateFaceHeight,
} from "../lib/validators/faceSize";
import {
  validateHeadTilt,
  calculateHeadTilt,
} from "../lib/validators/headTilt";
import { validateImageDimensions } from "../lib/validators/imageDimensions";
import {
  validateForeheadVisible,
  validateEarsVisible,
  checkEarVisibility,
  checkForeheadVisibility,
} from "../lib/validators/visibility";

export function usePassportValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<PassportPhotoValidation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validatePhoto = useCallback(async (imageElement: HTMLImageElement) => {
    setIsValidating(true);
    setError(null);
    setValidationResult(null);

    try {
      // Ensure image is loaded and has valid dimensions
      if (!imageElement.complete || imageElement.naturalWidth === 0) {
        throw new Error("Image not fully loaded. Please try again.");
      }

      const { width, height } = imageElement;

      if (width === 0 || height === 0) {
        throw new Error("Image has invalid dimensions.");
      }

      // Step 1: Validate image dimensions
      const dimensionsResult = validateImageDimensions(
        width,
        height,
        DEFAULT_REQUIREMENTS,
      );

      // Step 2: Detect faces
      let faces;
      try {
        faces = await detectFaces(imageElement);
      } catch (faceDetectionError) {
        console.error("Face detection failed:", faceDetectionError);
        throw new Error(
          "Failed to detect faces. Please ensure the image is clear and contains a face.",
        );
      }

      const faceCountResult: ValidationResult =
        faces.length === 0
          ? {
              passed: false,
              message: "No face detected in the image",
              severity: "error",
            }
          : faces.length > 1
            ? {
                passed: false,
                message: `Multiple faces detected (${faces.length}). Only one person allowed`,
                severity: "error",
              }
            : {
                passed: true,
                message: "Single face detected",
                severity: "success",
              };

      const faceDetectionResult: ValidationResult = {
        passed: faces.length > 0,
        message:
          faces.length > 0 ? "Face detected successfully" : "No face detected",
        severity: faces.length > 0 ? "success" : "error",
      };

      // If no face or multiple faces, stop here
      if (faces.length !== 1) {
        setValidationResult({
          overall: false,
          results: {
            faceDetection: faceDetectionResult,
            faceCount: faceCountResult,
            facePosition: {
              passed: false,
              message: "Skipped - face detection failed",
              severity: "error",
            },
            faceSize: {
              passed: false,
              message: "Skipped - face detection failed",
              severity: "error",
            },
            eyeLevel: {
              passed: false,
              message: "Skipped - face detection failed",
              severity: "error",
            },
            headTilt: {
              passed: false,
              message: "Skipped - face detection failed",
              severity: "error",
            },
            foreheadVisible: {
              passed: false,
              message: "Skipped - face detection failed",
              severity: "error",
            },
            earsVisible: {
              passed: false,
              message: "Skipped - face detection failed",
              severity: "error",
            },
            imageDimensions: dimensionsResult,
            imageQuality: {
              passed: true,
              message: "Quality check passed",
              severity: "success",
            },
          },
        });
        setIsValidating(false);
        return;
      }

      // Step 3: Get detailed landmarks
      let landmarks;
      try {
        landmarks = await detectLandmarks(imageElement);
      } catch (landmarkError) {
        console.error("Landmark detection failed:", landmarkError);
        throw new Error(
          "Failed to analyze facial features. Please ensure the face is clearly visible.",
        );
      }

      if (!landmarks.faceLandmarks || landmarks.faceLandmarks.length === 0) {
        throw new Error(
          "Could not detect facial landmarks. Please use a clearer photo with a visible face.",
        );
      }

      // Step 4: Validate all aspects
      const positionResult = validateFacePosition(
        landmarks,
        width,
        height,
        DEFAULT_REQUIREMENTS,
      );
      const sizeResult = validateFaceSize(
        landmarks,
        height,
        DEFAULT_REQUIREMENTS,
      );
      const eyeLevelResult = validateEyeLevel(
        landmarks,
        height,
        DEFAULT_REQUIREMENTS,
      );
      const tiltResult = validateHeadTilt(landmarks, DEFAULT_REQUIREMENTS);
      const foreheadResult = validateForeheadVisible(landmarks);
      const earsResult = validateEarsVisible(landmarks);

      const qualityResult: ValidationResult = {
        passed: true,
        message: "Image quality acceptable",
        severity: "success",
      };

      // Calculate measurements
      const faceCenter = calculateFaceCenter(landmarks, width, height);
      const faceHeight = calculateFaceHeight(landmarks, height);
      const headTilt = calculateHeadTilt(landmarks);
      const foreheadVisible = checkForeheadVisibility(landmarks);
      const earVisibility = checkEarVisibility(landmarks);

      const allPassed = [
        faceDetectionResult,
        faceCountResult,
        positionResult,
        sizeResult,
        eyeLevelResult,
        tiltResult,
        foreheadResult,
        earsResult,
        dimensionsResult,
        qualityResult,
      ].every((result) => result.passed);

      const validation: PassportPhotoValidation = {
        overall: allPassed,
        results: {
          faceDetection: faceDetectionResult,
          faceCount: faceCountResult,
          facePosition: positionResult,
          faceSize: sizeResult,
          eyeLevel: eyeLevelResult,
          headTilt: tiltResult,
          foreheadVisible: foreheadResult,
          earsVisible: earsResult,
          imageDimensions: dimensionsResult,
          imageQuality: qualityResult,
        },
        measurements: {
          faceHeight: faceHeight || 0,
          faceWidth: 0,
          eyeLevel: 0,
          headTilt: headTilt || 0,
          faceCenter: faceCenter || { x: 0, y: 0 },
          foreheadVisible: foreheadVisible,
          leftEarVisible: earVisibility.leftEar,
          rightEarVisible: earVisibility.rightEar,
        },
      };

      setValidationResult(validation);
    } catch (err) {
      console.error("Validation error:", err);
      setError(err instanceof Error ? err.message : "Failed to validate photo");
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validatePhoto,
    isValidating,
    validationResult,
    error,
  };
}
