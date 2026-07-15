/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import type { FeedbackInfo } from '@/api/feedback/feedbackSchema';

const patchMeetingUrlMutate = jest.fn().mockResolvedValue(undefined);
const patchMentorMutate = jest.fn().mockResolvedValue(undefined);

jest.mock('@/api/feedback/feedback', () => ({
  usePatchFeedbackMeetingUrl: () => ({ mutateAsync: patchMeetingUrlMutate }),
  usePatchMentorFeedbackStatus: () => ({ mutateAsync: patchMentorMutate }),
}));

const ensureMock = jest.fn();
jest.mock('@letscareer/ui/JitsiEmbed/jitsiHealthCheck', () => ({
  ensureLiveMeetingUrl: (opts: unknown) => ensureMock(opts),
}));

import { useLiveEntry } from './useLiveEntry';

const baseInfo = {
  feedbackId: 1,
  startDate: '2026-06-13T10:00:00+09:00',
  endDate: '2026-06-13T11:00:00+09:00',
  meetingUrl: null,
  status: 'RESERVED',
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  score: null,
  review: null,
} as FeedbackInfo;

describe('useLiveEntry', () => {
  beforeEach(() => {
    patchMeetingUrlMutate.mockClear();
    patchMentorMutate.mockClear();
    ensureMock.mockReset();
  });

  it('멘토 입장 성공 시 멘토 출석 PATCH를 호출하고 인라인을 연다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveEntry({ feedbackId: 1, feedbackInfo: baseInfo, role: 'MENTOR' }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(patchMentorMutate).toHaveBeenCalledWith({ mentorStatus: 'PRESENT' });
    expect(result.current.isOpen).toBe(true);
  });

  it('멘티 입장 성공 시 멘토 출석 PATCH를 호출하지 않는다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveEntry({ feedbackId: 1, feedbackInfo: baseInfo, role: 'MENTEE' }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(patchMentorMutate).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(true);
  });

  it('헬스체크 실패 시 인라인을 열지 않는다', async () => {
    ensureMock.mockResolvedValue({ ok: false, reason: 'no-healthy-domain' });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() =>
      useLiveEntry({ feedbackId: 1, feedbackInfo: baseInfo, role: 'MENTEE' }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(result.current.isOpen).toBe(false);
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('멘토 출석 PATCH가 실패해도 입장은 진행된다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    patchMentorMutate.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() =>
      useLiveEntry({ feedbackId: 1, feedbackInfo: baseInfo, role: 'MENTOR' }),
    );

    await act(async () => {
      await result.current.enter();
    });

    await waitFor(() => expect(result.current.isOpen).toBe(true));
  });
});
