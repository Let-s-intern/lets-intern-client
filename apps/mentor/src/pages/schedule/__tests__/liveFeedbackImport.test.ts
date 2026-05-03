/**
 * Push 1 / 1.2.T1, 1.4.T1 — 라이브 피드백 모듈 스모크 테스트
 *
 * 목적: v2.0 라이브 피드백 코드가 모노레포 alias 로 정상 import 되는지 검증.
 *       (BE 미연동이라 API 클라이언트는 없으나, mock 모듈을 동등 위치로 본다.)
 */
import { describe, it, expect } from 'vitest';

describe('live-mentoring imports', () => {
  it('mock 데이터 모듈이 import 된다', async () => {
    const { LIVE_FEEDBACK_MOCK_DATA } =
      await import('../challenge-content/liveFeedbackMock');
    expect(Array.isArray(LIVE_FEEDBACK_MOCK_DATA)).toBe(true);
    expect(LIVE_FEEDBACK_MOCK_DATA.length).toBeGreaterThan(0);
  });

  it('라이브 피드백 데이터 훅이 import 된다', async () => {
    const mod = await import('../hooks/useLiveFeedbackData');
    expect(typeof mod.useLiveFeedbackData).toBe('function');
  });

  it('서면 피드백 mock 훅이 import 된다', async () => {
    const mod = await import('../hooks/useWrittenFeedbackMockData');
    expect(typeof mod.useWrittenFeedbackMockData).toBe('function');
  });

  it('라이브 피드백 모달 컴포넌트가 import 된다', async () => {
    const Mod = await import('../modal/LiveFeedbackReservationModal');
    expect(typeof Mod.default).toBe('function');
  });

  it('멘토 일정 오픈 모달 컴포넌트가 import 된다', async () => {
    const Mod = await import('../modal/MentorOpenScheduleModal');
    expect(typeof Mod.default).toBe('function');
  });
});
