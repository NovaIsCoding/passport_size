import {
  ValidationResult,
  PassportPhotoRequirements,
} from "../types/validation";

export function validateImageDimensions(
  width: number,
  height: number,
  requirements: PassportPhotoRequirements,
): ValidationResult {
  const actualRatio = width / height;
  const expectedRatio = requirements.aspectRatio;
  const ratioTolerance = 0.05; // 5% tolerance

  if (width < requirements.minWidth || height < requirements.minHeight) {
    return {
      passed: false,
      message: `Image too small (${width}×${height}px). Minimum: ${requirements.minWidth}×${requirements.minHeight}px`,
      severity: "error",
    };
  }

  if (Math.abs(actualRatio - expectedRatio) > ratioTolerance) {
    return {
      passed: false,
      message: `Incorrect aspect ratio (${actualRatio.toFixed(2)}). Expected: ${expectedRatio.toFixed(2)} (35mm×45mm)`,
      severity: "warning",
    };
  }

  return {
    passed: true,
    message: `Image dimensions are correct (${width}×${height}px)`,
    severity: "success",
  };
}
