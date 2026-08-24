import { describe, expect, expectTypeOf, it } from 'vitest';

import type { LiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';

import type { FeedbackRow } from '../types';

/**
 * `FeedbackRow` 에 1대1 라이브 멘토링이 더해진 계약을 고정한다.
 *
 * 표의 컬럼 값은 이 타입의 필드가 전부라, 여기서 계약이 흔들리면 화면에 빈 칸이 생긴다.
 * 타입 수준 단언(컴파일)과 값 수준 단언(런타임)을 함께 둔다.
 */
const RESERVATION: LiveMentoringReservation = {
  applicationId: 91001,
  menteeId: 51001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-08-26T14:00:00',
  reservationEndAt: '2026-08-26T15:00:00',
  status: 'CONFIRMED',
  questionWritten: true,
  attachmentSubmitted: false,
  createDate: '2026-08-20T09:00:00',
};

const ROW: FeedbackRow = {
  id: `live-mentoring-${RESERVATION.applicationId}`,
  type: 'live-mentoring',
  startDate: '2026-08-26',
  startTime: '14:00',
  endTime: '15:00',
  statusLabel: '진행 예정',
  statusTone: 'liveWaiting',
  reservationLabel: '예약 완료',
  submissionLabel: '일부 제출',
  menteeParticipation: null,
  mentorParticipation: null,
  challengeTitle: '1대1 라이브 멘토링',
  thLabel: '해당 없음',
  scheduleLabel: '2026.08.26 14:00 ~ 15:00',
  menteeNameLabel: '김일대',
  canOpenDetail: false,
  detailDisabledReason: '멘티 질문·전달 파일을 여는 화면이 아직 없습니다.',
  source: { type: 'live-mentoring', reservation: RESERVATION },
};

describe('FeedbackRow — 1대1 라이브 멘토링', () => {
  it("type 에 'live-mentoring' 이 있다", () => {
    expectTypeOf<FeedbackRow['type']>().toEqualTypeOf<
      'written' | 'live' | 'live-mentoring'
    >();
  });

  it("submissionLabel 에 '일부 제출' 이 있다 (질문·파일 중 하나만 낸 경우)", () => {
    expectTypeOf<FeedbackRow['submissionLabel']>().toEqualTypeOf<
      '제출' | '일부 제출' | '지각 제출' | '미제출' | null
    >();
  });

  it('source 가 live-mentoring 이면 원본 예약으로 좁혀진다', () => {
    if (ROW.source.type !== 'live-mentoring') throw new Error('예상 밖 source');
    expectTypeOf(
      ROW.source.reservation,
    ).toEqualTypeOf<LiveMentoringReservation>();
    expect(ROW.source.reservation.applicationId).toBe(91001);
  });

  it('스키마가 맞지 않는 컬럼도 빈 값으로 두지 않는다', () => {
    expect(ROW.challengeTitle).toBe('1대1 라이브 멘토링');
    expect(ROW.thLabel).toBe('해당 없음');
    expect(ROW.submissionLabel).not.toBeNull();
  });

  it('상세는 잠기고, 왜 잠겼는지가 함께 실린다', () => {
    expect(ROW.canOpenDetail).toBe(false);
    expect(ROW.detailDisabledReason).toBeTruthy();
  });
});
