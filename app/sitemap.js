const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shubhamfilmproductions.com";

export default function sitemap() {
  const now = new Date();
  const sections = ["work", "services", "process", "about", "contact", "journal"];
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    ...sections.map((s) => ({
      url: `${SITE_URL}/#${s}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
