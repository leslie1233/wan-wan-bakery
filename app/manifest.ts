import type { MetadataRoute } from "next";
import { siteConfig } from "../lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Wan Wan",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ef",
    theme_color: "#b85c38",
    icons: [
      {
        src: "/images/logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
