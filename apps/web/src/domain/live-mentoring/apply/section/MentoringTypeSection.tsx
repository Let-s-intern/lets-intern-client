'use client';

import type { LiveMentoringCategory } from '@/api/live-mentoring/liveMentoringSchema';

import { CATEGORY_LABELS } from '../../constants';

interface MentoringTypeSectionProps {
  /** 멘토가 오픈 설정에서 고른 타입. 오픈 시 최소 1개가 강제된다. */
  categories: LiveMentoringCategory[];
  /** 고른 유형. 하나만 고를 수 있어 배열이 아니다. */
  selected: LiveMentoringCategory | null;
  onSelect: (category: LiveMentoringCategory) => void;
}

/**
 * 멘토링 유형 선택 (시안 `1-0` · `1-1`).
 *
 * 선택지는 **멘토가 오픈 설정에서 고른 타입**(`detail.categories`)이다.
 *
 * 예전에는 상세 페이지의 유형 카드(`mentoringTypes.items`)를 썼다. 카드는 필수가
 * 아니라 멘토가 채우지 않아도 오픈이 됐고, 그러면 이 자리가 비어 신청을 끝낼 수 없는
 * 상품이 판매 중 상태로 열렸다. 멘토 화면에서는 `타입`과 `멘토링 유형`이 서로 다른
 * 곳에 있는데 값이 둘 다 자기소개서·이력서·포트폴리오라, 오픈 설정만 채우고 끝냈다고
 * 생각하기 쉬웠다.
 *
 * **하나만** 고를 수 있고, 하나는 반드시 골라야 신청할 수 있다.
 * 라디오를 쓴다 — 체크박스는 여러 개를 고를 수 있다고 읽힌다.
 *
 * **접지 않고 펼쳐 둔다.** 아코디언이었을 때는 신청 시트를 열어도 "멘토링 유형 선택"
 * 막대만 보여서, 필수 항목인데 유형이 있는지조차 알 수 없었다.
 */
const MentoringTypeSection = ({
  categories,
  selected,
  onSelect,
}: MentoringTypeSectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xsmall16 text-neutral-0 font-semibold">
        멘토링 유형 <span className="text-primary">(필수)</span>
      </h3>

      <div className="border-neutral-80 divide-neutral-85 flex flex-col divide-y rounded-sm border">
        {categories.map((category) => (
          <label
            key={category}
            className="text-xsmall14 text-neutral-0 flex cursor-pointer items-center gap-2.5 px-4 py-3.5"
          >
            <input
              type="radio"
              name="live-mentoring-type"
              checked={selected === category}
              onChange={() => onSelect(category)}
              className="accent-primary h-4 w-4"
            />
            {CATEGORY_LABELS[category]}
          </label>
        ))}
      </div>
    </section>
  );
};

export default MentoringTypeSection;
