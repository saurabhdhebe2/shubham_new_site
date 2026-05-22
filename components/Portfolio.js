'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play, Arrow } from './Icons';
import StillPoster from './StillPoster';
import { YOUTUBE_CHANNEL, CATEGORIES } from '@/lib/data';

const CATS = CATEGORIES;

export default function Portfolio({ videos, onOpen }) {
  const [cat, setCat] = useState('All');

  const pickCat = (c) => {
    setCat(c);
    const el = document.getElementById('work');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filtered = cat === 'All' ? videos : videos.filter(v => {
    const vc = (v.cat || '').toLowerCase();
    const cc = cat.toLowerCase();
    return vc === cc || vc === cc.replace(' ', '') || vc === cc.replace(' videos', '');
  });

  return (
    <section id="work" className="section">
      <div className="section-head section-head-stacked">
        <div>
          <div className="mono">§ 01 / Selected Work</div>
          <h2 className="section-title">Latest <span className="it">work.</span></h2>
        </div>
      </div>

      <div className="filter-bar-sticky">
        <div className="filter-bar">
          {CATS.map(c => (
            <button
              key={c}
              className={'filter-tab' + (cat === c ? ' active' : '')}
              data-cursor="Filter"
              onClick={() => pickCat(c)}
            >
              {cat === c && <span className="pill" />}
              <span style={{ position: 'relative' }}>{c}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="portfolio">
        {filtered.map((p, i) => (
          <article
            key={p.id || p.youtubeId || i}
            className={'tile ' + (p.size || 'third')}
            data-cursor="Play"
            onClick={() => onOpen(p)}
          >
            {p.thumbnail ? (
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                className="tile-img"
                sizes="(max-width:600px) 100vw, (max-width:1100px) 50vw, 33vw"
              />
            ) : (
              <>
                <div className={'tile-img ' + (p.still || 'still-1')} />
                <StillPoster project={p} />
              </>
            )}
            <div className="tile-overlay" />
            <div className="tile-meta">
              <span className="tile-client">{p.client || p.cat}</span>
              {p.dur && <span className="tile-dur">{p.dur}</span>}
            </div>
            <div className="tile-play"><Play size={20} /></div>
            <div className="tile-foot">
              <h3 className="tile-title">{p.title}</h3>
              <span className="tile-cat">{p.cat}</span>
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 80, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        <a className="btn btn-ghost" data-cursor="YouTube" href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
          <span>Watch full reel on YouTube</span>
          <Arrow />
        </a>
      </div>
    </section>
  );
}
