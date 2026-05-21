import { PROCESS_STEPS } from '@/lib/data';

export default function Process() {
  return (
    <section id="process" className="section process" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div>
          <div className="mono">§ 03 / Process</div>
          <h2 className="section-title">Four steps. <span className="it">No surprises.</span></h2>
        </div>
        <p style={{ maxWidth: 420, color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
          A typical project runs 9-10 days from kickoff to delivery. The longest part is sitting with the edit, the rest is craft.
        </p>
      </div>
      <div className="process-grid">
        {PROCESS_STEPS.map((s, i) => (
          <div key={s.n} className="step">
            <span className="step-num">
              {s.n}<span className="seq">Step {i + 1}</span>
            </span>
            <span className="step-time">{s.time}</span>
            <span className="step-label">{s.label}</span>
            <span className="step-desc">{s.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
