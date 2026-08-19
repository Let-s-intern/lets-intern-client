import {
  getChallengeThumbnailSrc,
  type ChallengeModalItem,
} from '../data/challengeModalItems';

/** 썸네일 원본 비율(4:3). 레이아웃 시프트를 막기 위해 고정 값으로 넘긴다 */
const THUMB_WIDTH = 580;
const THUMB_HEIGHT = 435;

interface ChallengeBenefitCardProps {
  item: ChallengeModalItem;
}

/**
 * 혜택 섹션의 챌린지 카드.
 *
 * `item.group` 에 따라 배치가 다르다.
 * - core (시안 7-2): 썸네일 좌 · 본문 중앙 · 링크 우, 세로 리스트
 * - job  (시안 7-3): 썸네일 위 · 본문 아래, 3열 그리드. 설명 문단은 노출하지 않는다
 *
 * 카드 전체가 아니라 "챌린지 자세히 보기" 링크만 클릭 대상이다(시안 기준).
 */
export default function ChallengeBenefitCard({
  item,
}: ChallengeBenefitCardProps) {
  const isJob = item.group === 'job';

  return (
    <article className={`cb-card cb-card--${item.group}`}>
      <img
        className="cb-thumb"
        src={getChallengeThumbnailSrc(item)}
        alt={`${item.label} 썸네일`}
        width={THUMB_WIDTH}
        height={THUMB_HEIGHT}
        loading="lazy"
        decoding="async"
      />
      <div className="cb-body">
        <h4 className="cb-title">{item.label}</h4>
        {!isJob && <p className="cb-desc">{item.desc}</p>}
        <ul className="cb-badges">
          {item.badges.map((badge) => (
            <li className="cb-badge" key={badge}>
              {badge}
            </li>
          ))}
        </ul>
      </div>
      <a className="cb-link" href={item.url}>
        챌린지 자세히 보기 <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
