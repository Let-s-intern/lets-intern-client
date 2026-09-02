'use client';

import { useEffect } from 'react';

import type {
  LiveMentorDetail,
  LiveMentoringSlot,
} from '@/api/live-mentoring/liveMentoringSchema';
import type { ApplySheetState } from './hooks/useApplySheetState';
import AgreementSection from './section/AgreementSection';
import MentoringTypeSection from './section/MentoringTypeSection';
import PlanSelectSection from './section/PlanSelectSection';
import PriceSummarySection from './section/PriceSummarySection';
import ScheduleSelectSection from './section/ScheduleSelectSection';
import type { ApplyDraft } from './types';

interface ApplySheetProps {
  detail: LiveMentorDetail;
  /** 예약 가능 슬롯. 서버가 미래의 OPEN 슬롯만 걸러 내려준다. */
  slots: LiveMentoringSlot[];
  /** 상세 페이지가 들고 있는 시트 상태. 히어로 플랜 카드도 같은 상태를 만진다. */
  sheet: ApplySheetState;
  /** `신청하기`. 이 Push 는 콜백만 부르고, 실제 신청 생성은 Push 3 이다. */
  onSubmit: (draft: ApplyDraft) => void;
}

/**
 * 1대1 라이브 멘토링 신청 시트 (시안 `1-0`).
 *
 * 모바일은 화면 아래에 붙는 바텀시트, 데스크탑은 가운데 모달이다. 한 컴포넌트에
 * 반응형으로 담는다 — 두 벌로 나누면 안쪽 섹션까지 두 번 렌더된다.
 *
 * 열려 있는 동안 배경 스크롤을 잠근다. 시트 본문이 길어 자체 스크롤을 갖는데,
 * 잠그지 않으면 끝에 닿는 순간 뒤 페이지가 따라 움직여 어디를 보고 있는지 잃는다.
 */
const ApplySheet = ({ detail, slots, sheet, onSubmit }: ApplySheetProps) => {
  const { isOpen, close, draft, canSubmit } = sheet;
  const selectedPlan =
    detail.durationPrices.find(
      (option) => option.duration === draft.duration,
    ) ?? null;

  /*
    멘티의 선택지는 **멘토가 오픈 설정에서 고른 타입**(`detail.categories`)이다.

    예전에는 상세 페이지의 유형 카드(`mentoringTypes.items`)를 썼다. 카드는 필수가
    아니라 멘토가 채우지 않아도 오픈이 됐고, 그러면 신청 시트에 고를 것이 하나도
    없어 신청을 끝낼 수 없는 상품이 판매 중 상태로 열렸다. 오픈 타입은 오픈 시
    최소 1개가 강제되므로 빈 선택지가 나올 수 없다.

    카드는 제목·설명·태그가 붙은 상세 페이지 소개용으로 남는다.
  */
  const mentoringCategories = detail.categories;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="bg-neutral-0/50 fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-5"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="1대1 멘토링 신청"
        // 바깥 클릭으로만 닫히게 한다 — 시트 안쪽 클릭이 배경까지 올라가면 안 된다
        onClick={(event) => event.stopPropagation()}
        // 데스크탑 폭은 캘린더(280px)와 시간 그리드 4열이 나란히 들어가는 최소치다.
        // 더 좁히면 그리드가 3열로 접혀 시안 `1-0` 과 배치가 달라진다.
        className="bg-static-100 flex max-h-[90dvh] w-full flex-col rounded-t-xl md:max-w-[900px] md:rounded-xl"
      >
        {/* 시안의 상단 손잡이 — 모바일에서 끌어 내릴 수 있음을 알리는 표식 */}
        <div className="flex shrink-0 justify-center pb-2 pt-3 md:pt-4">
          <span
            aria-hidden="true"
            className="bg-neutral-80 h-1 w-10 rounded-full"
          />
        </div>

        <div className="flex flex-col gap-8 overflow-y-auto px-5 py-4 md:px-8">
          <PlanSelectSection
            productTitle={detail.title}
            durationPrices={detail.durationPrices}
            selectedDuration={draft.duration}
            isLocked={draft.slots.length > 0}
            onSelect={sheet.selectDuration}
          />

          <MentoringTypeSection
            categories={mentoringCategories}
            selected={draft.mentoringCategory}
            onSelect={sheet.selectMentoringType}
          />

          <ScheduleSelectSection
            slots={slots}
            duration={draft.duration}
            selectedSlots={draft.slots}
            onSelectSlots={sheet.selectSlots}
          />

          <AgreementSection
            checked={draft.agreedToScheduleChange}
            onChange={sheet.setAgreed}
          />

          <PriceSummarySection selected={selectedPlan} />
        </div>

        <div className="flex shrink-0 gap-3 px-5 pb-5 pt-4 md:px-8 md:pb-8">
          <button
            type="button"
            onClick={close}
            className="border-primary text-primary text-xsmall16 flex-1 rounded-sm border py-3 font-medium"
          >
            이전 단계로
          </button>
          <button
            type="button"
            onClick={() => onSubmit(draft)}
            disabled={!canSubmit}
            className="bg-primary text-xsmall16 disabled:bg-neutral-80 disabled:text-neutral-40 flex-[1.4] rounded-sm py-3 font-medium text-white"
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplySheet;
