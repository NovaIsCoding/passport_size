"use client";

import { useRef, useState, ChangeEvent, DragEvent } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement, file: File) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  onImageUpload,
  disabled,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        onImageUpload(img, file);
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : disabled
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-gray-400 bg-white"
      }`}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        {isDragging ? (
          <ImageIcon className="w-16 h-16 text-blue-500" />
        ) : (
          <Upload className="w-16 h-16 text-gray-400" />
        )}

        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragging ? "Drop your photo here" : "Upload Passport Photo"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click to browse or drag and drop your passport photo
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Recommended: 35mm × 45mm (413 × 531 pixels)
          </p>
        </div>
      </div>
    </div>
  );
}
