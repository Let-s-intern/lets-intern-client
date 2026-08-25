'use client';

import { useCallback, useState } from 'react';

import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';
import type { ApplyDraft, SelectedApplySlot } from '../types';

const EMPTY_DRAFT: ApplyDraft = {
  duration: null,
  slots: [],
  mentoringTypeIds: [],
  agreedToScheduleChange: false,
};

/**
 * 신청 시트의 열림 여부와 입력값(`ApplyDraft`)을 한 곳에 묶는다.
 *
 * 규칙이 하나 있다 — **플랜이 바뀌면 선택 슬롯을 버린다.** 30분 플랜에서 1칸을 고른 뒤
 * 60분으로 바꾸면 그 1칸은 미완성 선택이고, 반대로 60분에서 2칸을 고른 뒤 30분으로
 * 바꾸면 1칸이 남아야 하는데 어느 쪽을 남길지 근거가 없다. 서버는
 * `validateSlotsAreConsecutive` 로 다시 검증하므로 어긋난 조합을 들고 있으면 신청이
 * 400 으로 떨어진다.
 *
 * 닫아도 입력값은 남긴다. 시안의 `이전 단계로` 가 되돌아오는 동선을 전제로 한다.
 */
export function useApplySheetState() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<ApplyDraft>(EMPTY_DRAFT);

  const selectDuration = useCallback((duration: LiveMentoringDuration) => {
    setDraft((prev) =>
      prev.duration === duration ? prev : { ...prev, duration, slots: [] },
    );
  }, []);

  const selectSlots = useCallback((slots: SelectedApplySlot[]) => {
    setDraft((prev) => ({ ...prev, slots }));
  }, []);

  /**
   * 멘토링 유형은 **하나만** 고른다.
   *
   * 서버 `mentoringTypeIds` 는 배열 계약이라 그대로 두고 길이 1로 보낸다 —
   * 화면 규칙에 맞춰 요청 형태를 바꾸면 계약이 갈라진다.
   */
  const selectMentoringType = useCallback((typeId: number) => {
    setDraft((prev) => ({ ...prev, mentoringTypeIds: [typeId] }));
  }, []);

  const setAgreed = useCallback((agreed: boolean) => {
    setDraft((prev) => ({ ...prev, agreedToScheduleChange: agreed }));
  }, []);

  /** 시트를 연다. 플랜을 함께 넘기면 그 플랜이 고른 상태로 열린다(히어로 카드 → 시트). */
  const open = useCallback(
    (duration?: LiveMentoringDuration) => {
      if (duration !== undefined) selectDuration(duration);
      setIsOpen(true);
    },
    [selectDuration],
  );

  const close = useCallback(() => setIsOpen(false), []);

  /*
    필수 입력이 전부 찼는지. 슬롯 개수까지 보는 이유는 60분 플랜에서 한 칸만 잡힌
    상태로 신청이 나가면 서버 validateSlotsAreConsecutive 에서 400 이 나기 때문이다.
  */
  const canSubmit =
    draft.duration !== null &&
    draft.slots.length === (draft.duration === 60 ? 2 : 1) &&
    draft.mentoringTypeIds.length === 1 &&
    draft.agreedToScheduleChange;

  return {
    isOpen,
    open,
    close,
    draft,
    canSubmit,
    selectDuration,
    selectSlots,
    selectMentoringType,
    setAgreed,
  };
}

export type ApplySheetState = ReturnType<typeof useApplySheetState>;
