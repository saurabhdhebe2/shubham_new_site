'use client';
import { useEffect, useRef, useState } from 'react';
import { Arrow, Cross, Play, Pause, Speaker } from './Icons';
import StillPoster from './StillPoster';

function extractYoutubeId(p) {
  if (!p) return null;
  if (p.youtubeId) return p.youtubeId;
  if (typeof p.thumbnail === 'string') {
    const m = p.thumbnail.match(/\/vi\/([A-Za-z0-9_-]{6,})\//);
    if (m) return m[1];
  }
  return null;
}

export default function Lightbox({ project, videos, origin, onClose, onNav, onJump }) {
  const [loading, setLoading] = useState(true);
  const [iris, setIris] = useState(false);
  const stripRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose, onNav]);

  useEffect(() => {
    if (project?.youtubeId) setLoading(true);
  }, [project?.id, project?.youtubeId]);

  // Iris open animation: only on first mount per open
  useEffect(() => {
    if (!project) {
      setIris(false);
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setIris(true)));
  }, [project?.id]);

  // Keep current strip frame in view when project changes
  useEffect(() => {
    if (!project || !stripRef.current) return;
    const el = stripRef.current.querySelector('.strip-frame.on');
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [project?.id]);

  if (!project) return null;

  const idx = videos.findIndex(v => (v.id || v.youtubeId) === (project.id || project.youtubeId));
  const next = videos[(idx + 1) % videos.length];

  const irisStyle = origin
    ? { '--iris-x': `${origin.x}px`, '--iris-y': `${origin.y}px` }
    : { '--iris-x': '50vw', '--iris-y': '50vh' };

  return (
    <div
      className={'lightbox open' + (iris ? ' iris-open' : '')}
      style={irisStyle}
      onClick={(e) => { if (e.target.classList.contains('lightbox')) onClose(); }}
    >
      <button className="lightbox-close" data-cursor="Close" onClick={onClose} aria-label="Close">
        <Cross />
      </button>
      <div className="lightbox-frame">
        <div className={'lightbox-player ' + (project.still || 'still-1')}>
          {project.youtubeId ? (
            <iframe
              key={project.youtubeId}
              src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={project.title}
              onLoad={() => setLoading(false)}
            />
          ) : (
            <>
              <div className="reel-anim" />
              <StillPoster project={project} />
              <div className="play-mark"><Play size={28} /></div>
              <div className="lightbox-controls">
                <button className="ctrl-btn" data-cursor="Pause"><Pause /></button>
                <span className="timecode">00:00 / {project.dur || '00:00'}</span>
                <div className="scrubber">
                  <div className="progress" />
                  <div className="knob" />
                </div>
                <button className="ctrl-btn" data-cursor="Mute"><Speaker muted={false} /></button>
              </div>
            </>
          )}
          {project.youtubeId && (
            <div className={`lb-loading${loading ? '' : ' hidden'}`}>
              <span className="ap-bars"><span /><span /><span /><span /></span>
              <span className="lb-loading-label">Loading</span>
            </div>
          )}
          <div className="lightbox-arrows">
            <button className="lightbox-arrow prev" data-cursor="Prev" onClick={() => onNav(-1)} aria-label="Previous">
              <span className="lb-arrow-icon prev-icon"><Arrow /></span>
              <span className="lb-arrow-label">Prev</span>
            </button>
            <button className="lightbox-arrow next" data-cursor="Next" onClick={() => onNav(1)} aria-label="Next">
              <span className="lb-arrow-label">Next</span>
              <span className="lb-arrow-icon"><Arrow /></span>
            </button>
          </div>
          <div className="lb-letterbox lb-letterbox-top" aria-hidden="true" />
          <div className="lb-letterbox lb-letterbox-bot" aria-hidden="true" />
        </div>

        <div className="lightbox-meta">
          <span className="client">{project.client || project.cat}</span>
          <h3>{project.title}</h3>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            {project.cat} · Delivered {project.year}.
            {project.deliverables && ` ${project.deliverables.toLowerCase()}.`}
          </p>
          <div style={{ marginTop: 8 }}>
            {project.client && <div className="row"><span className="k">Client</span><span className="v">{project.client}</span></div>}
            <div className="row"><span className="k">Year</span><span className="v">{project.year}</span></div>
            {project.role && <div className="row"><span className="k">Role</span><span className="v">{project.role}</span></div>}
            <div className="row"><span className="k">Category</span><span className="v">{project.cat}</span></div>
            {project.dur && <div className="row"><span className="k">Duration</span><span className="v">{project.dur}</span></div>}
            {project.deliverables && <div className="row"><span className="k">Deliverables</span><span className="v">{project.deliverables}</span></div>}
          </div>
          {project.youtubeId && (
            <a
              className="btn btn-ghost lb-youtube-btn"
              data-cursor="Open"
              href={`https://www.youtube.com/watch?v=${project.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on YouTube</span>
              <Arrow />
            </a>
          )}
        </div>

        {next && (
          <div
            className="lightbox-next"
            data-cursor="Play"
            onClick={() => onNav(1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNav(1); }}
          >
            {next.thumbnail ? (
              <span
                className="lightbox-next-thumb"
                style={{ backgroundImage: `url(${next.thumbnail})` }}
                aria-hidden="true"
              />
            ) : (
              <span className={'lightbox-next-thumb ' + (next.still || 'still-1')} aria-hidden="true" />
            )}
            <span className="lightbox-next-text">
              <span className="label">Up next</span>
              <span className="name">
                {next.client ? `${next.client} · ` : ''}{next.title} →
              </span>
            </span>
          </div>
        )}

        <div className="lightbox-strip" ref={stripRef} aria-label="Filmstrip navigator">
          <span className="strip-label">REEL · {String(idx + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
          <div className="strip-track">
            {videos.map((v, i) => {
              const id = extractYoutubeId(v);
              const thumb = v.thumbnail || (id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null);
              const active = i === idx;
              return (
                <button
                  key={v.id || v.youtubeId || i}
                  className={'strip-frame' + (active ? ' on' : '')}
                  data-cursor={active ? 'Now' : 'Jump'}
                  onClick={() => !active && onJump(v)}
                  aria-label={`${v.title} (${i + 1} of ${videos.length})`}
                >
                  {thumb ? (
                    <span className="strip-thumb" style={{ backgroundImage: `url(${thumb})` }} />
                  ) : (
                    <span className={'strip-thumb ' + (v.still || 'still-1')} />
                  )}
                  <span className="strip-num">{String(i + 1).padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lightbox-arrows-mobile">
          <button className="lightbox-arrow prev" data-cursor="Prev" onClick={() => onNav(-1)} aria-label="Previous">
            <span className="lb-arrow-icon prev-icon"><Arrow /></span>
            <span className="lb-arrow-label">Prev</span>
          </button>
          <button className="lightbox-arrow next" data-cursor="Next" onClick={() => onNav(1)} aria-label="Next">
            <span className="lb-arrow-label">Next</span>
            <span className="lb-arrow-icon"><Arrow /></span>
          </button>
        </div>
      </div>
    </div>
  );
}
