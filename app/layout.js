import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shubhamfilmproductions.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shubham Dhebe - Shubham Film Productions | Director · Cinematographer · Editor (Mumbai)",
    template: "%s · Shubham Film Productions",
  },
  description:
    "Shubham Film Productions is the independent film and post-production studio of Shubham Dhebe - director, cinematographer (DOP), and editor based in Mumbai, India. End-to-end production for brand films, commercials, music films, documentaries, podcasts, and reels.",
  applicationName: "Shubham Film Productions",
  authors: [{ name: "Shubham Dhebe", url: SITE_URL }],
  creator: "Shubham Dhebe",
  publisher: "Shubham Film Productions",
  keywords: [
    "Shubham Dhebe",
    "Shubham Films",
    "Shubham Film Productions",
    "Shubham Dhebe Mumbai",
    "Shubham Dhebe director",
    "Shubham Dhebe cinematographer",
    "Shubham Dhebe DOP",
    "Shubham Dhebe editor",
    "Shubham Dhebe portfolio",
    "Shubham Dhebe showreel",
    "Shubham Dhebe IMDb",
    "Shubham film",
    "Shubham production house",
    "Mumbai film production",
    "Mumbai cinematographer",
    "Mumbai director",
    "Mumbai film editor",
    "brand film Mumbai",
    "commercial film production Mumbai",
    "documentary filmmaker Mumbai",
    "music video director Mumbai",
    "reels production Mumbai",
    "podcast production Mumbai",
    "end to end video production",
    "DOP for hire India",
    "freelance editor Mumbai",
    "Shubham Dhebe Instagram",
    "Shubham Dhebe YouTube",
    "Shubham Dhebe Vimeo",
    "Shubham Dhebe LinkedIn",
  ],
  category: "Film & Video Production",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Shubham Film Productions",
    title: "Shubham Dhebe - Shubham Film Productions | Mumbai",
    description:
      "Independent film and post-production by Shubham Dhebe - director, cinematographer, and editor. Brand films, commercials, music films, documentaries, podcasts, and reels.",
    locale: "en_IN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Shubham Film Productions - Shubham Dhebe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubham Dhebe - Shubham Film Productions",
    description:
      "Director · Cinematographer · Editor - Mumbai. Cinematic content for modern brands.",
    images: ["/og.jpg"],
    creator: "@shubhamdhebe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    // Add your Google Search Console / Bing verification codes here when you have them:
    // google: "...",
    // other: { "msvalidate.01": "..." },
  },
};

const JSON_LD_PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shubham Dhebe",
  alternateName: ["Shubham", "Shubham Film Productions"],
  jobTitle: ["Director", "Cinematographer", "Editor", "DOP"],
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  worksFor: { "@type": "Organization", name: "Shubham Film Productions" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/shubham.dhebe/",
    "https://www.youtube.com/@shubhamdhebe",
    "https://vimeo.com/shubhamdhebe",
    "https://www.linkedin.com/in/shubhamdhebe/",
    "https://www.imdb.com/name/nm16964446/",
  ],
};

const JSON_LD_ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shubham Film Productions",
  alternateName: ["Shubham Films", "Shubham Dhebe Productions"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  founder: { "@type": "Person", name: "Shubham Dhebe" },
  foundingDate: "2017",
  description:
    "Independent film and post-production studio. End-to-end production for brand films, commercials, music films, documentaries, podcasts, and reels.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-7738616434",
      contactType: "customer service",
      email: "hello@shubhamfilmproductions.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
  ],
  sameAs: [
    "https://www.instagram.com/shubham.dhebe/",
    "https://www.youtube.com/@shubhamdhebe",
    "https://vimeo.com/shubhamdhebe",
    "https://www.linkedin.com/in/shubhamdhebe/",
    "https://www.imdb.com/name/nm16964446/",
  ],
};

const JSON_LD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Shubham Film Productions",
  alternateName: ["Shubham Dhebe", "Shubham Films"],
  url: SITE_URL,
  publisher: { "@type": "Organization", name: "Shubham Film Productions" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="format-detection" content="telephone=yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_PERSON) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ORG) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_WEBSITE) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
