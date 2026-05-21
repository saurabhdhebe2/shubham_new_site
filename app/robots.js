const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shubhamfilmproductions.com";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
