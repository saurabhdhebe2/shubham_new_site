# Shubham Film Productions

The official site of **Shubham Dhebe** - director, cinematographer (DOP), and editor based in Mumbai. End-to-end film production for brand films, commercials, music films, documentaries, podcasts, and reels.

Built with [Next.js](https://nextjs.org) (App Router) + vanilla CSS, with portfolio content pulled live from YouTube playlists.

## Stack

- **Next.js 16** (App Router, server components, ISR)
- **React 19**
- **Vanilla CSS** - no Tailwind, no UI libraries
- **YouTube Data API v3** - videos auto-update by adding to playlists
- **Playwright** - end-to-end test suite

## Getting started

Requires **Node ≥ 20** (Next.js 16 minimum).

```bash
nvm use 22
npm install
cp .env.local.example .env.local   # then fill in YouTube API key + playlist IDs
npm run dev                         # http://localhost:3000
```

## YouTube playlist wiring

Each portfolio category maps to a YouTube playlist. Add a video to a playlist and it auto-appears on the site (cached 1 hour via ISR).

| Category    | Env var                         |
|-------------|---------------------------------|
| Reels       | `YOUTUBE_PLAYLIST_REELS`        |
| Documentary | `YOUTUBE_PLAYLIST_DOCUMENTARY`  |
| Music Films | `YOUTUBE_PLAYLIST_MUSIC`        |
| Podcast     | `YOUTUBE_PLAYLIST_PODCAST`      |
| Commercial  | `YOUTUBE_PLAYLIST_COMMERCIAL`   |

Plus: `YOUTUBE_API_KEY` (Google Cloud Console → YouTube Data API v3) and `NEXT_PUBLIC_HERO_VIDEO_ID` (single YouTube video ID for the hero background).

## Tests

```bash
npm test            # headless Playwright run
npm run test:ui     # interactive UI mode
npm run test:headed # watch the browser
```

16 e2e tests cover: hero rendering, YouTube background, all 6 category filters, every tile's YouTube embed playability (oEmbed verified), contact drawer, mobile nav, and grid packing.

## Deploy

This site auto-deploys to Vercel on push to `main`. Set the same env vars in **Vercel → Settings → Environment Variables**.

## Links

- [Instagram](https://www.instagram.com/shubham.dhebe/)
- [YouTube](https://www.youtube.com/@shubhamdhebe)
- [Vimeo](https://vimeo.com/shubhamdhebe)
- [LinkedIn](https://www.linkedin.com/in/shubhamdhebe/)
- [IMDb](https://www.imdb.com/name/nm16964446/)
