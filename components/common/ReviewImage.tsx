"use client";

import { useState } from "react";
import Image from "next/image";

interface reviewImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

const DEFAULT_FALLBACK = "/images/review-placeholder.png";

export default function ReviewImage({
  src,
  alt,
  fallback = DEFAULT_FALLBACK,
  className = "",
}: reviewImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <div className={`relative aspect-square w-full bg-[#FFF9F2] ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        onError={() => setImgSrc(fallback)}
      />
    </div>
  );
}
