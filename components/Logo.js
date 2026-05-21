'use client';

const PRESETS = {
  sm: { display: 22, mono: 7,  gap: 2, tracking: '.32em', line: 8 },
  md: { display: 30, mono: 8,  gap: 3, tracking: '.30em', line: 12 },
  lg: { display: 56, mono: 12, gap: 6, tracking: '.26em', line: 16 },
  xl: { display: 88, mono: 16, gap: 8, tracking: '.24em', line: 20 },
};

export default function Logo({ size = 'md' }) {
  const p = PRESETS[size] || PRESETS.md;
  return (
    <span
      aria-label="Shubham Film Productions"
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, color: 'inherit' }}
    >
      <span style={{
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400,
        fontSize: p.display, lineHeight: .9, letterSpacing: '-.035em',
        display: 'inline-flex', alignItems: 'baseline',
      }}>
        <span>Shubham</span>
        <span style={{ color: 'var(--accent-hot)', fontStyle: 'normal', marginLeft: '0.02em' }}>.</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: p.gap, width: '100%' }}>
        <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: .35, minWidth: p.line }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: p.mono,
          letterSpacing: p.tracking, textTransform: 'uppercase', color: 'currentColor',
          opacity: .78, whiteSpace: 'nowrap',
        }}>
          Film Productions
        </span>
      </span>
    </span>
  );
}
