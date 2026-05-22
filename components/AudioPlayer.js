'use client';
import { useEffect, useRef, useState } from 'react';
import { Speaker, Pause } from '@/components/Icons';

const AUDIO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AUDIO === 'true';
const AUDIO_SRC     = process.env.NEXT_PUBLIC_AUDIO_SRC   || '/piano-man.mp3';
const AUDIO_TITLE   = process.env.NEXT_PUBLIC_AUDIO_TITLE || 'Piano Man · Billy Joel';

export default function AudioPlayer({ paused = false }) {
  if (!AUDIO_ENABLED) return null;

  const audioRef = useRef(null);
  const [consent, setConsent] = useState(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [askVisible, setAskVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAskVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (consent !== 'yes') return;
    const a = audioRef.current;
    if (!a) return;
    if (paused) {
      a.pause();
      setPlaying(false);
      return;
    }
    a.volume = 0.12;
    a.play().then(() => setPlaying(true)).catch(() => {
      const retry = () => {
        a.play().then(() => setPlaying(true)).catch(() => {});
      };
      document.addEventListener('click', retry, { once: true });
      document.addEventListener('scroll', retry, { once: true, capture: true });
      document.addEventListener('keydown', retry, { once: true });
    });
  }, [consent, paused]);

  const accept = () => {
    setAskVisible(false);
    setConsent('yes');
  };

  const decline = () => {
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
            <p className="aa-sub">{AUDIO_TITLE} — low, cafe-style</p>
          </div>
          <div className="aa-actions">
            <button className="aa-btn aa-yes" onClick={accept}>Yes, play</button>
            <button className="aa-btn aa-no" onClick={decline}>No thanks</button>
          </div>
        </div>
      )}

      {consent === 'yes' && (
        <div className={`audio-player${playing ? ' ap-playing' : ''}${muted ? ' ap-muted' : ''}${paused ? ' ap-paused' : ''}`}>
          <button className="ap-btn" onClick={toggle} aria-label={muted ? 'Unmute' : 'Mute'}>
            {paused ? (
              <Pause size={18} />
            ) : muted ? (
              <Speaker muted size={18} />
            ) : (
              <span className="ap-bars">
                <span /><span /><span /><span />
              </span>
            )}
          </button>
          <span className="ap-label">{AUDIO_TITLE}</span>
          <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />
        </div>
      )}
    </>
  );
}
