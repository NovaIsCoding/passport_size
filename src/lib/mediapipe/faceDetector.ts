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
    console.log("🔄 Initializing MediaPipe Face Detector...");
    console.log(
      "ℹ️  Note: You may see MediaPipe/TensorFlow info logs - these are normal!",
    );

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

    console.log("✓ Face Detector initialized successfully!");
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
    // Validate image element
    if (
      !imageElement ||
      !imageElement.complete ||
      imageElement.naturalWidth === 0
    ) {
      throw new Error("Image element is not ready or invalid");
    }

    const detector = await initializeFaceDetector();

    // The detect method returns a result synchronously
    const result = detector.detect(imageElement);

    // Log success for debugging
    console.log(
      `✓ Face detection complete: Found ${result.detections.length} face(s)`,
    );

    // Return the detections array
    return result.detections || [];
  } catch (error) {
    console.error("✗ Error detecting faces:", error);
    throw error;
  }
}

export function cleanupFaceDetector(): void {
  if (faceDetector) {
    faceDetector.close();
    faceDetector = null;
  }
}
