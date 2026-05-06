import { describe, expect, it } from 'vitest';

import {
  challengeApplicationsSchema,
  guidebookApplicationsSchema,
  liveApplicationsSchema,
  vodApplicationsSchema,
} from '@/schema';

import {
  dedupeChallengeApplications,
  dedupeFlatApplications,
} from '../dedupeApplications';

/**
 * `ProgramUsers.tsx`의 useQuery queryFn 흐름(schema.parse → dedupe)이
 * BE가 동일 application id 를 중복 반환하더라도 한 번만 노출시키는지를
 * programType별로 회귀 검증한다.
 */
describe('participants dedupe — schema.parse + dedupe 통합', () => {
  it('CHALLENGE: 같은 application.id가 중복 반환되어도 한 번만 노출', () => {
    const raw = {
      applicationList: [
        {
          application: {
            id: 100,
            name: '홍길동',
            createDate: '2026-04-01T00:00:00Z',
            isCanceled: false,
          },
          optionPriceSum: 0,
          optionDiscountPriceSum: 0,
        },
        {
          application: {
            id: 100,
            name: '홍길동',
            createDate: '2026-04-02T00:00:00Z',
            isCanceled: true,
          },
          optionPriceSum: 0,
          optionDiscountPriceSum: 0,
        },
        {
          application: {
            id: 200,
            name: '김철수',
            createDate: '2026-04-01T00:00:00Z',
            isCanceled: false,
          },
          optionPriceSum: 0,
          optionDiscountPriceSum: 0,
        },
      ],
    };

    const parsed = challengeApplicationsSchema.parse(raw).applicationList;
    const deduped = dedupeChallengeApplications(parsed);

    expect(parsed).toHaveLength(3);
    expect(deduped).toHaveLength(2);
    expect(deduped.map((item) => item.application.id)).toEqual([100, 200]);
  });

  it('LIVE: 같은 id가 중복 반환되어도 한 번만 노출', () => {
    const raw = {
      applicationList: [
        { id: 1, name: 'A', created_date: '2026-04-01T00:00:00Z' },
        { id: 1, name: 'A', created_date: '2026-04-02T00:00:00Z' },
        { id: 2, name: 'B', created_date: '2026-04-01T00:00:00Z' },
      ],
    };

    const parsed = liveApplicationsSchema.parse(raw).applicationList;
    const deduped = dedupeFlatApplications(parsed);

    expect(parsed).toHaveLength(3);
    expect(deduped).toHaveLength(2);
    expect(deduped.map((item) => item.id)).toEqual([1, 2]);
  });

  it('GUIDEBOOK: 같은 id가 중복 반환되어도 한 번만 노출', () => {
    const raw = {
      applicationList: [
        { id: 10, name: 'A', createDate: '2026-04-01T00:00:00Z' },
        { id: 11, name: 'B', createDate: '2026-04-01T00:00:00Z' },
        { id: 11, name: 'B-dup', createDate: '2026-04-02T00:00:00Z' },
      ],
    };

    const parsed = guidebookApplicationsSchema.parse(raw).applicationList;
    const deduped = dedupeFlatApplications(parsed);

    expect(deduped).toHaveLength(2);
    expect(deduped.map((item) => item.id)).toEqual([10, 11]);
  });

  it('VOD: 같은 id가 중복 반환되어도 한 번만 노출', () => {
    const raw = {
      applicationList: [
        { id: 5, name: 'A', createDate: '2026-04-01T00:00:00Z' },
        { id: 5, name: 'A', createDate: '2026-04-01T00:00:00Z' },
      ],
    };

    const parsed = vodApplicationsSchema.parse(raw).applicationList;
    const deduped = dedupeFlatApplications(parsed);

    expect(deduped).toHaveLength(1);
    expect(deduped[0].id).toBe(5);
  });
});
