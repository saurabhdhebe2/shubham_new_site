'use client';

export const Arrow = ({ size = 16 }) => (
  <svg className="arrow" width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
  </svg>
);

export const Play = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 2L13 8L4 14V2Z" fill="currentColor" />
  </svg>
);

export const Pause = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <rect x="2" y="1" width="3" height="12" fill="currentColor" />
    <rect x="9" y="1" width="3" height="12" fill="currentColor" />
  </svg>
);

export const Cross = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
  </svg>
);

export const Plus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
  </svg>
);

export const Speaker = ({ muted, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 6V10H4L7 13V3L4 6H2Z" fill="currentColor" />
    {!muted && <path d="M10 5C11 6 11 10 10 11M12 3C14 5 14 11 12 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />}
    {muted && <path d="M10 6L14 10M14 6L10 10" stroke="currentColor" strokeWidth="1.2" />}
  </svg>
);

export const MenuLines = ({ open }) => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <path d="M0 2 L18 2" stroke="currentColor" strokeWidth="1.2"
      style={{ transition: 'transform .4s', transform: open ? 'translate(2px, 5px) rotate(45deg)' : 'none', transformOrigin: 'center' }} />
    <path d="M0 7 L18 7" stroke="currentColor" strokeWidth="1.2"
      style={{ opacity: open ? 0 : 1, transition: 'opacity .2s' }} />
    <path d="M0 12 L18 12" stroke="currentColor" strokeWidth="1.2"
      style={{ transition: 'transform .4s', transform: open ? 'translate(2px, -5px) rotate(-45deg)' : 'none', transformOrigin: 'center' }} />
  </svg>
);
