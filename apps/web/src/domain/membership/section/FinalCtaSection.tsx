import Countdown from "../ui/Countdown";
import { openPlanSheet } from "../lib/planSheet";
import { MEMBERSHIP_DEADLINE } from "../data/membership";
import { FINAL_CTA } from "../data/finalCta";

export default function FinalCtaSection() {
  return (
    <section className="final">
      <div className="wrap">
        <span className="eyebrow">{FINAL_CTA.badge}</span>
        <h2 className="rv">
          {FINAL_CTA.titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < FINAL_CTA.titleLines.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p className="rv">{FINAL_CTA.desc}</p>
        <div className="cd rv">
          <Countdown deadline={MEMBERSHIP_DEADLINE} />
        </div>
        <button
          className="btn btn-primary btn-lg rv"
          onClick={() => openPlanSheet()}
        >
          {FINAL_CTA.cta}
        </button>
      </div>
    </section>
  );
}
