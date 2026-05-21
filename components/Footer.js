'use client';
import { useState } from 'react';
import Logo from './Logo';
import MumbaiClock from './MumbaiClock';
import { CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS } from '@/lib/data';

const SITEMAP = ['work', 'services', 'process', 'about', 'contact'];
const ELSEWHERE = [
  ['Instagram', SOCIAL_LINKS.instagram],
  ['YouTube', SOCIAL_LINKS.youtube],
  ['Vimeo', SOCIAL_LINKS.vimeo],
  ['LinkedIn', SOCIAL_LINKS.linkedin],
  ['IMDb', SOCIAL_LINKS.imdb],
];

export default function Footer({ onContact }) {
  const [showStatus, setShowStatus] = useState(false);
  const telHref = 'tel:' + CONTACT_PHONE.replace(/\s+/g, '');

  return (
    <footer id="journal" className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <button
            className="mark"
            onMouseEnter={() => setShowStatus(true)}
            onMouseLeave={() => setShowStatus(false)}
            data-cursor="Top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo size="xl" />
          </button>
          <div className="tag">
            {showStatus
              ? <span><MumbaiClock /> · Now editing for <span style={{ color: 'var(--accent)' }}>Mumbai Indians</span></span>
              : 'Independent post-production studio. Available for select brand work.'}
          </div>
        </div>
        <div className="footer-col">
          <h4>Sitemap</h4>
          <ul>
            {SITEMAP.map(id => (
              <li key={id}>
                <a href={'#' + id} data-cursor="Go" style={{ textTransform: 'capitalize' }}>{id}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Elsewhere</h4>
          <ul>
            {ELSEWHERE.map(([label, url]) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Get in touch</h4>
          <ul>
            <li>
              <a href="#" data-cursor="Write" onClick={(e) => { e.preventDefault(); onContact(); }}>
                Start a project →
              </a>
            </li>
            <li><a href={'mailto:' + CONTACT_EMAIL} data-cursor="Mail">{CONTACT_EMAIL}</a></li>
            <li><a href={telHref} data-cursor="Call">{CONTACT_PHONE}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bar">
        <span>© 2026 Shubham Film Productions · Mumbai · All rights reserved</span>
        <span className="footer-status">
          <span className="dot" />Currently open for August bookings
        </span>
      </div>
    </footer>
  );
}
