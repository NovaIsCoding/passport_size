"use client";

import { useEffect, useRef } from "react";

interface PhotoPreviewProps {
  image: HTMLImageElement | null;
  showGuides?: boolean;
}

export default function PhotoPreview({
  image,
  showGuides = true,
}: PhotoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image
    ctx.drawImage(image, 0, 0);

    // Draw guides if enabled
    if (showGuides) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Center vertical line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Eye level lines (50-60% from bottom)
      ctx.strokeStyle = "rgba(34, 197, 94, 0.6)";
      const eyeLevelMin = canvas.height * 0.4; // 60% from bottom
      const eyeLevelMax = canvas.height * 0.5; // 50% from bottom

      ctx.beginPath();
      ctx.moveTo(0, eyeLevelMin);
      ctx.lineTo(canvas.width, eyeLevelMin);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, eyeLevelMax);
      ctx.lineTo(canvas.width, eyeLevelMax);
      ctx.stroke();

      // Face height guide (70-80% of image)
      ctx.strokeStyle = "rgba(251, 146, 60, 0.6)";
      const faceHeightMin = canvas.height * 0.7;
      const faceHeightMax = canvas.height * 0.8;

      ctx.beginPath();
      ctx.rect(
        canvas.width * 0.25,
        canvas.height * 0.1,
        canvas.width * 0.5,
        faceHeightMin,
      );
      ctx.stroke();
    }
  }, [image, showGuides]);

  if (!image) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No image uploaded</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Photo Preview</h3>
        <div className="text-sm text-gray-600">
          {image.width} × {image.height}px
        </div>
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto border border-gray-200 rounded"
          style={{ maxHeight: "600px" }}
        />
      </div>
      {showGuides && (
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-400"></div>
            <span>Center guide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-400"></div>
            <span>Eye level zone (50-60% from bottom)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-400"></div>
            <span>Face height guide (70% of image)</span>
          </div>
        </div>
      )}
    </div>
  );
}
