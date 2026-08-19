import {
  CORE_CHALLENGE_BLOCK_HEAD,
  GUIDEBOOK_BLOCK_HEAD,
  JOB_CHALLENGE_BLOCK_HEAD,
  type BenefitBlockHead,
  type HeadSegment,
} from '../data/benefits';
import { CHALLENGE_ITEMS } from '../data/challengeModalItems';
import { GUIDEBOOK_CARD, type BenefitHighlightCard } from '../data/guidebooks';
import ChallengeBenefitCard from '../ui/ChallengeBenefitCard';

const CORE_ITEMS = CHALLENGE_ITEMS.filter((item) => item.group === 'core');
const JOB_ITEMS = CHALLENGE_ITEMS.filter((item) => item.group === 'job');

function Segments({ segments }: { segments: HeadSegment[] }) {
  return (
    <>
      {segments.map((seg) =>
        seg.hl ? (
          <span className="bn-hl" key={seg.text}>
            {seg.text}
          </span>
        ) : (
          <span key={seg.text}>{seg.text}</span>
        ),
      )}
    </>
  );
}

function BlockHead({ head }: { head: BenefitBlockHead }) {
  return (
    <div className="bn-block-head rv">
      <h3>
        {head.lines.map((line, i) => (
          <span className="bn-line" key={line.map((s) => s.text).join('')}>
            {i > 0 && <br />}
            <Segments segments={line} />
          </span>
        ))}
      </h3>
      {head.sub && <p>{head.sub}</p>}
    </div>
  );
}

/**
 * 가이드북·스터디처럼 카드 한 장으로 소개하는 블록.
 * 챌린지 core 카드와 같은 좌우 배치를 쓴다(시안 7-1 · 7-4).
 */
function HighlightCard({
  card,
  wide,
}: {
  card: BenefitHighlightCard;
  wide?: boolean;
}) {
  return (
    <article
      className={['cb-card', 'cb-card--core', wide ? 'cb-card--wide' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <img
        className="cb-thumb"
        src={`/images/membership/${card.src}`}
        alt={card.imgAlt}
        width={580}
        height={435}
        loading="lazy"
        decoding="async"
      />
      <div className="cb-body">
        <h4 className="cb-title">{card.title}</h4>
        <p className="cb-desc">{card.desc}</p>
        <ul className="cb-badges">
          {card.badges.map((badge) => (
            <li className="cb-badge" key={badge}>
              {badge}
            </li>
          ))}
        </ul>
      </div>
      {/* 앱 내부 경로(/로 시작)는 같은 탭에서 이동한다. 외부 도메인만 새 탭으로 연다. */}
      <a
        className="cb-link"
        href={card.url}
        {...(card.url.startsWith('/')
          ? {}
          : { target: '_blank', rel: 'noopener noreferrer' })}
      >
        자세히 보기 <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

export default function BenefitsSection() {
  return (
    <section className="benefits" id="benefits">
      <div className="wrap">
        {/* 시안 6-0 헤더("공채 준비 올인원 패스 혜택")는 바로 위 CoursePlanSection 이 렌더한다.
            시안 순서가 6-0(헤더) → 6-1(플레이북) → 7-x(혜택 상세)라 헤더가 앞 섹션에 붙는다.
            여기서 다시 그리면 같은 문구가 화면에 두 번 나온다. */}

        <div className="bn-block">
          <BlockHead head={GUIDEBOOK_BLOCK_HEAD} />
          <div className="rv">
            <HighlightCard card={GUIDEBOOK_CARD} wide />
          </div>
        </div>

        <div className="bn-block">
          <BlockHead head={CORE_CHALLENGE_BLOCK_HEAD} />
          <div className="cb-list rv">
            {CORE_ITEMS.map((item) => (
              <ChallengeBenefitCard item={item} key={item.url} />
            ))}
          </div>
        </div>

        <div className="bn-block">
          <BlockHead head={JOB_CHALLENGE_BLOCK_HEAD} />
          <div className="cb-jobgrid rv">
            {JOB_ITEMS.map((item) => (
              <ChallengeBenefitCard item={item} key={item.url} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
