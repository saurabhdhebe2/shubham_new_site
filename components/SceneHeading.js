'use client';
import { useEffect, useRef, useState } from 'react';

const SCENES = [
  { id: 'work',     verb: 'CUT TO',      label: 'SELECTED WORK' },
  { id: 'services', verb: 'DISSOLVE TO', label: 'SERVICES' },
  { id: 'process',  verb: 'MATCH CUT',   label: 'PROCESS' },
  { id: 'reviews',  verb: 'SMASH CUT',   label: 'WORDS ON THE WORK' },
  { id: 'contact',  verb: 'FADE IN',     label: 'BOOK A CALL' },
  { id: 'journal',  verb: 'FADE OUT',    label: 'END' },
];

export default function SceneHeading() {
  const [active, setActive] = useState(null);
  const timerRef = useRef(null);
  const seenRef = useRef(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observers = [];
    for (const scene of SCENES) {
      const el = document.getElementById(scene.id);
      if (!el) continue;
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.18) {
            if (seenRef.current.has(scene.id)) return;
            seenRef.current.add(scene.id);
            setActive(scene);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setActive(null), 1600);
          }
        }
      }, { threshold: [0, 0.18, 0.4] });
      io.observe(el);
      observers.push(io);
    }
    return () => {
      observers.forEach(o => o.disconnect());
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="scene-heading" aria-hidden="true">
      <span className="sh-verb">{active.verb}:</span>
      <span className="sh-label">{active.label}</span>
    </div>
  );
}
