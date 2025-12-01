"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: Array<{
    id: number;
    image_url: string;
    order: number;
  }>;
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ImageCarousel({
  images,
  currentIndex,
  onPrevious,
  onNext,
}: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-lg">
      <Image
        key={currentImage.id}
        src={currentImage.image_url}
        alt={`Product image ${currentIndex + 1}`}
        fill
        className="object-cover drop-shadow-2xl"
        priority
      />

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
