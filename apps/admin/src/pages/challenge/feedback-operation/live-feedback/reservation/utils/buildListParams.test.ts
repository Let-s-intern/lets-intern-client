import { describe, expect, it } from 'vitest';
import {
  INITIAL_FILTER,
  buildListParams,
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
