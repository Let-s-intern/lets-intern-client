/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';

import type { SelectedApplySlot } from '../types';
import { useApplySheetState } from './useApplySheetState';

const SLOT_10_00: SelectedApplySlot = {
  slotId: 142,
  date: '2026-09-13',
  time: '10:00',
  startDate: '2026-09-13T10:00:00',
  endDate: '2026-09-13T10:30:00',
};

const SLOT_10_30: SelectedApplySlot = {
  slotId: 143,
  date: '2026-09-13',
  time: '10:30',
  startDate: '2026-09-13T10:30:00',
  endDate: '2026-09-13T11:00:00',
};

describe('useApplySheetState', () => {
  it('처음에는 닫혀 있고 입력값이 비어 있다', () => {
    const { result } = renderHook(() => useApplySheetState());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.draft).toEqual({
      duration: null,
      slots: [],
      mentoringCategory: null,
      agreedToScheduleChange: false,
    });
  });

  it('플랜을 넘겨 열면 그 플랜이 선택된 채 열린다', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.open(60));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.draft.duration).toBe(60);
  });

  it('닫아도 입력값은 남는다 — 시안의 `이전 단계로` 동선', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.open(30));
    act(() => result.current.selectSlots([SLOT_10_00]));
    act(() => result.current.close());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.draft.slots).toEqual([SLOT_10_00]);
  });

  /*
    이 Push 에서 가장 중요한 규칙이다. 30분에서 고른 1칸을 60분으로 넘어간 뒤에도
    들고 있으면 서버 `validateSlotsAreConsecutive` 에서 400 이 난다.
  */
  it('플랜을 바꾸면 선택 슬롯이 초기화된다 (30분 → 60분)', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.selectDuration(30));
    act(() => result.current.selectSlots([SLOT_10_00]));
    act(() => result.current.selectDuration(60));

    expect(result.current.draft.duration).toBe(60);
    expect(result.current.draft.slots).toEqual([]);
  });

  it('플랜을 바꾸면 선택 슬롯이 초기화된다 (60분 → 30분)', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.selectDuration(60));
    act(() => result.current.selectSlots([SLOT_10_00, SLOT_10_30]));
    act(() => result.current.selectDuration(30));

    expect(result.current.draft.slots).toEqual([]);
  });

  it('같은 플랜을 다시 고르면 선택 슬롯을 유지한다', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.selectDuration(30));
    act(() => result.current.selectSlots([SLOT_10_00]));
    act(() => result.current.selectDuration(30));

    expect(result.current.draft.slots).toEqual([SLOT_10_00]);
  });

  /*
    플랜은 항상 하나가 골라져 있어야 하므로 해제 경로를 없앴다.
    대신 다른 플랜으로 바꿀 때 슬롯이 함께 풀리는지를 본다 — 30분에서 고른 1칸은
    60분에서 미완성 선택이라 그대로 두면 서버에서 400 이 난다.
  */
  it('플랜을 바꾸면 슬롯이 함께 풀린다', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.selectDuration(60));
    act(() => result.current.selectSlots([SLOT_10_00, SLOT_10_30]));
    act(() => result.current.selectDuration(30));

    expect(result.current.draft.duration).toBe(30);
    expect(result.current.draft.slots).toEqual([]);
  });

  it('멘토링 유형은 하나만 고를 수 있고 다시 고르면 바뀐다', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.selectMentoringType('PERSONAL_STATEMENT'));
    expect(result.current.draft.mentoringCategory).toBe('PERSONAL_STATEMENT');

    // 다른 유형을 고르면 앞의 것이 빠진다. 쌓이지 않는다.
    act(() => result.current.selectMentoringType('RESUME'));
    expect(result.current.draft.mentoringCategory).toBe('RESUME');
  });

  describe('canSubmit — 필수 입력이 다 찼을 때만 참', () => {
    const fill = (result: {
      current: ReturnType<typeof useApplySheetState>;
    }) => {
      act(() => result.current.selectDuration(30));
      act(() => result.current.selectSlots([SLOT_10_00]));
      act(() => result.current.selectMentoringType('PERSONAL_STATEMENT'));
      act(() => result.current.setAgreed(true));
    };

    it('플랜·슬롯·유형·동의가 모두 차면 참이다', () => {
      const { result } = renderHook(() => useApplySheetState());
      fill(result);
      expect(result.current.canSubmit).toBe(true);
    });

    it('동의를 풀면 거짓으로 돌아간다', () => {
      const { result } = renderHook(() => useApplySheetState());
      fill(result);
      act(() => result.current.setAgreed(false));
      expect(result.current.canSubmit).toBe(false);
    });

    it('유형을 하나도 안 고르면 거짓이다', () => {
      const { result } = renderHook(() => useApplySheetState());

      // 단일 선택에는 해제가 없다. 아예 고르지 않은 상태로 나머지만 채운다.
      act(() => result.current.selectDuration(30));
      act(() => result.current.selectSlots([SLOT_10_00]));
      act(() => result.current.setAgreed(true));

      expect(result.current.draft.mentoringCategory).toBeNull();
      expect(result.current.canSubmit).toBe(false);
    });

    /*
      60분 플랜에서 한 칸만 잡힌 채 신청이 나가면 서버
      validateSlotsAreConsecutive 에서 400 이 난다.
    */
    it('60분 플랜인데 슬롯이 한 칸뿐이면 거짓이다', () => {
      const { result } = renderHook(() => useApplySheetState());
      act(() => result.current.selectDuration(60));
      act(() => result.current.selectSlots([SLOT_10_00]));
      act(() => result.current.selectMentoringType('PERSONAL_STATEMENT'));
      act(() => result.current.setAgreed(true));

      expect(result.current.canSubmit).toBe(false);

      act(() => result.current.selectSlots([SLOT_10_00, SLOT_10_30]));
      expect(result.current.canSubmit).toBe(true);
    });
  });

  it('동의 체크는 플랜·슬롯 선택에 영향을 주지 않는다', () => {
    const { result } = renderHook(() => useApplySheetState());

    act(() => result.current.selectDuration(30));
    act(() => result.current.selectSlots([SLOT_10_00]));
    act(() => result.current.setAgreed(true));

    expect(result.current.draft.agreedToScheduleChange).toBe(true);
    expect(result.current.draft.slots).toEqual([SLOT_10_00]);
  });
});
