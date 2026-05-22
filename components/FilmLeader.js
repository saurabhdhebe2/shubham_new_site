'use client';
import { useEffect, useState } from 'react';

const TICK_MS = 700;
const FADE_MS = 220;

export default function FilmLeader() {
  const [active, setActive] = useState(false);
  const [num, setNum] = useState(3);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let shown = false;
    try { shown = sessionStorage.getItem('leaderShown') === '1'; } catch {}
    if (shown || reduce) {
      try { sessionStorage.setItem('leaderShown', '1'); } catch {}
      return;
    }
    setActive(true);
    document.documentElement.style.overflow = 'hidden';

    const timers = [];
    timers.push(setTimeout(() => setNum(2), TICK_MS));
    timers.push(setTimeout(() => setNum(1), TICK_MS * 2));
    timers.push(setTimeout(() => setFading(true), TICK_MS * 3));
    timers.push(setTimeout(() => {
      setActive(false);
      document.documentElement.style.overflow = '';
      try { sessionStorage.setItem('leaderShown', '1'); } catch {}
    }, TICK_MS * 3 + FADE_MS));

    const skip = (e) => {
      if (e.key === 'Escape') {
        timers.forEach(clearTimeout);
        setActive(false);
        document.documentElement.style.overflow = '';
        try { sessionStorage.setItem('leaderShown', '1'); } catch {}
      }
    };
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!active) return null;

  return (
    <div className={'film-leader' + (fading ? ' out' : '')} aria-hidden="true">
      <div className="leader-stage">
        <svg className="leader-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" className="leader-ring-bg" />
          <circle cx="50" cy="50" r="46" className="leader-ring-sweep" key={num} />
          <line x1="50" y1="2" x2="50" y2="98" className="leader-cross" />
          <line x1="2" y1="50" x2="98" y2="50" className="leader-cross" />
        </svg>
        <div className="leader-num" key={num}>{num}</div>
      </div>
      <div className="leader-meta">
        <span>SMPTE LEADER</span>
        <span>24 FPS · ACADEMY</span>
      </div>
      <button className="leader-skip" onClick={() => {
        setActive(false);
        document.documentElement.style.overflow = '';
        try { sessionStorage.setItem('leaderShown', '1'); } catch {}
      }}>SKIP ▸</button>
    </div>
  );
}
