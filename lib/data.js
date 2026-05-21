export const NAV_LINKS = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const CLIENTS = [
  "Mumbai Indians", "Pro Kabaddi League", "Indian Super League", "Flipkart Super Coin",
  "Dentzz", "Coach Hayward", "Coach Scott", "Fable Fund", "Akash Mehta",
  "Indian Street Premier League", "Gopi Films", "SocialPanga", "The Yellow Shutter",
  "Creative Tigers", "Lagrange", "Sportz Interactive", "IIFA Awards", "Shivsena",
  "Ketto", "Patana Pirates", "Tata Mumbai Marathon", "Reliance Foundations",
  "Pro Badminton League", "Offbeat Media", "Audacity", "Tata Sons", "Tata Power", "Tata",
];

export const CATEGORIES = ["All", "Reels", "Documentary", "Music Films", "Podcast", "Commercial"];

// Static fallback projects shown when YouTube playlists are not configured.
// Replace with real data by adding videos to the YouTube playlists configured in .env.local.
export const STATIC_PROJECTS = [
  {
    id: "lantern",
    title: "Lantern Days",
    client: "Mumbai Indians",
    cat: "Documentary",
    dur: "02:47",
    year: 2025,
    role: "Director / Editor",
    deliverables: "60s spot · 6s cutdowns · 9:16 social",
    still: "still-3",
    size: "wide",
    youtubeId: "",
  },
  {
    id: "ledger",
    title: "Ledger",
    client: "Flipkart Super Coin",
    cat: "Documentary",
    dur: "00:47",
    year: 2025,
    role: "Editor",
    deliverables: "30s broadcast · 15s pre-roll",
    still: "still-1",
    size: "third",
    youtubeId: "",
  },
  {
    id: "fieldnotes",
    title: "Field Notes",
    client: "Reliance Foundation",
    cat: "Documentary",
    dur: "01:32",
    year: 2024,
    role: "Edit / Color",
    deliverables: "90s film · 6× 9:16 vertical",
    still: "still-2",
    size: "tall",
    youtubeId: "",
  },
  {
    id: "after-hours",
    title: "After Hours",
    client: "Ketto",
    cat: "Music Films",
    dur: "03:24",
    year: 2025,
    role: "Editor / Colorist",
    deliverables: "Music video · TikTok cuts",
    still: "still-6",
    size: "half",
    youtubeId: "",
  },
  {
    id: "atlas",
    title: "Atlas Reel",
    client: "IIFA Awards",
    cat: "Reels",
    dur: "00:30",
    year: 2024,
    role: "Editor",
    deliverables: "30s spot · Pre-roll",
    still: "still-4",
    size: "third",
    youtubeId: "",
  },
  {
    id: "kilim",
    title: "Kilim",
    client: "The Yellow Shutter",
    cat: "Documentary",
    dur: "01:15",
    year: 2025,
    role: "Director / Editor",
    deliverables: "75s · Reels · OOH stills",
    still: "still-9",
    size: "bento",
    youtubeId: "",
  },
  {
    id: "softlight",
    title: "Softlight",
    client: "Dentzz",
    cat: "Documentary",
    dur: "02:08",
    year: 2024,
    role: "Editor / Color",
    deliverables: "2min cut · 60s · 30s · 15s",
    still: "still-8",
    size: "bento",
    youtubeId: "",
  },
  {
    id: "longway",
    title: "The Long Way",
    client: "Tata Mumbai Marathon",
    cat: "Documentary",
    dur: "01:00",
    year: 2025,
    role: "Lead Editor",
    deliverables: "60s broadcast · Trailer cut",
    still: "still-11",
    size: "cine",
    youtubeId: "",
  },
  {
    id: "violet",
    title: "Violet Hour",
    client: "Pro Badminton League",
    cat: "Reels",
    dur: "00:38",
    year: 2025,
    role: "Editor",
    deliverables: "Vertical 9:16 · IG / TikTok",
    still: "still-7",
    size: "tall",
    youtubeId: "",
  },
  {
    id: "tempo",
    title: "Tempo",
    client: "Indian Super League",
    cat: "Reels",
    dur: "00:42",
    year: 2024,
    role: "Editor",
    deliverables: "Reels series × 4",
    still: "still-5",
    size: "third",
    youtubeId: "",
  },
  {
    id: "wires",
    title: "Wires & Wool",
    client: "Fable Fund",
    cat: "Documentary",
    dur: "01:55",
    year: 2024,
    role: "Editor",
    deliverables: "Author film · Trailer",
    still: "still-10",
    size: "half",
    youtubeId: "",
  },
  {
    id: "neon",
    title: "Neon Mile",
    client: "Pro Kabaddi League",
    cat: "Music Films",
    dur: "04:12",
    year: 2023,
    role: "Editor / Color",
    deliverables: "Long-form · Festival cut",
    still: "still-12",
    size: "third",
    youtubeId: "",
  },
];

export const SERVICES = [
  {
    n: "01", t: "Direction",
    d: "From concept and treatment to performance on set. I direct films that hold attention and earn the cut.",
    items: [
      ["Creative concept", "Bespoke"],
      ["Treatment & script", "Pre-pro"],
      ["Casting & blocking", "On set"],
      ["Performance direction", "Lead"],
    ],
  },
  {
    n: "02", t: "Cinematography",
    d: "Camera, lens, light. I shoot with intent - composition, motion, and color in service of the story.",
    items: [
      ["DOP / Camera op", "Per day"],
      ["Lensing & lighting", "Hero rigs"],
      ["Gimbal / handheld", "All rigs"],
      ["DIT & dailies", "Day +1"],
    ],
  },
  {
    n: "03", t: "Editing",
    d: "Frame-perfect cuts, rhythm, and pacing. From rough assembly to delivery master in every aspect ratio.",
    items: [
      ["Story structure", "Discovery"],
      ["Rough → fine cut", "3 rounds"],
      ["Sound design pass", "Included"],
      ["Master delivery", "All formats"],
    ],
  },
  {
    n: "04", t: "End-to-End Production",
    d: "One team, one accountability. Pre-pro, shoot, edit, color, motion, sound - delivered.",
    items: [
      ["Pre-production", "Treatment → call sheet"],
      ["Crew & equipment", "Full kit"],
      ["Post (edit + color)", "In-house"],
      ["Motion & sound", "Included"],
    ],
  },
];

export const PROCESS_STEPS = [
  { n: "01", label: "Brief", desc: "Discovery call, references, scope. We write a one-page treatment and lock the rough timeline.", time: "Day 0-3" },
  { n: "02", label: "Build", desc: "Rough cut to fine cut. Three structured rounds of feedback, async or in real time.", time: "Day 4-14" },
  { n: "03", label: "Polish", desc: "Color grade, sound design and mix, motion graphics. Everything tuned to the master format.", time: "Day 15-18" },
  { n: "04", label: "Deliver", desc: "Masters in every aspect ratio you need: 16:9, 9:16, 1:1, plus cutdowns for paid and social.", time: "Day 19-21" },
];

export const TESTIMONIALS = [
  {
    quote: "Shubham reads a brief like a script. He shipped a 60-second spot that felt like a 4-minute short. Every cut earned.",
    name: "Maya Okafor",
    role: "Creative Director · Mumbai Indians",
  },
  {
    quote: "Best editor we've worked with. Calm, opinionated, and ruthless about pacing. Hire him before everyone else does.",
    name: "Tom Whitley",
    role: "Producer · IIFA Awards",
  },
  {
    quote: "Three rounds of notes, three perfect responses. The final color grade made our product look like it was carved out of glass.",
    name: "Anjali Rao",
    role: "Brand Lead · Flipkart Super Coin",
  },
  {
    quote: "We sent a folder of rushes from four cities. He sent back a story.",
    name: "Lewis Marlowe",
    role: "Producer · Tata Mumbai Marathon",
  },
];

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/shubham.dhebe/",
  youtube:   "https://www.youtube.com/@shubhamdhebe",
  vimeo:     "https://vimeo.com/shubhamdhebe",
  linkedin:  "https://www.linkedin.com/in/shubhamdhebe/",
  imdb:      "https://www.imdb.com/name/nm16964446/?ref_=ext_shr_lnk",
};

export const YOUTUBE_CHANNEL = SOCIAL_LINKS.youtube;
export const CONTACT_EMAIL = "hello@shubhamfilm.com";
export const CONTACT_PHONE = "+91 7738616434";
