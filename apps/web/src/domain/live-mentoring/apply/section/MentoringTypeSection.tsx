'use client';

import type { LiveMentorDetail } from '@/api/live-mentoring/liveMentoringSchema';

type MentoringTypeItem =
  LiveMentorDetail['template']['mentoringTypes']['items'][number];

interface MentoringTypeSectionProps {
  items: MentoringTypeItem[];
  selectedIds: number[];
  onToggle: (typeId: number) => void;
}

/**
 * 멘토링 유형 선택 (시안 `1-0` · `1-1`).
 *
 * 목록은 **서버 `detailPage.mentoringTypes.items` 를 그대로 쓴다** (PRD 7-3 결정).
 * 시안의 5종(이력서·자기소개서·포트폴리오·취업고민·커피챗)을 하드코딩하지 않는다 —
 * 신청 생성 DTO 가 `mentoringTypeIds`(Long)를 요구하는데, 상수로 만든 유형에는
 * 서버가 대조할 수 있는 id 가 없다. 멘토가 상세 페이지에서 쓴 카드가 곧 유형이다.
 *
 * 다중 선택이고, 최소 1개는 골라야 신청할 수 있다.
 *
 * **접지 않고 펼쳐 둔다.** 아코디언이었을 때는 신청 시트를 열어도 "멘토링 유형 선택"
 * 막대만 보여서, 필수 항목인데 유형이 있는지조차 알 수 없었다.
 */
const MentoringTypeSection = ({
  items,
  selectedIds,
  onToggle,
}: MentoringTypeSectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xsmall16 text-neutral-0 font-semibold">
        멘토링 유형 <span className="text-primary">(필수)</span>
      </h3>

      <div className="border-neutral-80 divide-neutral-85 flex flex-col divide-y rounded-sm border">
        {items.length === 0 ? (
          /*
            유형이 하나도 없으면 `신청하기` 가 영원히 잠긴다 —
            `canSubmit` 이 `mentoringTypeIds.length > 0` 을 요구하기 때문이다.
            "없습니다" 만 적으면 멘티는 버튼이 왜 안 눌리는지 알 수 없다.
            고를 것이 없다는 사실과 그래서 신청이 안 된다는 결과를 함께 적는다.
          */
          <div className="flex flex-col gap-1 px-4 py-6 text-center">
            <p className="text-xsmall14 text-neutral-30 font-medium">
              멘토가 멘토링 유형을 아직 등록하지 않았습니다.
            </p>
            <p className="text-xxsmall12 text-neutral-45">
              유형을 하나 이상 골라야 신청할 수 있어, 지금은 신청을 완료할 수
              없습니다.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <label
              key={item.id}
              className="text-xsmall14 text-neutral-0 flex cursor-pointer items-center gap-2.5 px-4 py-3.5"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => onToggle(item.id)}
                className="accent-primary h-4 w-4"
              />
              {item.typeName}
            </label>
          ))
        )}
      </div>
    </section>
  );
};

export default MentoringTypeSection;
