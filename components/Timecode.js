'use client';
import { useEffect, useState } from 'react';

const TOTAL_SECONDS = 4 * 60 + 30;
const FPS = 24;
const TOTAL_FRAMES = TOTAL_SECONDS * FPS;

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

  useEffect(() => {
    let raf = 0;
    let pending = false;
    const compute = () => {
      pending = false;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docH > 0 ? Math.max(0, Math.min(1, window.scrollY / docH)) : 0;
      setTc(format(progress * TOTAL_FRAMES));
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

  return (
    <div className={'timecode' + (visible ? ' on' : '')} aria-hidden="true">
      <span className="tc-dot" />
      <span className="tc-now">{tc}</span>
      <span className="tc-sep">/</span>
      <span className="tc-total">{TOTAL_LABEL}</span>
    </div>
  );
}
