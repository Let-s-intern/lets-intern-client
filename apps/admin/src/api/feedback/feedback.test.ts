import { describe, expect, it } from 'vitest';

import {
  serializeFeedbackListParams,
  serializeMentorSlotParams,
} from './feedback';

describe('serializeFeedbackListParams', () => {
  it('빈 파라미터는 모두 생략한다', () => {
    expect(serializeFeedbackListParams({})).toEqual({});
  });

  it('빈 배열은 생략한다', () => {
    expect(
      serializeFeedbackListParams({
        challengeIdList: [],
        mentorIdList: [],
        menteeIdList: [],
      }),
    ).toEqual({});
  });

  it('값이 있는 배열·날짜만 직렬화한다', () => {
    const result = serializeFeedbackListParams({
      challengeIdList: [1, 2],
      mentorIdList: [],
      feedbackStartDate: '2026-06-01T00:00:00',
      feedbackEndDate: '2026-06-30T23:59:59',
      createStartDate: '',
    });
    expect(result).toEqual({
      challengeIdList: [1, 2],
      feedbackStartDate: '2026-06-01T00:00:00',
      feedbackEndDate: '2026-06-30T23:59:59',
    });
    expect(result).not.toHaveProperty('mentorIdList');
    expect(result).not.toHaveProperty('createStartDate');
  });

  it('모든 필터를 직렬화한다', () => {
    const result = serializeFeedbackListParams({
      challengeIdList: [1],
      mentorIdList: [2],
      menteeIdList: [3],
      feedbackStartDate: '2026-06-01T00:00:00',
      feedbackEndDate: '2026-06-30T23:59:59',
      createStartDate: '2026-05-01T00:00:00',
      createEndDate: '2026-05-31T23:59:59',
    });
    expect(Object.keys(result)).toHaveLength(7);
  });
});

describe('serializeMentorSlotParams', () => {
  it('빈 파라미터는 생략한다', () => {
    expect(serializeMentorSlotParams({})).toEqual({});
  });

  it('범위와 statusList 를 직렬화한다', () => {
    const result = serializeMentorSlotParams({
      startDate: '2026-06-01T00:00:00',
      endDate: '2026-06-07T23:59:59',
      statusList: ['OPEN', 'RESERVED'],
    });
    expect(result).toEqual({
      startDate: '2026-06-01T00:00:00',
      endDate: '2026-06-07T23:59:59',
      statusList: ['OPEN', 'RESERVED'],
    });
  });

  it('빈 statusList 는 생략한다', () => {
    const result = serializeMentorSlotParams({
      startDate: '2026-06-01T00:00:00',
      statusList: [],
    });
    expect(result).toEqual({ startDate: '2026-06-01T00:00:00' });
  });
});
