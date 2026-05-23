'use client';
import { useState, useEffect } from 'react';
import { Arrow, Cross } from './Icons';
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/data';

const TYPES = ['Reel', 'Documentary', 'Music Film', 'Podcast', 'Commercial', 'Other'];
const BUDGETS = ['<$1k', '$1-3k', '$3-10k', '$10-25k', '$25-50k', '$50k+', 'Discuss'];

export default function Drawer({ open, onClose }) {
  const [type, setType] = useState('Commercial');
  const [budget, setBudget] = useState('$3-10k');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', note: '', website: '' });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setErrMsg('');
    }
  }, [open]);

  const close = () => {
    onClose();
    setTimeout(() => {
      setForm({ name: '', email: '', company: '', phone: '', note: '', website: '' });
      setStatus('idle');
      setErrMsg('');
    }, 400);
  };

  const send = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type, budget }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrMsg(data.error || 'Could not send. Try emailing directly.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrMsg('Network error. Try emailing directly.');
      setStatus('error');
    }
  };

  return (
    <>
      <div className={'drawer-backdrop' + (open ? ' open' : '')} onClick={close} />
      <aside className={'drawer' + (open ? ' open' : '')} aria-hidden={!open}>
        <div className="drawer-head">
          <span className="mono">Start a Project</span>
          <button className="drawer-close" data-cursor="Close" onClick={close} aria-label="Close">
            <Cross />
          </button>
        </div>

        {status === 'success' ? (
          <div className="drawer-body drawer-success">
            <div className="success-check">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="27" stroke="var(--accent-hot)" strokeWidth="1.5" />
                <path d="M16 28L24 36L40 20" stroke="var(--accent-hot)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="drawer-title">Message sent.</h3>
            <p className="drawer-sub">
              Thanks for reaching out. I read every message myself and reply within 24 hours.
            </p>
            <button type="button" className="btn btn-ghost" data-cursor="Close" onClick={close} style={{ width: '100%' }}>
              <span>Close</span><Arrow />
            </button>
            <div className="drawer-foot">
              <a href={'mailto:' + CONTACT_EMAIL} data-cursor="Mail">{CONTACT_EMAIL}</a>
              <span style={{ opacity: .4 }}>·</span>
              <a href={'tel:' + CONTACT_PHONE.replace(/\s+/g, '')} data-cursor="Call">{CONTACT_PHONE}</a>
            </div>
          </div>
        ) : (
          <form className="drawer-body" onSubmit={send} noValidate>
            <div>
              <h3 className="drawer-title">Tell me <em style={{ color: 'var(--fg-muted)' }}>about it.</em></h3>
              <p className="drawer-sub">A few lines is plenty. I reply within 24 hours.</p>
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
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder=" " />
              <label>Phone (optional)</label>
            </div>
            <div className="field">
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder=" " />
              <label>Company / Brand (optional)</label>
            </div>

            <div className="chip-group">
              <span className="chip-label">Project type</span>
              <div className="chips">
                {TYPES.map(t => (
                  <button type="button" key={t} className={'chip' + (type === t ? ' active' : '')} data-cursor="Pick" onClick={() => setType(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="chip-group">
              <span className="chip-label">Budget (USD)</span>
              <div className="chips">
                {BUDGETS.map(b => (
                  <button type="button" key={b} className={'chip' + (budget === b ? ' active' : '')} data-cursor="Pick" onClick={() => setBudget(b)}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="field field-textarea">
              <textarea rows={5} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder=" " />
              <label>Tell me more</label>
            </div>

            {/* Honeypot — humans never see this field; bots fill it */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off"
              value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
              style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />

            {status === 'error' && (
              <div className="form-error" role="alert">{errMsg}</div>
            )}

            <button type="submit" className={'send-btn ' + status} data-cursor="Send" disabled={status === 'loading'}>
              {status === 'idle'    && <><span>Send inquiry</span><Arrow /></>}
              {status === 'loading' && <><span className="send-spinner" /><span>Sending</span></>}
              {status === 'error'   && <><span>Retry</span><Arrow /></>}
            </button>

            <div className="drawer-foot">
              <a href={'mailto:' + CONTACT_EMAIL} data-cursor="Mail">{CONTACT_EMAIL}</a>
              <span style={{ opacity: .4 }}>·</span>
              <a href={'tel:' + CONTACT_PHONE.replace(/\s+/g, '')} data-cursor="Call">{CONTACT_PHONE}</a>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}
