'use client';
import { useEffect, useState } from 'react';

function pad(n) { return String(n).padStart(2, '0'); }

function formatDate(d) {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export default function Slate() {
  const [date, setDate] = useState('');
  const [take, setTake] = useState(1);

  useEffect(() => {
    setDate(formatDate(new Date()));
    try {
      const raw = sessionStorage.getItem('slateTake');
      const next = (Number(raw) || 0) + 1;
      setTake(next);
      sessionStorage.setItem('slateTake', String(next));
    } catch {
      setTake(1);
    }
  }, []);

  const year = new Date().getFullYear().toString().slice(-2);
  const roll = `R-${year}${pad((new Date().getMonth() + 1))}`;

  return (
    <div className="slate" aria-hidden="true">
      <div className="slate-stripes">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="slate-grid">
        <div className="slate-cell">
          <span className="k">Prod</span>
          <span className="v">SHUBHAM FP</span>
        </div>
        <div className="slate-cell">
          <span className="k">Roll</span>
          <span className="v">{roll}</span>
        </div>
        <div className="slate-cell">
          <span className="k">Take</span>
          <span className="v">{pad(take)}</span>
        </div>
        <div className="slate-cell">
          <span className="k">Date</span>
          <span className="v">{date || '—'}</span>
        </div>
      </div>
    </div>
  );
}
