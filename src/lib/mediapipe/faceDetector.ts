"use client";

import {
  FaceDetector,
  FilesetResolver,
  Detection,
} from "@mediapipe/tasks-vision";

let faceDetector: FaceDetector | null = null;
let isInitializing = false;

export async function initializeFaceDetector(): Promise<FaceDetector> {
  if (faceDetector) {
    return faceDetector;
  }

  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (faceDetector) {
      return faceDetector;
    }
  }

  isInitializing = true;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
      },
      runningMode: "IMAGE",
      minDetectionConfidence: 0.5,
    });

    isInitializing = false;
    return faceDetector;
  } catch (error) {
    isInitializing = false;
    console.error("Failed to initialize face detector:", error);
    throw error;
  }
}

export async function detectFaces(
  imageElement: HTMLImageElement,
): Promise<Detection[]> {
  try {
    const detector = await initializeFaceDetector();
    const detections = detector.detect(imageElement);
    return detections.detections || [];
  } catch (error) {
    console.error("Error detecting faces:", error);
    throw error;
  }
}

export function cleanupFaceDetector(): void {
  if (faceDetector) {
    faceDetector.close();
    faceDetector = null;
  }
}
