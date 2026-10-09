import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { path: "", priority: 1 },
    { path: "/mobile-detailing-harrisonburg-va", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/book", priority: 0.8 },
    { path: "/about", priority: 0.6 },
  ].map(({ path, priority }) => ({
    url: `${site.domain}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
