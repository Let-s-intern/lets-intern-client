import dayjs from '../lib/dayjs';
import Countdown from '../ui/Countdown';
import { openPlanSheet } from '../lib/planSheet';
import { ctaLabel, IS_MEMBERSHIP_LAUNCHED } from '../lib/membershipChallenge';
import { useMembershipChallengeData } from '../lib/useMembershipChallengeData';
import { HERO } from '../data/hero';

export default function HeroSection() {
  const { beginning, deadline, startDate, endDate } =
    useMembershipChallengeData();

  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div>
          <div className="hero-chips he he1">
            <span className="eyebrow">{HERO.badge}</span>
          </div>
          <h1 className="he he2">
            {HERO.titleLines.map((line, i) => {
              const last = i === HERO.titleLines.length - 1;
              return (
                <span key={i}>
                  {last ? <span className="hl">{line}</span> : line}
                  {!last && <br />}
                </span>
              );
            })}
          </h1>
          <p className="lead he he3">
            {HERO.lead.map((line, i) => (
              <span key={i}>
                {i === 1 ? <b>{line}</b> : line}
                {i < HERO.lead.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="hero-cta he he4">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => openPlanSheet()}
              disabled={!IS_MEMBERSHIP_LAUNCHED}
            >
              {ctaLabel(HERO.ctaPrimary)}
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() =>
                document
                  .getElementById('benefits')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {HERO.ctaSecondary}
            </button>
          </div>
          <div className="hero-meta he he5">
            <span>
              📍 모집기간{' '}
              <b className="num">
                {dayjs(beginning).format('YYYY.MM.DD')} –{' '}
                {dayjs(deadline).format('MM.DD')}
              </b>{' '}
              · {dayjs(startDate).format('M')}~{dayjs(endDate).format('M')}월{' '}
              {dayjs(endDate).diff(dayjs(startDate), 'month') + 1}개월 이용
            </span>
          </div>
        </div>

        <aside className="offer">
          <div className="tag">{HERO.offerTag}</div>
          <h3>{HERO.offerTitle}</h3>
          <div className="cd" id="hero-cd">
            <Countdown deadline={deadline} />
          </div>
          <p className="fine">{HERO.offerFine}</p>
        </aside>
      </div>
    </section>
  );
}
