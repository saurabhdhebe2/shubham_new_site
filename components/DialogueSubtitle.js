'use client';
import { useEffect, useRef, useState } from 'react';
import { DIALOGUES } from '@/lib/data';

const IDLE_MS = 6000;
const HOLD_MS = 5500;
const FADE_MS = 600;
const START_DELAY_MS = 3200;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DialogueSubtitle({ paused }) {
  const [current, setCurrent] = useState(null);
  const [visible, setVisible] = useState(false);
  const pausedRef = useRef(paused);
  const apiRef = useRef(null);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    let deck = shuffle(DIALOGUES);
    let cursor = 0;
    let idleTimer = null;
    let holdTimer = null;
    let clearTimer = null;
    let isVisible = false;

    const nextLine = () => {
      if (cursor >= deck.length) {
        const prevLast = deck[deck.length - 1];
        deck = shuffle(DIALOGUES);
        if (deck[0] === prevLast && deck.length > 1) {
          [deck[0], deck[1]] = [deck[1], deck[0]];
        }
        cursor = 0;
      }
      return deck[cursor++];
    };

    const scheduleIdle = () => {
      clearTimeout(idleTimer);
      if (pausedRef.current) return;
      idleTimer = setTimeout(() => {
        if (pausedRef.current) return;
        setCurrent(nextLine());
        isVisible = true;
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        clearTimeout(holdTimer);
        holdTimer = setTimeout(() => {
          isVisible = false;
          setVisible(false);
          clearTimeout(clearTimer);
          clearTimer = setTimeout(() => {
            setCurrent(null);
            scheduleIdle();
          }, FADE_MS);
        }, HOLD_MS);
      }, IDLE_MS);
    };

    const dismiss = () => {
      if (!isVisible) return;
      isVisible = false;
      clearTimeout(holdTimer);
      setVisible(false);
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => setCurrent(null), FADE_MS);
    };

    const onInteract = () => {
      if (pausedRef.current) return;
      dismiss();
      scheduleIdle();
    };

    apiRef.current = { scheduleIdle, dismiss };

    const startTimer = setTimeout(() => {
      if (!pausedRef.current) scheduleIdle();
    }, START_DELAY_MS);

    window.addEventListener('mousemove', onInteract, { passive: true });
    window.addEventListener('scroll', onInteract, { passive: true });
    window.addEventListener('keydown', onInteract);
    window.addEventListener('touchstart', onInteract, { passive: true });

    return () => {
      clearTimeout(startTimer);
      clearTimeout(idleTimer);
      clearTimeout(holdTimer);
      clearTimeout(clearTimer);
      window.removeEventListener('mousemove', onInteract);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!apiRef.current) return;
    if (paused) apiRef.current.dismiss();
    else apiRef.current.scheduleIdle();
  }, [paused]);

  if (!current) return null;
  return (
    <div className={'dialogue-sub' + (visible ? ' on' : '')} aria-hidden="true">
      <p>{current}</p>
    </div>
  );
}
