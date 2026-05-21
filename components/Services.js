'use client';
import { useState } from 'react';
import { Arrow, Plus } from './Icons';
import { SERVICES } from '@/lib/data';

export default function Services() {
  const [open, setOpen] = useState(null);

  return (
    <section id="services" className="section" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div>
          <div className="mono">§ 02 / Services</div>
          <h2 className="section-title">What I <span className="it">do.</span></h2>
        </div>
        <p style={{ maxWidth: 460, color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
          Editor, cinematographer, director - end-to-end production for brands that take their video seriously. One team, one accountability, work paced like a trailer.
        </p>
      </div>
      <div className="services-grid">
        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={s.n} className="service" data-cursor={isOpen ? 'Close' : 'Open'} onClick={() => setOpen(isOpen ? null : i)}>
              <div className="service-top">
                <span className="service-num">
                  <span className="dot" />{s.n} / 04
                </span>
                <button className={'service-toggle' + (isOpen ? ' open' : '')} aria-label="Expand">
                  <Plus />
                </button>
              </div>
              <div className="service-body">
                <h3 className="service-title">{s.t}</h3>
                <p className="service-desc">{s.d}</p>
                <div className={'service-expand' + (isOpen ? ' open' : '')}>
                  <ul>
                    {s.items.map(([k, v]) => (
                      <li key={k}><span>{k}</span><span className="price">{v}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <span className="service-learn">
                <span>Learn more</span><Arrow size={12} />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
