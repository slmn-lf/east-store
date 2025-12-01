"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Section } from "@/app/components/layout";
import { Card } from "@/app/components/ui";

interface Artwork {
  id: number;
  title: string;
  artist: string | null;
  image_url: string | null;
  price_cents: number | null;
  created_at: string;
}

export default function ArtworkPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/artworks");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
      <Section variant="default" spacing="lg">
        <Container>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-6">
              Our Artwork Gallery
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Jelajahi koleksi karya seni eksklusif yang menjadi jiwa dari
              setiap produk kami. Setiap desain memiliki cerita dan makna
              tersendiri.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-white/60 text-lg">Loading artworks...</p>
              </div>
            </div>
          ) : artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((art) => (
                <Link
                  key={art.id}
                  href={`/artwork/${art.id}`}
                  className="block"
                >
                  <Card
                    variant="glass"
                    className="group overflow-hidden border-white/5 hover:border-amber-500/30 transition-all duration-500 cursor-pointer h-full"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <Image
                        src={art.image_url || "/artwork-placeholder.svg"}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-3">
                        {art.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {art.artist ? `by ${art.artist}` : "Unknown artist"}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-white/60 text-lg">No artworks available</p>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
