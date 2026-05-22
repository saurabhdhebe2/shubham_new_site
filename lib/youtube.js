// Shared YouTube playlist fetcher used by both the API route and server pages
// so the page render doesn't need an HTTP round-trip through its own API.

const CATEGORY_MAP = () => ({
  documentary: process.env.YOUTUBE_PLAYLIST_DOCUMENTARY,
  music:       process.env.YOUTUBE_PLAYLIST_MUSIC,
  podcast:     process.env.YOUTUBE_PLAYLIST_PODCAST,
  commercial:  process.env.YOUTUBE_PLAYLIST_COMMERCIAL,
  reels:       process.env.YOUTUBE_PLAYLIST_REELS,
});

const CATEGORY_LABEL = {
  reels:       'Reels',
  documentary: 'Documentary',
  music:       'Music Films',
  podcast:     'Podcast',
  commercial:  'Commercial',
};

// Sizes for horizontal (16:9) tiles. Only widths that divide 12 cleanly into uniform
// 16:9 rows (third=4 cols, half=6 cols). Avoids wide/bento/cine which create uneven
// row heights and big gaps when mixed with vertical reels.
const SIZES = ['third', 'third', 'half', 'third', 'half', 'third'];
const STILLS = Array.from({ length: 12 }, (_, i) => `still-${i + 1}`);

const MOCK_VIDEOS = {
  documentary: [
    { title: 'Lantern Days', client: 'Mumbai Indians', year: 2025 },
    { title: 'Field Notes', client: 'Reliance Foundation', year: 2024 },
  ],
  music: [
    { title: 'After Hours', client: 'Ketto', year: 2025 },
    { title: 'Neon Mile', client: 'Pro Kabaddi League', year: 2023 },
  ],
  podcast: [
    { title: 'Studio Hours', client: 'Long-Form', year: 2025 },
  ],
  commercial: [
    { title: 'Ledger', client: 'Flipkart Super Coin', year: 2025 },
    { title: 'The Long Way', client: 'Tata Mumbai Marathon', year: 2025 },
  ],
  reels: [
    { title: 'Atlas Reel', client: 'IIFA Awards', year: 2024 },
    { title: 'Violet Hour', client: 'Pro Badminton League', year: 2025 },
    { title: 'Tempo', client: 'Indian Super League', year: 2024 },
  ],
};

async function fetchPlaylist(playlistId, category) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || !playlistId) return null;

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    // Reels are vertical (9:16) always render them in the tall slot so they
    // don't get stretched into a 16:9 / wide / cine box and look broken.
    const isVertical = category === 'reels';
    return (data.items || []).map((item, i) => ({
      id: item.snippet.resourceId.videoId,
      youtubeId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      client: '',
      cat: CATEGORY_LABEL[category] || category,
      year: new Date(item.snippet.publishedAt).getFullYear(),
      role: 'Director / DOP / Editor',
      deliverables: '',
      thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || '',
      publishedAt: item.snippet.publishedAt,
      size: isVertical ? 'tall' : SIZES[i % SIZES.length],
      still: STILLS[i % STILLS.length],
    }));
  } catch {
    return null;
  }
}

export async function getVideosByCategory(category = 'all') {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const map = CATEGORY_MAP();

  // No API key → mock data
  if (!apiKey) {
    if (category === 'all') {
      return Object.entries(MOCK_VIDEOS).flatMap(([cat, vids]) =>
        vids.map((v, i) => ({
          ...v,
          id: `${cat}-${i}`,
          youtubeId: '',
          cat: CATEGORY_LABEL[cat] || cat,
          size: cat === 'reels' ? 'tall' : SIZES[i % SIZES.length],
          still: STILLS[i % STILLS.length],
          thumbnail: '',
          role: 'Editor',
          deliverables: '',
        }))
      );
    }
    return (MOCK_VIDEOS[category] || []).map((v, i) => ({
      ...v,
      id: `${category}-${i}`,
      youtubeId: '',
      cat: CATEGORY_LABEL[category] || category,
      size: SIZES[i % SIZES.length],
      still: STILLS[i % STILLS.length],
      thumbnail: '',
      role: 'Editor',
      deliverables: '',
    }));
  }

  if (category === 'all') {
    const results = await Promise.all(
      Object.entries(map).map(([cat, pid]) => fetchPlaylist(pid, cat))
    );
    // Concatenate buckets in CATEGORY_MAP order (documentary → music → podcast →
    // commercial → reels) so the "All" view shows each category grouped, with
    // reels at the very end.
    const sequenced = results.filter(Boolean).flat();
    return sequenced.map((v, i) => ({
      ...v,
      size: v.cat === 'Reels' ? 'tall' : SIZES[i % SIZES.length],
    }));
  }

  const videos = await fetchPlaylist(map[category], category);
  return videos || [];
}
