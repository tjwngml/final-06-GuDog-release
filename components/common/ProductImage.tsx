"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

const DEFAULT_FALLBACK = "/images/product-404.jpg";

export default function ProductImage({
  src,
  alt,
  fallback = DEFAULT_FALLBACK,
  className = "",
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <div className={`relative aspect-square w-full bg-[#FFF9F2] ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        unoptimized
        className="object-contain"
        onError={() => setImgSrc(fallback)}
      />
    </div>
  );
}
