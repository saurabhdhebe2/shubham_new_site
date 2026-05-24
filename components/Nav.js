'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import MumbaiClock from './MumbaiClock';
import { Arrow, MenuLines } from './Icons';
import { NAV_LINKS } from '@/lib/data';

export default function Nav({ onContact, onScrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
        <button
          className="nav-logo"
          data-cursor="Top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'transparent', border: 'none', cursor: 'none', padding: 0 }}
        >
          <Image
            src="/logo.png"
            alt="Shubham Film Productions"
            width={750}
            height={750}
            preload
            className="nav-logo-img"
          />
        </button>
        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <button key={l.id} className="nav-link" data-cursor="View" onClick={() => onScrollTo(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <span className="nav-clock"><MumbaiClock /></span>
          <button className="btn btn-sm btn-primary nav-cta" data-cursor="Start" onClick={onContact}>
            <span>Start a Project</span>
            <Arrow />
          </button>
          <button className="mob-toggle" onClick={() => setMobOpen(o => !o)} aria-label="Menu">
            <MenuLines open={mobOpen} />
          </button>
        </div>
      </nav>

      <div className={'mob-overlay' + (mobOpen ? ' open' : '')}>
        {NAV_LINKS.map((l, i) => (
          <a key={l.id} href={'#' + l.id} onClick={(e) => { e.preventDefault(); setMobOpen(false); onScrollTo(l.id); }}>
            <span className="mob-num">0{i + 1}</span>
            {l.label}
          </a>
        ))}
        <div className="mob-foot">
          <button className="btn btn-primary" onClick={() => { setMobOpen(false); onContact(); }}>
            <span>Start a Project</span><Arrow />
          </button>
          <span className="mono" style={{ color: 'var(--fg-muted)' }}><MumbaiClock /></span>
        </div>
      </div>
    </>
  );
}
