/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';

import type { LiveMentoringEntry } from '@/api/live-mentoring/liveMentoringSchema';

const createMeetingRoomMutate = jest
  .fn()
  .mockResolvedValue('https://meet.test/room');
const updateAttendanceMutate = jest.fn().mockResolvedValue(undefined);

// 회의 서버 목록(GET /meeting-servers) — 입장 후보는 서버 DB 에서 온다.
const mockMeetingServerBaseUrls = [
  'https://jitsi-main.example.com/',
  'https://jitsi-fallback.example.com/',
];
const mockLoadBaseUrls = jest.fn(async () => mockMeetingServerBaseUrls);
jest.mock('@/api/meetingServer', () => ({
  useMeetingServerBaseUrls: () => ({
    baseUrls: mockMeetingServerBaseUrls,
    loadBaseUrls: () => mockLoadBaseUrls(),
  }),
}));

jest.mock('@/api/live-mentoring/liveMentoring', () => ({
  useCreateLiveMentoringEntryMeetingRoomMutation: () => ({
    mutateAsync: createMeetingRoomMutate,
  }),
  useUpdateLiveMentoringEntryAttendanceMutation: () => ({
    mutateAsync: updateAttendanceMutate,
  }),
}));

const ensureMock = jest.fn();
jest.mock('@letscareer/live-session/JitsiEmbed/jitsiHealthCheck', () => ({
  ensureLiveMeetingUrl: (opts: unknown) => ensureMock(opts),
}));

import { useLiveMentoringEntry } from './useLiveMentoringEntry';

const baseEntry = {
  applicationId: 1,
  myRole: 'MENTEE',
  productName: '이력서 라이브 멘토링',
  durationMinutes: 30,
  reservationStartAt: '2026-06-13T10:00:00+09:00',
  reservationEndAt: '2026-06-13T10:30:00+09:00',
  mentorName: '멘토',
  menteeName: '멘티',
  questionDeferred: false,
  questionContent: null,
  attachmentType: 'NONE',
  attachmentUrl: null,
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  meetingUrl: null,
  reviewId: null,
} as LiveMentoringEntry;

describe('useLiveMentoringEntry', () => {
  beforeEach(() => {
    createMeetingRoomMutate.mockClear();
    updateAttendanceMutate.mockClear();
    ensureMock.mockReset();
    mockLoadBaseUrls.mockReset();
    mockLoadBaseUrls.mockResolvedValue(mockMeetingServerBaseUrls);
  });

  it('이미 방이 있으면 회의 서버 목록 조회가 실패해도 입장한다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    mockLoadBaseUrls.mockRejectedValueOnce(new Error('network'));
    const { result } = renderHook(() =>
      useLiveMentoringEntry({
        applicationId: 1,
        entry: {
          ...baseEntry,
          meetingUrl: 'https://jitsi-main.example.com/room',
        },
      }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(mockLoadBaseUrls).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(true);
  });

  it('입장 후보와 failover 후보는 env 가 아니라 서버 회의 서버 목록이다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveMentoringEntry({ applicationId: 1, entry: baseEntry }),
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
      useLiveMentoringEntry({
        applicationId: 1,
        entry: { ...baseEntry, myRole: 'MENTOR' },
      }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(updateAttendanceMutate).toHaveBeenCalledWith({
      mentorStatus: 'PRESENT',
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('멘티 입장 성공 시 멘토 출석 PATCH를 호출하지 않는다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveMentoringEntry({
        applicationId: 1,
        entry: { ...baseEntry, myRole: 'MENTEE' },
      }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(updateAttendanceMutate).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(true);
  });

  it('이미 출석(PRESENT)이면 멘토라도 다시 기록하지 않는다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveMentoringEntry({
        applicationId: 1,
        entry: { ...baseEntry, myRole: 'MENTOR', mentorStatus: 'PRESENT' },
      }),
    );

    await act(async () => {
      await result.current.enter();
    });

    expect(updateAttendanceMutate).not.toHaveBeenCalled();
  });

  it('헬스체크 실패 시 인라인을 열지 않는다', async () => {
    ensureMock.mockResolvedValue({ ok: false, reason: 'no-healthy-domain' });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() =>
      useLiveMentoringEntry({ applicationId: 1, entry: baseEntry }),
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
    updateAttendanceMutate.mockRejectedValueOnce(new Error('boom'));
    const { result } = renderHook(() =>
      useLiveMentoringEntry({
        applicationId: 1,
        entry: { ...baseEntry, myRole: 'MENTOR' },
      }),
    );

    await act(async () => {
      await result.current.enter();
    });

    await waitFor(() => expect(result.current.isOpen).toBe(true));
  });

  it('회의실 base 등록은 서버가 만든 방 이름을 그대로 받아 쓴다', async () => {
    ensureMock.mockResolvedValue({ ok: true });
    const { result } = renderHook(() =>
      useLiveMentoringEntry({ applicationId: 1, entry: baseEntry }),
    );

    await act(async () => {
      await result.current.registerBaseUrl('https://meet.test/');
    });

    expect(createMeetingRoomMutate).toHaveBeenCalledWith('https://meet.test/');
  });
});
