'use client';
import { useState, useEffect } from 'react';
import { Arrow, Cross } from './Icons';
import { CONTACT_EMAIL } from '@/lib/data';

const TYPES = ['Reel', 'Documentary', 'Music Film', 'Podcast', 'Commercial', 'Other'];
const BUDGETS = ['$1-5k', '$5-10k', '$10-25k', '$25-50k', '$50k+', 'Discuss'];

export default function Drawer({ open, onClose }) {
  const [type, setType] = useState('Commercial');
  const [budget, setBudget] = useState('$5-10k');
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', company: '', note: '' });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const send = (e) => {
    e.preventDefault();
    setStatus('loading');
    const subject = encodeURIComponent(`New ${type} inquiry ${form.name || 'Unnamed'}`);
    const bodyLines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company ? `Company: ${form.company}` : '',
      `Project type: ${type}`,
      `Budget: ${budget}`,
      '',
      '─'.repeat(40),
      form.note || '(no notes)',
      '─'.repeat(40),
      '',
      'Sent from shubhamfilmproductions.com',
    ].filter(Boolean).join('\n');
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyLines)}`;

    setTimeout(() => {
      const a = document.createElement('a');
      a.href = mailto;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setForm({ name: '', email: '', company: '', note: '' });
      }, 5000);
    }, 700);
  };

  return (
    <>
      <div className={'drawer-backdrop' + (open ? ' open' : '')} onClick={onClose} />
      <aside className={'drawer' + (open ? ' open' : '')}>
        <div className="drawer-head">
          <span className="mono">Start a Project</span>
          <button className="drawer-close" data-cursor="Close" onClick={onClose} aria-label="Close">
            <Cross />
          </button>
        </div>
        <form className="drawer-body" onSubmit={send}>
          <div>
            <h3 className="drawer-title">Tell me <em style={{ color: 'var(--fg-muted)' }}>about it.</em></h3>
            <p className="drawer-sub">Three lines is plenty. I read every message myself and reply within 24 hours.</p>
          </div>

          <div className="field">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder=" " required />
            <label>Your name</label>
          </div>
          <div className="field">
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder=" " required />
            <label>Email</label>
          </div>
          <div className="field">
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder=" " />
            <label>Company (optional)</label>
          </div>

          <div>
            <span className="chip-label">Project type</span>
            <div className="chips">
              {TYPES.map(t => (
                <button type="button" key={t} className={'chip' + (type === t ? ' active' : '')} data-cursor="Pick" onClick={() => setType(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="chip-label">Budget</span>
            <div className="chips">
              {BUDGETS.map(b => (
                <button type="button" key={b} className={'chip' + (budget === b ? ' active' : '')} data-cursor="Pick" onClick={() => setBudget(b)}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <textarea rows={4} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder=" " />
            <label>Tell me more</label>
          </div>

          <button type="submit" className={'send-btn ' + status} data-cursor="Send" disabled={status !== 'idle'}>
            {status === 'idle' && <><span>Send</span><Arrow /></>}
            {status === 'loading' && <><span className="send-spinner" /><span>Sending</span></>}
            {status === 'success' && <span>✓ Mail client opened hit send to fire it off</span>}
          </button>

          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', letterSpacing: '.2em', textTransform: 'uppercase' }}>
              Or email directly ·{' '}
              <a href={'mailto:' + CONTACT_EMAIL} style={{ color: 'var(--accent)' }}>{CONTACT_EMAIL}</a>
            </span>
          </div>
        </form>
      </aside>
    </>
  );
}
