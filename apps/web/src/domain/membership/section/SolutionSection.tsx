import { SOLUTION, type SolutionSatellite } from '../data/solution';

function SolutionSatelliteNode({ label, hint }: SolutionSatellite) {
  return (
    <div className="hub-sat">
      <span className="hub-sat-label">{label}</span>
      <span className="hub-sat-hint">{hint}</span>
    </div>
  );
}

export default function SolutionSection() {
  return (
    <section className="solution">
      <div className="wrap">
        <div className="sec-head rv in">
          <span className="eyebrow">{SOLUTION.badge}</span>
          <h2>
            {SOLUTION.titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < SOLUTION.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* 허브 앤 스포크 — 위성 6종이 중앙 멤버십으로 수렴 */}
        <div className="hub rv">
          {SOLUTION.satellites.map((sat) => (
            <SolutionSatelliteNode key={sat.label} {...sat} />
          ))}
          <div className="hub-core">
            <div className="hub-core-title">{SOLUTION.hubTitle}</div>
            <div className="hub-core-sub">{SOLUTION.hubSub}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
