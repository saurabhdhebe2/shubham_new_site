'use client';
import { Arrow, Play } from './Icons';

// Env-configurable hero background video.
// Set NEXT_PUBLIC_HERO_VIDEO_ID in .env.local (YouTube video ID, e.g. djC_8Xwzh2o)
const HERO_VIDEO_ID = process.env.NEXT_PUBLIC_HERO_VIDEO_ID || 'djC_8Xwzh2o';

export default function Hero({ onContact, onScrollTo }) {
  return (
    <section id="top" className="hero">
      <div className="hero-reel">
        <iframe
          className="hero-bg-video"
          src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3`}
          title="Showreel"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          frameBorder="0"
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className="hero-tr">
        <span className="mono" style={{ fontSize: 10 }}>SHOWREEL · 2026</span>
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="line" />
          <span className="eyebrow">Est. 4 · Mumbai</span>
        </div>
        <h1 className="hero-headline">
          Shubham<br />
          Film <span className="it">Productions</span>
        </h1>
        <p className="hero-sub">Cinematic content for modern brands edited with patience, paced like a trailer.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" data-cursor="Reel" onClick={() => onScrollTo('work')}>
            <Play size={11} />
            <span>View Work</span>
          </button>
          <button className="btn btn-ghost" data-cursor="Write" onClick={onContact}>
            <span>Contact</span>
            <Arrow />
          </button>
        </div>
      </div>

      <button
        className="hero-scroll"
        data-cursor="Scroll"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="label">Scroll</span>
        <span className="line" />
      </button>
    </section>
  );
}
