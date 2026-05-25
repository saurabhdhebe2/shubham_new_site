'use client';
import { useEffect, useRef } from 'react';
import { Arrow, Play } from './Icons';
import Slate from './Slate';

export default function Hero({ onContact, onScrollTo }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let pending = false;
    const compute = () => {
      pending = false;
      const y = window.scrollY;
      const h = window.innerHeight;
      const p = Math.max(0, Math.min(1, y / h));
      el.style.setProperty('--dolly', p.toFixed(3));
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="top" className="hero" ref={sectionRef}>
      <div className="hero-reel">
        <video
          className="hero-bg-video"
          src="/herosection.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className="hero-tr">
        <span className="mono" style={{ fontSize: 10 }}>SHOWREEL · 2026</span>
      </div>

      <Slate />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="line" />
          <span className="eyebrow">Est. 2017 · Mumbai</span>
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
