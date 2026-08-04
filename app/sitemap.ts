import type { MetadataRoute } from "next";

const BASE_URL = "https://www.amoriai.app";

const LANGUAGES = ["fr", "en", "es"] as const;

const ROUTES = [
  "",
  "/about",
  "/companions",
  "/pricing",
  "/pricing-public",
  "/contact",
  "/faq",
  "/legal",
  "/login",
  "/signup",
  "/create-amoria",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    const languages = Object.fromEntries(
      LANGUAGES.map((lang) => [
        lang,
        `${BASE_URL}${route}?lang=${lang}`,
      ]),
    );

    for (const lang of LANGUAGES) {
      sitemap.push({
        url: `${BASE_URL}${route}?lang=${lang}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority:
          route === ""
            ? 1.0
            : route === "/pricing-public"
            ? 0.95
            : route === "/signup"
            ? 0.95
            : route === "/pricing"
            ? 0.90
            : 0.80,
        alternates: {
          languages,
        },
      });
    }
  }

  return sitemap;
}
