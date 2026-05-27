/**
 * Push 1 / 1.2.T1 — 라이브 피드백 모듈 스모크 + mock import 0 회귀 가드.
 *
 * 목적:
 *  - 라이브 피드백 코드가 모노레포 alias 로 정상 import 되는지 검증.
 *  - 라이브 캘린더가 실 API 파생으로 전환되어 liveFeedbackMock 모듈이 삭제됨 →
 *    더 이상 import 되지 않음을 확인 (mock import 0 회귀 가드).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCHEDULE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('live-mentoring imports', () => {
  it('SchedulePage 는 LIVE_FEEDBACK_MOCK_DATA / liveFeedbackMock 을 import 하지 않는다', () => {
    const src = readFileSync(
      path.join(SCHEDULE_DIR, 'SchedulePage.tsx'),
      'utf-8',
    );
    expect(src).not.toContain('LIVE_FEEDBACK_MOCK_DATA');
    expect(src).not.toContain('liveFeedbackMock');
  });

  it('useLiveFeedbackData 훅은 liveFeedbackMock 을 import 하지 않는다', () => {
    const src = readFileSync(
      path.join(SCHEDULE_DIR, 'hooks/useLiveFeedbackData.ts'),
      'utf-8',
    );
    expect(src).not.toContain('LIVE_FEEDBACK_MOCK_DATA');
    expect(src).not.toContain('liveFeedbackMock');
  });

  it('SchedulePage 는 서면 mock(useWrittenFeedbackMockData)을 import 하지 않는다', () => {
    const src = readFileSync(
      path.join(SCHEDULE_DIR, 'SchedulePage.tsx'),
      'utf-8',
    );
    expect(src).not.toContain('useWrittenFeedbackMockData');
    expect(src).not.toContain('WRITTEN_FEEDBACK_MOCK_DATA');
  });

  it('FeedbackSummary 는 서면 mock 을 import 하지 않는다', () => {
    const src = readFileSync(
      path.join(SCHEDULE_DIR, '../feedback-management/ui/FeedbackSummary.tsx'),
      'utf-8',
    );
    expect(src).not.toContain('useWrittenFeedbackMockData');
  });

  it('라이브 피드백 데이터 훅이 import 된다', async () => {
    const mod = await import('../hooks/useLiveFeedbackData');
    expect(typeof mod.useLiveFeedbackData).toBe('function');
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
