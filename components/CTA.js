'use client';
import { Arrow } from './Icons';
import { CONTACT_EMAIL } from '@/lib/data';

export default function CTA({ onContact, onToast }) {
  const onCopy = () => {
    navigator.clipboard?.writeText(CONTACT_EMAIL).catch(() => {});
    onToast('Copied · ' + CONTACT_EMAIL);
    setTimeout(() => { window.location.href = 'mailto:' + CONTACT_EMAIL; }, 200);
  };

  return (
    <section id="contact" className="section cta">
      <div className="cta-eyebrow eyebrow">Let's make something</div>
      <h2 className="cta-headline">
        Cinematic<span className="period">.</span>
        <span className="it"> and on time.</span>
      </h2>
      <button className="cta-email" data-cursor="Copy" onClick={onCopy}>
        <span>{CONTACT_EMAIL}</span>
        <Arrow size={20} />
      </button>
      <button className="cta-secondary" data-cursor="Book" onClick={onContact}>
        <span>Or book a 15-min call</span>
        <Arrow size={12} />
      </button>
    </section>
  );
}
