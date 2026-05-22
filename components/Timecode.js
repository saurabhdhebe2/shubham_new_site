'use client';
import { useEffect, useState } from 'react';

const TOTAL_SECONDS = 4 * 60 + 30;
const FPS = 24;
const TOTAL_FRAMES = TOTAL_SECONDS * FPS;

const MARKERS = [
  { id: 'work',     label: '01 · Work' },
  { id: 'services', label: '02 · Services' },
  { id: 'process',  label: '03 · Process' },
  { id: 'about',    label: '04 · About' },
  { id: 'contact',  label: '05 · Contact' },
];

function format(frames) {
  const f = Math.max(0, Math.min(TOTAL_FRAMES, Math.floor(frames)));
  const totalSec = Math.floor(f / FPS);
  const ff = f % FPS;
  const ss = totalSec % 60;
  const mm = Math.floor(totalSec / 60) % 60;
  const hh = Math.floor(totalSec / 3600);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

const TOTAL_LABEL = format(TOTAL_FRAMES);

export default function Timecode() {
  const [tc, setTc] = useState('00:00:00:00');
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const recompute = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const found = [];
      for (const m of MARKERS) {
        const el = document.getElementById(m.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const p = docH > 0 ? Math.max(0, Math.min(1, top / docH)) : 0;
        found.push({ ...m, p });
      }
      setMarkers(found);
    };
    recompute();
    window.addEventListener('resize', recompute);
    const t = setTimeout(recompute, 800);
    return () => {
      window.removeEventListener('resize', recompute);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let pending = false;
    const compute = () => {
      pending = false;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.max(0, Math.min(1, window.scrollY / docH)) : 0;
      setProgress(p);
      setTc(format(p * TOTAL_FRAMES));
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 40;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className={'timecode' + (visible ? ' on' : '')} aria-hidden="true">
      <span className="tc-dot" />
      <span className="tc-now">{tc}</span>
      <span className="tc-sep">/</span>
      <span className="tc-total">{TOTAL_LABEL}</span>
      <span className="tc-rail">
        <span className="tc-rail-fill" style={{ transform: `scaleX(${progress})` }} />
        {markers.map((m) => {
          const passed = progress >= m.p - 0.01;
          return (
            <button
              key={m.id}
              type="button"
              className={'tc-marker' + (passed ? ' passed' : '')}
              style={{ left: `${m.p * 100}%` }}
              data-cursor="Jump"
              onClick={() => jumpTo(m.id)}
              aria-label={`Jump to ${m.label}`}
            >
              <span className="tc-marker-tip" />
              <span className="tc-marker-label">{m.label}</span>
            </button>
          );
        })}
      </span>
    </div>
  );
}
