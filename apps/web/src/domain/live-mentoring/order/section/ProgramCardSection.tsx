'use client';

import { durationLabel } from '../../constants';
import type { LiveMentoringOrderDraft } from '../hooks/useOrderDraft';
import { formatReservationRange } from '../utils';

interface ProgramCardSectionProps {
  draft: LiveMentoringOrderDraft;
}

/**
 * 결제 프로그램 카드 (시안 `2-0` 상단).
 *
 * 무엇을 얼마에 언제 사는지를 한 카드에 모은다. 예약 일시는 60분 플랜의 연속 2칸을
 * **한 구간으로 합쳐** 보여준다 — 산 것은 한 시간짜리 멘토링 하나다.
 */
const ProgramCardSection = ({ draft }: ProgramCardSectionProps) => {
  const reservation = formatReservationRange(draft.slots);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xsmall16 text-neutral-0 font-semibold">
        결제 프로그램
      </h2>

      <div className="flex gap-4">
        {draft.thumbnail ? (
          <img
            src={draft.thumbnail}
            alt=""
            aria-hidden="true"
            className="h-20 w-20 shrink-0 rounded-sm object-cover md:h-[88px] md:w-[88px]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="bg-primary h-20 w-20 shrink-0 rounded-sm md:h-[88px] md:w-[88px]"
          />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-primary text-xxsmall12 font-semibold">
              1:1 LIVE 멘토링
            </span>
            <p className="text-xsmall16 text-neutral-0 font-bold">
              {draft.productName}
            </p>
          </div>

          <dl className="text-xsmall14 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-neutral-40">예약 일시</dt>
            <dd className="text-primary font-medium">
              {reservation ?? '선택한 일정이 없습니다'}
            </dd>
            <dt className="text-neutral-40">구매 플랜</dt>
            <dd className="text-primary font-medium">
              {durationLabel(draft.duration)}
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ProgramCardSection;
