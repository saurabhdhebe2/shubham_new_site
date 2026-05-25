'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from '@/components/Icons';

const AUDIO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AUDIO === 'true';
const AUDIO_SRC     = process.env.NEXT_PUBLIC_AUDIO_SRC   || '/piano-man.mp3';
const AUDIO_TITLE   = process.env.NEXT_PUBLIC_AUDIO_TITLE || 'Piano Man · Billy Joel';

export default function AudioPlayer({ paused = false }) {
  if (!AUDIO_ENABLED) return null;

  const audioRef = useRef(null);
  const [consent, setConsent] = useState(null);
  const [userPaused, setUserPaused] = useState(false);
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
    if (paused || userPaused) {
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
  }, [consent, paused, userPaused]);

  const accept = () => {
    setAskVisible(false);
    setConsent('yes');
  };

  const decline = () => {
    setAskVisible(false);
    setConsent('no');
  };

  const toggle = () => setUserPaused(p => !p);

  const showPlayIcon = userPaused || paused;
  const hint = showPlayIcon ? 'Click to play' : 'Click to pause';

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
        <div className={`audio-player${playing ? ' ap-playing' : ''}${showPlayIcon ? ' ap-paused' : ''}${paused ? ' ap-hidden' : ''}`}>
          <span className="ap-label">
            <span className="ap-hint">{hint}</span>
            <span className="ap-title">{AUDIO_TITLE}</span>
          </span>
          <button className="ap-btn" onClick={toggle} aria-label={showPlayIcon ? 'Play music' : 'Pause music'} title={hint}>
            {showPlayIcon ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />
        </div>
      )}
    </>
  );
}
