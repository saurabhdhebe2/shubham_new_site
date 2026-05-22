const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shubhamfilmproductions.com";

export default function sitemap() {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ];
}
