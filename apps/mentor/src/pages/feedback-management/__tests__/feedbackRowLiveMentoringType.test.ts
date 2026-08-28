/**
 * `FeedbackRow` 에 1대1 라이브 멘토링이 더해진 계약을 고정한다.
 *
 * 이 앱의 `tsconfig.json` 은 `src/**\/__tests__/**` 를 `tsc` 대상에서 제외한다.
 * 그래서 테스트 파일 안의 타입 단언(`expectTypeOf` 등)은 아무것도 검증하지 못한다 —
 * 대신 훅이 **실제로 만든 행**의 키 집합과 값으로 계약을 확인한다. `FeedbackRow` 에
 * 필드가 늘었는데 1대1 분기가 채우지 않으면 키 비교에서 걸린다.
 */
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { LiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';

import { useMergedFeedbackRows } from '../hooks/useMergedFeedbackRows';

vi.mock('@/pages/schedule/constants/mockNow', () => ({
  currentNow: () => new Date('2026-05-04T09:45:00'),
  MOCK_NOW: '2026-05-04T09:45:00',
}));

/** 표가 읽는 `FeedbackRow` 의 전체 키. 하나라도 빠지면 컬럼이 비어 렌더된다. */
const FEEDBACK_ROW_KEYS = [
  'canOpenDetail',
  'challengeTitle',
  'detailDisabledReason',
  'endTime',
  'id',
  'menteeNameLabel',
  'menteeParticipation',
  'mentorParticipation',
  'reservationLabel',
  'scheduleLabel',
  'startDate',
  'startTime',
  'statusLabel',
  'statusTone',
  'submissionLabel',
  'thLabel',
  'type',
];

const RESERVATION: LiveMentoringReservation = {
  applicationId: 91001,
  menteeId: 51001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-05-04T14:00:00',
  reservationEndAt: '2026-05-04T15:00:00',
  status: 'CONFIRMED',
  questionWritten: true,
  attachmentSubmitted: false,
  createDate: '2026-05-01T09:00:00',
};

const renderRow = () =>
  renderHook(() =>
    useMergedFeedbackRows([], [], undefined, undefined, [RESERVATION]),
  ).result.current[0];

describe('FeedbackRow — 1대1 라이브 멘토링', () => {
  it('행이 FeedbackRow 의 모든 키를 채운다 (source 제외 없이)', () => {
    const row = renderRow();

    expect(Object.keys(row).sort()).toEqual(
      [...FEEDBACK_ROW_KEYS, 'source'].sort(),
    );
  });

  it("type 이 'live-mentoring' 이다", () => {
    expect(renderRow().type).toBe('live-mentoring');
  });

  it('source 가 원본 예약을 그대로 들고 있다 (질문 화면이 생기면 넘길 값)', () => {
    const { source } = renderRow();

    expect(source.type).toBe('live-mentoring');
    if (source.type !== 'live-mentoring') throw new Error('예상 밖 source');
    expect(source.reservation).toEqual(RESERVATION);
  });

  it("submissionLabel 이 '일부 제출' 을 낼 수 있다 (질문·파일 중 하나만)", () => {
    expect(renderRow().submissionLabel).toBe('일부 제출');
  });

  it('스키마가 맞지 않는 컬럼도 빈 값으로 두지 않는다', () => {
    const row = renderRow();

    expect(row.challengeTitle).toBe('1대1 라이브 멘토링');
    expect(row.thLabel).toBe('해당 없음');
  });

  it('상세를 열 수 있고, 잠긴 이유가 남아 있지 않다', () => {
    const row = renderRow();

    expect(row.canOpenDetail).toBe(true);
    expect(row.detailDisabledReason).toBeNull();
  });
});
