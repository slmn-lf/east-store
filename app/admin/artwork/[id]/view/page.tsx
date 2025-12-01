"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface Artwork {
  id: number;
  title: string;
  artist: string | null;
  image_url: string | null;
  price_cents: number | null;
  created_at: string;
}

export default function AdminArtworkDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchArtwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchArtwork = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/artworks/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Artwork not found");
        } else {
          throw new Error("Failed to fetch artwork");
        }
      } else {
        const data = await response.json();
        setArtwork(data);
      }
    } catch (err) {
      console.error("Error fetching artwork:", err);
      setError("Failed to load artwork details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // Handle logout
  };

  const handleDelete = async () => {
    if (!artwork) return;

    if (confirm("Are you sure you want to delete this artwork?")) {
      try {
        const response = await fetch(`/api/artworks/${artwork.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete");
        window.location.href = "/admin/artwork";
      } catch (error) {
        console.error("Error deleting artwork:", error);
        alert("Failed to delete artwork");
      }
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
        title="Artwork Details"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          {/* Back Button */}
          <Link
            href="/admin/artwork"
            className="inline-flex items-center gap-2 mb-6 text-white/70 hover:text-white transition-colors group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Artworks</span>
          </Link>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-white/60 text-lg">
                  Loading artwork details...
                </p>
              </div>
            </div>
          ) : error || !artwork ? (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8 text-center">
              <p className="text-white text-lg font-semibold mb-4">
                {error || "Artwork not found"}
              </p>
              <Link
                href="/admin/artwork"
                className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
              >
                <ChevronLeft size={18} />
                Back to Artworks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Section */}
              <div className="lg:col-span-2">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden p-6">
                  <div className="relative aspect-square overflow-hidden rounded-xl mb-6">
                    <Image
                      src={artwork.image_url || "/artwork-placeholder.svg"}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">
                      {artwork.title}
                    </h1>
                    {artwork.artist && (
                      <p className="text-white/70 text-lg">
                        by {artwork.artist}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:col-span-1 space-y-4">
                {/* Details Card */}
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 space-y-4">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">ID</p>
                    <p className="text-white font-mono">{artwork.id}</p>
                  </div>

                  {artwork.artist && (
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">
                        Artist
                      </p>
                      <p className="text-white">{artwork.artist}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">
                      Created
                    </p>
                    <p className="text-white">
                      {new Date(artwork.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  {artwork.price_cents && (
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">
                        Price
                      </p>
                      <p className="text-white text-xl font-bold">
                        {(artwork.price_cents / 100).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  )}

                  {artwork.image_url && (
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">
                        Image URL
                      </p>
                      <a
                        href={artwork.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm break-all transition-colors"
                      >
                        {artwork.image_url}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Link
                    href={`/admin/artwork/${artwork.id}/edit`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 font-medium transition-all"
                  >
                    <Edit2 size={18} />
                    Edit Artwork
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 font-medium transition-all"
                  >
                    <Trash2 size={18} />
                    Delete Artwork
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
