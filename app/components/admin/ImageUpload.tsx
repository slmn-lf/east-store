"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  currentImage?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  currentImage,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage || null
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Silakan pilih file gambar yang valid");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file tidak boleh lebih dari 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload gagal");
      }

      const data = await response.json();

      if (data.success && data.url) {
        onUploadSuccess(data.url);
        setPreviewUrl(data.url);
        setError(null);
      } else {
        setError(data.message || "Upload gagal");
        setPreviewUrl(currentImage || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload gagal";
      setError(errorMessage);
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />

          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-colors bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5 text-white/70" />
            <span className="text-white/70">
              {isUploading
                ? "Sedang mengunggah..."
                : "Klik untuk upload gambar"}
            </span>
          </label>
        </div>

        <p className="text-xs text-white/50 mt-2">
          Format: JPG, PNG, WebP | Maksimal 5MB
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {previewUrl && (
        <div className="border border-white/20 rounded-lg p-4 bg-white/5">
          <p className="text-xs text-white/70 mb-2">Preview:</p>
          <div className="w-full aspect-square bg-black/50 rounded overflow-hidden flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

ImageUpload.displayName = "ImageUpload";
