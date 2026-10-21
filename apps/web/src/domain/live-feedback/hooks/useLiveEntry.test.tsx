/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import type { FeedbackInfo } from '@/api/feedback/feedbackSchema';

const patchMeetingUrlMutate = jest.fn().mockResolvedValue(undefined);
const patchMentorMutate = jest.fn().mockResolvedValue(undefined);

// 회의 서버 목록(GET /meeting-servers) — 입장 후보는 서버 DB 에서 온다.
const mockMeetingServerBaseUrls = [
  'https://jitsi-main.example.com/',
  'https://jitsi-fallback.example.com/',
];
jest.mock('@/api/meetingServer', () => ({
  useMeetingServerBaseUrls: () => ({
    baseUrls: mockMeetingServerBaseUrls,
    loadBaseUrls: async () => mockMeetingServerBaseUrls,
  }),
}));

jest.mock('@/api/feedback/feedback', () => ({
  usePatchFeedbackMeetingUrl: () => ({ mutateAsync: patchMeetingUrlMutate }),
  usePatchMentorFeedbackStatus: () => ({ mutateAsync: patchMentorMutate }),
}));

const ensureMock = jest.fn();
jest.mock('@letscareer/live-session/JitsiEmbed/jitsiHealthCheck', () => ({
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

  it('입장 후보와 failover 후보는 env 가 아니라 서버 회의 서버 목록이다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveEntry({ feedbackId: 1, feedbackInfo: baseInfo, role: 'MENTEE' }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(ensureMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseCandidates: mockMeetingServerBaseUrls }),
    );
    expect(result.current.baseCandidates).toEqual(mockMeetingServerBaseUrls);
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
