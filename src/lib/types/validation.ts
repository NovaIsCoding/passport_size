export interface FaceLandmarks {
  x: number;
  y: number;
  z?: number;
}

export interface FaceDetectionResult {
  detected: boolean;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: FaceLandmarks[];
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "success";
}

export interface PassportPhotoValidation {
  overall: boolean;
  results: {
    faceDetection: ValidationResult;
    faceCount: ValidationResult;
    facePosition: ValidationResult;
    faceSize: ValidationResult;
    eyeLevel: ValidationResult;
    headTilt: ValidationResult;
    imageDimensions: ValidationResult;
    imageQuality: ValidationResult;
  };
  measurements?: {
    faceHeight: number;
    faceWidth: number;
    eyeLevel: number;
    headTilt: number;
    faceCenter: { x: number; y: number };
  };
}

export interface PassportPhotoRequirements {
  minWidth: number;
  minHeight: number;
  aspectRatio: number;
  faceHeightMin: number; // percentage
  faceHeightMax: number; // percentage
  eyeLevelMin: number; // percentage from bottom
  eyeLevelMax: number; // percentage from bottom
  maxHeadTilt: number; // degrees
  horizontalCenterTolerance: number; // percentage
}

export const DEFAULT_REQUIREMENTS: PassportPhotoRequirements = {
  minWidth: 413,
  minHeight: 531,
  aspectRatio: 0.777, // 35mm/45mm
  faceHeightMin: 70,
  faceHeightMax: 80,
  eyeLevelMin: 50,
  eyeLevelMax: 60,
  maxHeadTilt: 5,
  horizontalCenterTolerance: 5,
};
