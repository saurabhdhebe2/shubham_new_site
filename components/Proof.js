'use client';
import CountUp from './CountUp';
import { CLIENTS } from '@/lib/data';

const STATS = [
  { num: 8, suf: '', label: 'USA Brands', flag: 'USA' },
  { num: 4, suf: '', label: 'UK Brands', flag: 'UK' },
  { num: 1.5, suf: 'B+', label: 'Views Delivered', flag: 'REACH' },
  { num: 2, suf: 'K+', label: 'Videos Shipped', flag: 'OUTPUT' },
];

export default function Proof() {
  const doubled = [...CLIENTS, ...CLIENTS];
  return (
    <>
      <div className="proof">
        <div className="proof-row">
          {STATS.map((c, i) => (
            <div key={i} className="proof-col">
              <span className="proof-flag">{c.flag}</span>
              <div className="proof-num">
                <CountUp value={c.num} suffix={c.suf} />
              </div>
              <div className="proof-label">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {doubled.map((c, i) => (
            <span key={i} className="client-logo">
              <span className="dot" />{c}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
