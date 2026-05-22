'use client';
import { useRef, useState, useEffect } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [verb, setVerb] = useState('');

  useEffect(() => {
    const onRef = { current: false };
    const ready = { current: false };
    const pos  = { x: 0, y: 0 };
    const dot  = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    const s    = { current: 0 };
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX; pos.y = e.clientY;
      if (!ready.current) {
        dot.x = ring.x = pos.x;
        dot.y = ring.y = pos.y;
        ready.current = true;
        dotRef.current?.classList.add('ready');
        ringRef.current?.classList.add('ready');
      }
    };

    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      const next = !!t;
      onRef.current = next;
      setVerb(t ? t.getAttribute('data-cursor') : '');
      if (dotRef.current) dotRef.current.style.opacity = next ? 0 : 1;
    };

    const tick = () => {
      dot.x  += (pos.x - dot.x)  * 0.6;
      dot.y  += (pos.y - dot.y)  * 0.6;
      ring.x += (pos.x - ring.x) * 0.28;
      ring.y += (pos.y - ring.y) * 0.28;
      const target = onRef.current ? 1 : 0;
      s.current += (target - s.current) * 0.2;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${dot.x}px, ${dot.y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%,-50%) scale(${s.current})`;
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
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">{verb}</div>
    </>
  );
}
