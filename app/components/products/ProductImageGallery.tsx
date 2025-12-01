"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageCarousel } from "./ImageCarousel";
import { Card } from "@/app/components/ui";

interface ProductImageGalleryProps {
  images: Array<{
    id: number;
    image_url: string;
    order: number;
  }>;
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <Card
        variant="glass"
        className="p-4 overflow-hidden aspect-square flex items-center justify-center bg-white/5 border-white/10"
      >
        <ImageCarousel
          images={images}
          currentIndex={currentIndex}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      </Card>

      {/* Thumbnails Below */}
      {images.length > 1 && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 justify-center overflow-x-auto px-2 pb-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-white/80 ring-2 ring-amber-400"
                    : "border-white/30 hover:border-white/60"
                }`}
                aria-label={`Go to image ${index + 1}`}
              >
                <Image
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
