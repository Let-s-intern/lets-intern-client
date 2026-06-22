import { SOLUTION } from "../data/solution";

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
        <div className="flow rv">
          <div className="messy">
            {SOLUTION.chips.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
          <span className="arrow">→</span>
          <div className="pass">
            <div className="big">{SOLUTION.passBig}</div>
            <div className="sm">{SOLUTION.passSm}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
