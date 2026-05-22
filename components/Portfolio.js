'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Arrow } from './Icons';
import StillPoster from './StillPoster';
import { YOUTUBE_CHANNEL, CATEGORIES, COMMENTARY } from '@/lib/data';

const CATS = CATEGORIES;

function extractYoutubeId(p) {
  if (p.youtubeId) return p.youtubeId;
  if (typeof p.thumbnail === 'string') {
    const m = p.thumbnail.match(/\/vi\/([A-Za-z0-9_-]{6,})\//);
    if (m) return m[1];
  }
  return null;
}

function TileMedia({ project }) {
  const id = extractYoutubeId(project);
  const ref = useRef(null);
  const [frame, setFrame] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const noteTimerRef = useRef(null);
  const note = project.note || COMMENTARY[project.id];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const onMove = (e) => {
    if (!id || reduceMotion) return;
    if (!loaded) setLoaded(true);
    if (!scrubbing) {
      setScrubbing(true);
      if (note) {
        clearTimeout(noteTimerRef.current);
        noteTimerRef.current = setTimeout(() => setShowNote(true), 800);
      }
    }
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.max(0, Math.min(3, Math.floor((x / rect.width) * 4)));
    setFrame(idx);
  };

  const onLeave = () => {
    setScrubbing(false);
    setFrame(0);
    setShowNote(false);
    clearTimeout(noteTimerRef.current);
  };

  const onTouch = () => {
    if (!id || reduceMotion) return;
    if (!loaded) setLoaded(true);
    setScrubbing(true);
    setFrame((f) => (f + 1) % 4);
  };

  return (
    <div
      ref={ref}
      className="tile-media"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={onTouch}
    >
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="tile-img"
          sizes="(max-width:600px) 100vw, (max-width:1100px) 50vw, 33vw"
        />
      ) : (
        <>
          <div className={'tile-img ' + (project.still || 'still-1')} />
          <StillPoster project={project} />
        </>
      )}

      {id && loaded && [1, 2, 3].map((n) => (
        <img
          key={n}
          src={`https://i.ytimg.com/vi/${id}/${n}.jpg`}
          alt=""
          aria-hidden="true"
          className={'tile-frame' + (frame === n ? ' on' : '')}
          loading="lazy"
          decoding="async"
        />
      ))}

      {id && !reduceMotion && (
        <div className={'tile-scrub' + (scrubbing ? ' on' : '')} aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className={'seg' + (frame === n ? ' active' : '')} />
          ))}
        </div>
      )}

      {note && (
        <div className={'tile-commentary' + (showNote ? ' on' : '')} aria-hidden="true">
          <span className="tc-eyebrow">— Director</span>
          <span className="tc-text">{note}</span>
        </div>
      )}
    </div>
  );
}

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
            onClick={(e) => onOpen(p, e)}
          >
            <TileMedia project={p} />
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
