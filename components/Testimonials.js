'use client';
import { useState, useEffect } from 'react';
import { Arrow } from './Icons';
import { TESTIMONIALS } from '@/lib/data';

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx(x => (x + 1) % TESTIMONIALS.length), 8000);
    return () => clearInterval(id);
  }, [paused]);

  const t = TESTIMONIALS[idx];

  return (
    <section id="about" className="section" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-section) 0', position: 'relative' }}>
        <div className="testimonial">
          <div className="mono" style={{ marginBottom: 24 }}>§ 04 / Said about the work</div>
          <p className="testimonial-quote" key={idx}>{t.quote}</p>
          <div className="testimonial-foot">
            <div className="testimonial-author">
              <span className="name">{t.name}</span>
              <span className="role">{t.role}</span>
            </div>
            <div className="testimonial-nav">
              <button
                className="tnav-btn"
                data-cursor="Prev"
                onClick={() => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                aria-label="Previous"
              >
                <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
                  <Arrow size={14} />
                </span>
              </button>
              <span className="tnav-count">0{idx + 1} / 0{TESTIMONIALS.length}</span>
              <button
                className="tnav-btn"
                data-cursor="Next"
                onClick={() => setIdx(i => (i + 1) % TESTIMONIALS.length)}
                aria-label="Next"
              >
                <Arrow size={14} />
              </button>
            </div>
          </div>
          <a
            className="testimonial-more"
            href="https://www.google.com/search?sca_esv=f08850460d6ebeaa&cs=1&output=search&kgmid=/g/11ldx5xdyq&q=Shubham+Film+Productions&shem=rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/1&kgs=67993b66ce6867ec&utm_source=rimspwouoe,sh/x/loc/uni/m1/1"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Open"
          >
            <span>Read all reviews on Google</span>
            <Arrow size={12} />
          </a>
        </div>
        {!paused && (
          <div className="testimonial-bar">
            <div className="fill" key={idx} />
          </div>
        )}
      </div>
    </section>
  );
}
