import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
}));

vi.mock('@/api/mentor/mentor', () => ({
  usePatchAttendanceMentorMutation: () => ({ mutate: mocks.mutate }),
}));

import { loadFeedbackDraft } from '../../utils/feedbackLocalDraft';
import { useFeedbackAutosave } from '../useFeedbackAutosave';

const LOCAL_MS = 1000;
const SERVER_MS = 30_000;

// 실제 Lexical JSON 형태 — 공백 판정이 텍스트 노드를 읽는다.
const doc = (text: string) =>
  JSON.stringify({
    root: { children: [{ children: text ? [{ text }] : [] }] },
  });
const BLANK = doc('');

interface Props {
  attendanceId: number | null;
  content: string;
  savedContent: string;
  enabled: boolean;
}

const setup = (initial: Partial<Props> = {}) => {
  const onServerSaved = vi.fn();
  const view = renderHook(
    (props: Props) => useFeedbackAutosave({ ...props, onServerSaved }),
    {
      initialProps: {
        attendanceId: 10,
        content: doc('저장본'),
        savedContent: doc('저장본'),
        enabled: true,
        ...initial,
      },
    },
  );
  return { ...view, onServerSaved };
};

describe('useFeedbackAutosave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.mutate.mockReset();
  });

  afterEach(() => {
    // 언마운트 때 남은 초안을 저장하므로, 먼저 언마운트한 뒤 비워야 다음 테스트로 새지 않는다.
    cleanup();
    vi.useRealTimers();
    window.localStorage.clear();
  });

  describe('로컬 초안', () => {
    it('입력이 멈추고 1초 뒤에 저장한다', () => {
      const { rerender } = setup();

      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });
      act(() => vi.advanceTimersByTime(LOCAL_MS - 1));
      expect(loadFeedbackDraft(10)).toBeNull();

      act(() => vi.advanceTimersByTime(1));
      expect(loadFeedbackDraft(10)).toBe(doc('작성중'));
    });

    it('탭이 숨겨지면 기다리지 않고 바로 저장한다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      act(() => {
        window.dispatchEvent(new Event('pagehide'));
      });

      expect(loadFeedbackDraft(10)).toBe(doc('작성중'));
    });

    it('작성이 끝나 비활성화되면 남은 입력을 바로 저장한다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      rerender({
        attendanceId: 10,
        content: '',
        savedContent: doc('저장본'),
        enabled: false,
      });

      expect(loadFeedbackDraft(10)).toBe(doc('작성중'));
    });

    it('멘티를 바꾸면 이전 멘티의 입력을 그 멘티 키로 저장한다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('10번 글'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      rerender({
        attendanceId: 11,
        content: doc('저장본'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      expect(loadFeedbackDraft(10)).toBe(doc('10번 글'));
      expect(loadFeedbackDraft(11)).toBeNull();
    });

    it('서버 저장본과 같아지면 초안을 지운다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });
      act(() => vi.advanceTimersByTime(LOCAL_MS));

      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('작성중'),
        enabled: true,
      });
      act(() => vi.advanceTimersByTime(LOCAL_MS));

      expect(loadFeedbackDraft(10)).toBeNull();
    });
  });

  describe('서버 자동 임시저장', () => {
    it('변경이 생기고 30초 뒤에 상태값 없이 본문만 보낸다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      act(() => vi.advanceTimersByTime(SERVER_MS - 1));
      expect(mocks.mutate).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(1));
      expect(mocks.mutate).toHaveBeenCalledTimes(1);
      // feedbackStatus 를 보내면 제출 직후 도착한 자동 저장이 COMPLETED 를 되돌린다.
      expect(mocks.mutate.mock.calls[0][0]).toEqual({
        attendanceId: 10,
        feedback: doc('작성중'),
      });
    });

    it('쉬지 않고 입력해도 30초마다 최신 본문을 저장한다', () => {
      const { rerender } = setup();
      for (let i = 1; i <= 6; i += 1) {
        rerender({
          attendanceId: 10,
          content: doc(`입력${i}`),
          savedContent: doc('저장본'),
          enabled: true,
        });
        act(() => vi.advanceTimersByTime(5_000));
      }

      expect(mocks.mutate).toHaveBeenCalledTimes(1);
      expect(mocks.mutate.mock.calls[0][0].feedback).toBe(doc('입력6'));
    });

    it('저장에 성공하면 보낸 본문으로 onServerSaved 를 부른다', () => {
      mocks.mutate.mockImplementation((_body, opts) => opts.onSuccess());
      const { rerender, onServerSaved } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      act(() => vi.advanceTimersByTime(SERVER_MS));

      expect(onServerSaved).toHaveBeenCalledWith(doc('작성중'));
    });

    it('저장 중에는 isAutoSaving 이 true 다', () => {
      let settle: () => void = () => {};
      mocks.mutate.mockImplementation((_body, opts) => {
        settle = opts.onSettled;
      });
      const { result, rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });

      act(() => vi.advanceTimersByTime(SERVER_MS));
      expect(result.current.isAutoSaving).toBe(true);

      act(() => settle());
      expect(result.current.isAutoSaving).toBe(false);
    });

    it('양쪽 다 비어 있으면 보내지 않는다', () => {
      setup({ content: BLANK, savedContent: '' });

      act(() => vi.advanceTimersByTime(SERVER_MS * 2));

      expect(mocks.mutate).not.toHaveBeenCalled();
    });

    it('저장본과 같아지면 예약된 저장을 취소한다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });
      act(() => vi.advanceTimersByTime(10_000));

      // 수동 임시저장 성공 등으로 저장본이 따라잡은 경우
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('작성중'),
        enabled: true,
      });
      act(() => vi.advanceTimersByTime(SERVER_MS));

      expect(mocks.mutate).not.toHaveBeenCalled();
    });

    it('비활성화되면 보내지 않는다', () => {
      const { rerender } = setup();
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: true,
      });
      rerender({
        attendanceId: 10,
        content: doc('작성중'),
        savedContent: doc('저장본'),
        enabled: false,
      });

      act(() => vi.advanceTimersByTime(SERVER_MS));

      expect(mocks.mutate).not.toHaveBeenCalled();
    });
  });
});
