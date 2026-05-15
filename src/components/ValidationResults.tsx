"use client";

import { PassportPhotoValidation } from "@/lib/types/validation";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ValidationResultsProps {
  validation: PassportPhotoValidation;
}

export default function ValidationResults({
  validation,
}: ValidationResultsProps) {
  const getIcon = (severity: "error" | "warning" | "success") => {
    switch (severity) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const results = [
    { label: "Face Detection", result: validation.results.faceDetection },
    { label: "Face Count", result: validation.results.faceCount },
    { label: "Face Position", result: validation.results.facePosition },
    { label: "Face Size", result: validation.results.faceSize },
    { label: "Eye Level", result: validation.results.eyeLevel },
    { label: "Head Tilt", result: validation.results.headTilt },
    { label: "Forehead Visible", result: validation.results.foreheadVisible },
    { label: "Ears Visible", result: validation.results.earsVisible },
    { label: "Image Dimensions", result: validation.results.imageDimensions },
    { label: "Image Quality", result: validation.results.imageQuality },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {validation.overall ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700">
                Photo Approved!
              </h2>
            </>
          ) : (
            <>
              <XCircle className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-red-700">
                Photo Needs Improvement
              </h2>
            </>
          )}
        </div>
        <p className="text-gray-600">
          {validation.overall
            ? "Your photo meets all passport requirements."
            : "Please review the issues below and upload a corrected photo."}
        </p>
      </div>

      <div className="space-y-3">
        {results.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              item.result.severity === "success"
                ? "bg-green-50"
                : item.result.severity === "warning"
                  ? "bg-yellow-50"
                  : "bg-red-50"
            }`}
          >
            <div className="mt-0.5">{getIcon(item.result.severity)}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600 mt-0.5">
                {item.result.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {validation.measurements && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Measurements</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Face Height:</span>
              <span className="ml-2 font-medium">
                {validation.measurements.faceHeight.toFixed(0)}px
              </span>
            </div>
            <div>
              <span className="text-gray-600">Head Tilt:</span>
              <span className="ml-2 font-medium">
                {validation.measurements.headTilt.toFixed(1)}°
              </span>
            </div>
            <div>
              <span className="text-gray-600">Face Center X:</span>
              <span className="ml-2 font-medium">
                {validation.measurements.faceCenter.x.toFixed(0)}px
              </span>
            </div>
            <div>
              <span className="text-gray-600">Face Center Y:</span>
              <span className="ml-2 font-medium">
                {validation.measurements.faceCenter.y.toFixed(0)}px
              </span>
            </div>
            <div>
              <span className="text-gray-600">Forehead:</span>
              <span className="ml-2 font-medium">
                {validation.measurements.foreheadVisible
                  ? "✓ Visible"
                  : "✗ Not visible"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Ears:</span>
              <span className="ml-2 font-medium">
                {validation.measurements.leftEarVisible &&
                validation.measurements.rightEarVisible
                  ? "✓ Both visible"
                  : validation.measurements.leftEarVisible
                    ? "✓ Left visible"
                    : validation.measurements.rightEarVisible
                      ? "✓ Right visible"
                      : "✗ Not visible"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
