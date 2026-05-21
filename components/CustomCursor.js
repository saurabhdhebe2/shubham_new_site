'use client';
import { useRef, useState, useEffect } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [verb, setVerb] = useState('');
  const [on, setOn] = useState(false);

  useEffect(() => {
    let raf;
    const pos = { x: -100, y: -100 };
    const dot = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };

    const onMove = (e) => { pos.x = e.clientX; pos.y = e.clientY; };
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) { setOn(true); setVerb(t.getAttribute('data-cursor')); }
      else { setOn(false); setVerb(''); }
    };

    const tick = () => {
      dot.x += (pos.x - dot.x) * 0.6;
      dot.y += (pos.y - dot.y) * 0.6;
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%,-50%) scale(${on ? 1 : 0})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [on]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: on ? 0 : 1 }} />
      <div ref={ringRef} className="cursor-ring">{verb}</div>
    </>
  );
}
