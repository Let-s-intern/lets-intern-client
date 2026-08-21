import { openPlanSheet } from '../lib/planSheet';
import { ctaLabel, IS_CTA_DISABLED } from '../lib/membershipChallenge';
import { HERO, HERO_STATS } from '../data/hero';

// 시안 0.png — 1열 중앙 정렬. 배지 / 헤드라인 2줄 / 서브 2줄 / 버튼 2개 / 하단 4지표.
// 카운트다운 카드(offer)와 모집기간 메타(hero-meta)는 시안에 없어 렌더하지 않는다.
export default function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-chips he he1">
          <span className="hero-badge">{HERO.badge}</span>
        </div>
        {/* 줄바꿈은 <br> 이 아니라 base.css 의 .brk 유틸이 정한다.
            1줄차는 어느 폭에서도 자기 줄(.brk-line), 2·3줄은 601px 이상에서 붙어 한 줄이 된다. */}
        <h1 className="he he2">
          {HERO.titleLines.map((line, i) => (
            <span className={i === 0 ? 'brk-line' : 'brk'} key={i}>
              {line}
            </span>
          ))}
        </h1>
        <p className="lead he he3">
          {HERO.lead.map((line) => (
            <span className="brk-line" key={line}>
              {line}
            </span>
          ))}
        </p>
        <div className="hero-cta he he4">
          <button
            className="btn btn-hero-light"
            onClick={() => openPlanSheet()}
            disabled={IS_CTA_DISABLED}
          >
            {ctaLabel(HERO.ctaPrimary)}
          </button>
          <button
            className="btn btn-hero-orange"
            onClick={() =>
              document
                .getElementById('benefits')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {HERO.ctaSecondary}
          </button>
        </div>
      </div>

      <div className="wrap hero-stats he he5">
        {HERO_STATS.map((stat) => (
          <div className="hero-stat" key={stat.title}>
            <strong className="t">{stat.title}</strong>
            <span className="d">{stat.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
