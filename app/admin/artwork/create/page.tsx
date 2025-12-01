"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload } from "lucide-react";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface ArtworkForm {
  title: string;
  artist: string;
  description?: string | null;
  image_url?: string | null;
}

export default function CreateArtworkPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArtworkForm>({
    title: "",
    artist: "",
    description: null,
    image_url: null,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    // Handle logout
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setFormData((prev) => ({
          ...prev,
          image_url: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.title.trim() || !formData.artist.trim()) {
        setError("Title and Artist are required");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          artist: formData.artist.trim(),
          image_url: formData.image_url || null,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create artwork");
      }

      const newArtwork = await response.json();
      console.log("Artwork created:", newArtwork);

      // Redirect ke halaman artwork list
      router.push("/admin/artwork");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Error creating artwork:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800">
      {/* Mobile Navigation */}
      <AdminMobileNav onLogout={handleLogout} title="EastStore" />

      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header */}
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        title="Create Artwork"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6 max-w-4xl">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/artwork"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="text-white" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Artwork</h1>
              <p className="text-white/60 mt-1">
                Add a new artwork to your gallery
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Image Upload Section */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Artwork Image (Optional)
              </h2>

              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          image_url: null,
                        }));
                      }}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg text-sm transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-64 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white font-medium">Drop image here</p>
                      <p className="text-white/60 text-sm">
                        or click to select
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Artwork Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter artwork title"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Artist *
                  </label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                  />
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description - Optional
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    placeholder="Enter artwork description"
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all resize-none"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Tell about this artwork
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              <Link
                href="/admin/artwork"
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-all text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-medium rounded-lg transition-all"
              >
                {isLoading ? "Creating..." : "Create Artwork"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
