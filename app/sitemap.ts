import type { MetadataRoute } from "next";

const BASE_URL = "https://www.amoriai.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/pricing",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/blog",
    "/companions",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
