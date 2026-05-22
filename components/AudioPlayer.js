'use client';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'audio-consent';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [consent, setConsent] = useState(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [askVisible, setAskVisible] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'yes') {
      setConsent('yes');
    } else if (saved === 'no') {
      setConsent('no');
    } else {
      const t = setTimeout(() => setAskVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (consent !== 'yes') return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.22;
    audio.play().then(() => setPlaying(true)).catch(() => {
      const retry = () => {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      };
      document.addEventListener('click', retry, { once: true });
      document.addEventListener('scroll', retry, { once: true, capture: true });
      document.addEventListener('keydown', retry, { once: true });
    });
  }, [consent]);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'yes');
    setAskVisible(false);
    setConsent('yes');
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'no');
    setAskVisible(false);
    setConsent('no');
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) { a.muted = false; setMuted(false); }
    else       { a.muted = true;  setMuted(true);  }
  };

  return (
    <>
      {askVisible && (
        <div className="audio-ask" role="dialog" aria-label="Music experience">
          <div className="aa-icon">
            <span className="ap-bars">
              <span /><span /><span /><span />
            </span>
          </div>
          <div className="aa-body">
            <p className="aa-title">Music experience while you surf?</p>
            <p className="aa-sub">Piano Man · Billy Joel — low, cafe-style</p>
          </div>
          <div className="aa-actions">
            <button className="aa-btn aa-yes" onClick={accept}>Yes, play</button>
            <button className="aa-btn aa-no" onClick={decline}>No thanks</button>
          </div>
        </div>
      )}

      {consent === 'yes' && (
        <div className={`audio-player${playing ? ' ap-playing' : ''}${muted ? ' ap-muted' : ''}`}>
          <button className="ap-btn" onClick={toggle} aria-label={muted ? 'Unmute' : 'Mute'}>
            <span className="ap-bars">
              <span /><span /><span /><span />
            </span>
          </button>
          <span className="ap-label">Piano Man · Billy Joel</span>
          <audio ref={audioRef} src="/piano-man.mp3" loop preload="auto" />
        </div>
      )}
    </>
  );
}
