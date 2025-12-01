"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Container, Section } from "@/app/components/layout";
import { Card } from "@/app/components/ui";

interface Artwork {
  id: number;
  title: string;
  artist: string | null;
  image_url: string | null;
  description: string | null;
  created_at: string;
}

export default function ArtworkDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
        <Section variant="default" spacing="lg">
          <Container>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-white/60 text-lg">
                  Loading artwork details...
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
        <Section variant="default" spacing="lg">
          <Container>
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="text-center">
                <p className="text-white text-lg font-semibold mb-2">
                  {error || "Artwork not found"}
                </p>
                <p className="text-white/60 text-sm">
                  The artwork you're looking for doesn't exist or has been
                  removed.
                </p>
              </div>
              <Link
                href="/artwork"
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
              >
                <ArrowLeft size={18} />
                Back to Gallery
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const formattedDate = new Date(artwork.created_at).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
      <Section variant="default" spacing="lg">
        <Container>
          {/* Back Button */}
          <Link
            href="/artwork"
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Gallery</span>
          </Link>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Image Section */}
            <div className="lg:col-span-2">
              <Card variant="glass" className="overflow-hidden border-white/5">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={artwork.image_url || "/artwork-placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Card>
            </div>

            {/* Info Section */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {artwork.title}
                </h1>
              </div>

              {/* Artist */}
              {artwork.artist && (
                <Card variant="glass" className="border-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">
                        Artist
                      </p>
                      <p className="text-white text-lg font-semibold">
                        {artwork.artist}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Date Created */}
              <Card variant="glass" className="border-white/5 p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">
                      Created
                    </p>
                    <p className="text-white text-lg font-semibold">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <Link
                  href="/artwork"
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-all text-center"
                >
                  More Artworks
                </Link>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">About</h2>
            <Card variant="glass" className="border-white/5 p-6">
              <p className="text-white/70 leading-relaxed">
                {artwork.description ||
                  "Jelajahi koleksi karya seni eksklusif kami yang menjadi inspirasi utama dalam setiap desain produk. Setiap karya seni memiliki cerita dan makna tersendiri yang mendalam. Desain ini mencerminkan kreativitas, inovasi, dan dedikasi tim desainer kami."}
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
