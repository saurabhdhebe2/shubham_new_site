'use client';
import { useEffect, useRef, useState } from 'react';
import { END_CREDITS } from '@/lib/data';

export default function EndCredits() {
  const ref = useRef(null);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    try {
      if (sessionStorage.getItem('creditsRolled') === '1') {
        setRolled(true);
        return;
      }
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !rolled) {
          setRolled(true);
          if (!reduce) {
            try { sessionStorage.setItem('creditsRolled', '1'); } catch {}
          }
          io.disconnect();
        }
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rolled]);

  return (
    <div ref={ref} className={'end-credits' + (rolled ? ' rolling' : '')} aria-hidden="true">
      <div className="ec-rule" />
      <div className="ec-eyebrow mono">— End credits —</div>
      <ul className="ec-list">
        {END_CREDITS.map(([k, v], i) => (
          <li key={i} style={{ ['--i']: i }}>
            <span className="ec-k">{k}</span>
            <span className="ec-v">{v}</span>
          </li>
        ))}
      </ul>
      <div className="ec-fin">— Fin —</div>
    </div>
  );
}
