'use client';

import { useEffect, useState } from 'react';

import { useLiveMentorSlotsQuery } from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';

import type { SelectedApplySlot } from '../../apply/types';
import ScheduleSelectSection from '../../apply/section/ScheduleSelectSection';

interface ScheduleChangeModalProps {
  mentorId: number;
  duration: LiveMentoringDuration;
  /** 지금 담겨 있는 선택. 모달을 열 때 초기값으로 쓴다. */
  selectedSlots: SelectedApplySlot[];
  onConfirm: (slots: SelectedApplySlot[]) => void;
  onClose: () => void;
}

/**
 * 결제 직전 일정만 다시 고르는 모달.
 *
 * 결제하기를 누른 순간 다른 사람이 그 슬롯을 먼저 가져가면 신청 생성이 409 로 막힌다.
 * 예전에는 이때 상세 페이지로 되돌려보내, 이메일·질문·쿠폰까지 다 채운 사용자가
 * 처음부터 다시 해야 했다. **바뀐 것은 일정 하나뿐이므로 일정만 다시 고르게 한다.**
 *
 * 캘린더는 신청 시트의 `ScheduleSelectSection` 을 그대로 쓴다. props 가
 * `slots` / `duration` / `selectedSlots` / `onSelectSlots` 넷뿐이라 시트 밖에서도
 * 그대로 붙는다 — 같은 화면을 두 벌 만들면 한쪽만 고쳐지는 날이 온다.
 *
 * 슬롯은 **열 때마다 새로 받는다.** 충돌했다는 것은 손에 든 목록이 이미 낡았다는 뜻이라,
 * 그대로 다시 고르게 하면 방금 팔린 자리를 또 고를 수 있다.
 */
const ScheduleChangeModal = ({
  mentorId,
  duration,
  selectedSlots,
  onConfirm,
  onClose,
}: ScheduleChangeModalProps) => {
  const { data: slots, isLoading } = useLiveMentorSlotsQuery(mentorId);
  const [picked, setPicked] = useState<SelectedApplySlot[]>(selectedSlots);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const expectedSlotCount = duration === 60 ? 2 : 1;
  const canConfirm = picked.length === expectedSlotCount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="예약 일시 다시 선택"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center"
    >
      <div className="flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-y-auto rounded-t-lg bg-white p-5 md:rounded-lg">
        <h2 className="text-small18 text-neutral-0 mb-1 font-semibold">
          예약 일시를 다시 선택해 주세요
        </h2>
        <p className="text-xsmall14 text-neutral-45 mb-4">
          고르신 시간을 다른 분이 먼저 예약했어요. 작성하신 내용은 그대로
          있어요.
        </p>

        {isLoading ? (
          <p className="text-xsmall14 text-neutral-45 py-10 text-center">
            예약 가능한 시간을 불러오는 중이에요.
          </p>
        ) : (
          <ScheduleSelectSection
            slots={slots?.liveMentoringSlotList ?? []}
            duration={duration}
            selectedSlots={picked}
            onSelectSlots={setPicked}
          />
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xsmall14 border-neutral-80 text-neutral-30 flex-1 rounded-sm border py-3 font-medium"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => onConfirm(picked)}
            className="text-xsmall14 bg-primary disabled:bg-neutral-80 flex-1 rounded-sm py-3 font-medium text-white"
          >
            이 시간으로 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleChangeModal;
