import { describe, expect, it } from 'vitest';
import {
  INITIAL_FILTER,
  buildListParams,
  buildLiveMentoringListParams,
  includesChallenge,
  includesLiveMentoring,
  type ReservationFilterState,
} from './buildListParams';

const make = (
  overrides: Partial<ReservationFilterState>,
): ReservationFilterState => ({ ...INITIAL_FILTER, ...overrides });

describe('buildListParams', () => {
  it('빈 필터는 빈 파라미터를 반환한다', () => {
    expect(buildListParams(INITIAL_FILTER)).toEqual({});
  });

  it('챌린지/멘토 id 를 배열 파라미터로 매핑한다', () => {
    const params = buildListParams(make({ challengeId: '2', mentorId: '101' }));
    expect(params.challengeIdList).toEqual([2]);
    expect(params.mentorIdList).toEqual([101]);
  });

  it('예약 날짜 범위를 해당 일의 시작/끝 LocalDateTime 으로 변환한다', () => {
    const params = buildListParams(
      make({ feedbackStartDate: '2026-05-01', feedbackEndDate: '2026-05-31' }),
    );
    expect(params.feedbackStartDate).toBe('2026-05-01T00:00:00');
    expect(params.feedbackEndDate).toBe('2026-05-31T23:59:59');
  });

  it('신청 날짜 범위를 변환한다', () => {
    const params = buildListParams(
      make({ createStartDate: '2026-04-01', createEndDate: '2026-04-30' }),
    );
    expect(params.createStartDate).toBe('2026-04-01T00:00:00');
    expect(params.createEndDate).toBe('2026-04-30T23:59:59');
  });

  it('멘티 이름은 API 파라미터(menteeIdList)로 매핑하지 않는다(클라이언트 필터)', () => {
    const params = buildListParams(make({ menteeName: '홍길동' }));
    expect(params.menteeIdList).toBeUndefined();
    expect(params).toEqual({});
  });
});

describe('유형 필터', () => {
  it('기본 유형은 전체다', () => {
    expect(INITIAL_FILTER.type).toBe('ALL');
  });

  it('전체는 두 유형을 모두 조회한다', () => {
    expect(includesChallenge('ALL')).toBe(true);
    expect(includesLiveMentoring('ALL')).toBe(true);
  });

  it('유형을 고르면 그쪽만 조회한다', () => {
    expect(includesChallenge('CHALLENGE')).toBe(true);
    expect(includesLiveMentoring('CHALLENGE')).toBe(false);
    expect(includesChallenge('LIVE_MENTORING')).toBe(false);
    expect(includesLiveMentoring('LIVE_MENTORING')).toBe(true);
  });

  it('유형이 1대1이면 프로그램명이 남아 있어도 challengeIdList 를 보내지 않는다', () => {
    const params = buildListParams(
      make({ type: 'LIVE_MENTORING', challengeId: '2' }),
    );
    expect(params.challengeIdList).toBeUndefined();
  });
});

describe('buildLiveMentoringListParams', () => {
  it('빈 필터는 빈 파라미터를 반환한다', () => {
    expect(buildLiveMentoringListParams(INITIAL_FILTER)).toEqual({});
  });

  it('멘토는 단일 id 로, 예약 날짜는 reservation* 이름으로 매핑한다', () => {
    const params = buildLiveMentoringListParams(
      make({
        mentorId: '101',
        feedbackStartDate: '2026-05-01',
        feedbackEndDate: '2026-05-31',
      }),
    );
    expect(params.mentorId).toBe(101);
    expect(params.reservationStartDate).toBe('2026-05-01T00:00:00');
    expect(params.reservationEndDate).toBe('2026-05-31T23:59:59');
  });

  it('신청 날짜 범위를 변환한다', () => {
    const params = buildLiveMentoringListParams(
      make({ createStartDate: '2026-04-01', createEndDate: '2026-04-30' }),
    );
    expect(params.createStartDate).toBe('2026-04-01T00:00:00');
    expect(params.createEndDate).toBe('2026-04-30T23:59:59');
  });

  // 챌린지 쪽이 이름 부분 일치 클라이언트 필터라, 한 표에 섞으면 규칙이 같아야 한다.
  it('멘티 이름과 프로그램명은 서버 파라미터로 보내지 않는다', () => {
    const params = buildLiveMentoringListParams(
      make({ menteeName: '홍길동', challengeId: '2' }),
    );
    expect(params).toEqual({});
  });
});
