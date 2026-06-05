"use client";

import Image from "next/image";
import { useState } from "react";
import { getBannerFallback, getBannerImage } from "../lib/i18n/images";
import { useLocale } from "./LocaleProvider";

type HeroBannerProps = {
  alt: string;
};

export default function HeroBanner({ alt }: HeroBannerProps) {
  const { locale } = useLocale();
  const [src, setSrc] = useState(getBannerImage(locale));

  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      priority
      className="hero-image"
      onError={() => {
        if (src !== getBannerFallback()) {
          setSrc(getBannerFallback());
        }
      }}
    />
  );
}
