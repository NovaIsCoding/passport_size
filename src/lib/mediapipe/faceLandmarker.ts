"use client";

import {
  FaceLandmarker,
  FilesetResolver,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;
let isInitializing = false;

export async function initializeFaceLandmarker(): Promise<FaceLandmarker> {
  if (faceLandmarker) {
    return faceLandmarker;
  }

  if (isInitializing) {
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (faceLandmarker) {
      return faceLandmarker;
    }
  }

  isInitializing = true;

  try {
    console.log("🔄 Initializing MediaPipe Face Landmarker...");

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      },
      runningMode: "IMAGE",
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      numFaces: 1,
    });

    console.log("✓ Face Landmarker initialized successfully!");
    isInitializing = false;
    return faceLandmarker;
  } catch (error) {
    isInitializing = false;
    console.error("Failed to initialize face landmarker:", error);
    throw error;
  }
}

export async function detectLandmarks(
  imageElement: HTMLImageElement,
): Promise<FaceLandmarkerResult> {
  try {
    // Validate image element
    if (
      !imageElement ||
      !imageElement.complete ||
      imageElement.naturalWidth === 0
    ) {
      throw new Error("Image element is not ready or invalid");
    }

    const landmarker = await initializeFaceLandmarker();

    // The detect method returns a result synchronously
    const result = landmarker.detect(imageElement);

    // Log success for debugging
    const landmarkCount = result.faceLandmarks?.[0]?.length || 0;
    console.log(
      `✓ Landmark detection complete: Found ${landmarkCount} landmarks`,
    );

    return result;
  } catch (error) {
    console.error("✗ Error detecting landmarks:", error);
    throw error;
  }
}

export function cleanupFaceLandmarker(): void {
  if (faceLandmarker) {
    faceLandmarker.close();
    faceLandmarker = null;
  }
}
