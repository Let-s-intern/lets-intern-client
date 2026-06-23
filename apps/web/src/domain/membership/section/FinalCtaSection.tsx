import Countdown from '../ui/Countdown';
import { openPlanSheet } from '../lib/planSheet';
import { ctaLabel, IS_MEMBERSHIP_LAUNCHED } from '../lib/membershipChallenge';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';
import { FINAL_CTA } from '../data/finalCta';

export default function FinalCtaSection() {
  const { deadline } = useMembershipChallengeData();

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
          <Countdown deadline={deadline} />
        </div>
        <button
          className="btn btn-primary btn-lg rv"
          onClick={() => openPlanSheet()}
          disabled={!IS_MEMBERSHIP_LAUNCHED}
        >
          {ctaLabel(FINAL_CTA.cta)}
        </button>
      </div>
    </section>
  );
}
