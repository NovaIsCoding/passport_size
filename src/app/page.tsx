"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import PhotoPreview from "@/components/PhotoPreview";
import ValidationResults from "@/components/ValidationResults";
import { usePassportValidator } from "@/hooks/usePassportValidator";
import { Camera, CheckCircle, RotateCcw, Loader2 } from "lucide-react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { validatePhoto, isValidating, validationResult, error } =
    usePassportValidator();

  const handleImageUpload = async (image: HTMLImageElement, file: File) => {
    setUploadedImage(image);
    setImageFile(file);
    await validatePhoto(image);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Passport Photo Checker
              </h1>
              <p className="text-sm text-gray-600">
                Verify your photo meets international passport standards
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedImage ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your Passport Photo
              </h2>
              <p className="text-gray-600">
                Our AI-powered tool will analyze your photo and verify it meets
                all passport requirements
              </p>
            </div>

            <ImageUploader
              onImageUpload={handleImageUpload}
              disabled={isValidating}
            />

            {/* Requirements Info */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Passport Photo Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Image size: 35mm × 45mm (413 × 531 pixels)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Face height: 70-80% of photo height</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Face centered horizontally</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Eyes at 50-60% from bottom</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Head straight (no tilt)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Forehead clearly visible</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>At least one ear visible</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Neutral expression, eyes open</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Loading State */}
            {isValidating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-blue-800 font-medium">
                  Analyzing your photo...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error: {error}</p>
              </div>
            )}

            {/* Results Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PhotoPreview image={uploadedImage} showGuides={true} />
              {validationResult && (
                <ValidationResults validation={validationResult} />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                Upload Another Photo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>Powered by MediaPipe Face Detection & Next.js</p>
          <p className="mt-1">
            All processing is done locally in your browser - your photos never
            leave your device
          </p>
        </div>
      </footer>
    </div>
  );
}
