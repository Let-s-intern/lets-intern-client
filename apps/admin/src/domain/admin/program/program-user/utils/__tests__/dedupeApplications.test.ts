import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';

import type {
  ChallengeApplication,
  GuidebookApplication,
  LiveApplication,
  VodApplication,
} from '@/schema';

import {
  dedupeChallengeApplications,
  dedupeFlatApplications,
} from '../dedupeApplications';

const makeChallenge = (id: number, name: string): ChallengeApplication =>
  ({
    application: {
      id,
      name,
      createDate: dayjs('2026-01-01T00:00:00Z'),
    },
    optionPriceSum: 0,
    optionDiscountPriceSum: 0,
  }) as unknown as ChallengeApplication;

const makeLive = (id: number, name: string): LiveApplication =>
  ({
    id,
    name,
    created_date: dayjs('2026-01-01T00:00:00Z'),
  }) as unknown as LiveApplication;

const makeGuidebook = (id: number, name: string): GuidebookApplication =>
  ({
    id,
    name,
    createDate: dayjs('2026-01-01T00:00:00Z'),
    downloadedAt: null,
  }) as unknown as GuidebookApplication;

const makeVod = (id: number, name: string): VodApplication =>
  ({
    id,
    name,
    createDate: dayjs('2026-01-01T00:00:00Z'),
    downloadedAt: null,
  }) as unknown as VodApplication;

describe('dedupeChallengeApplications', () => {
  it('동일한 application.id가 중복으로 포함되면 첫 번째 항목만 남긴다', () => {
    const list = [
      makeChallenge(1, '홍길동'),
      makeChallenge(2, '김철수'),
      makeChallenge(1, '홍길동(중복)'),
    ];

    const result = dedupeChallengeApplications(list);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.application.id)).toEqual([1, 2]);
    expect(result[0].application.name).toBe('홍길동');
  });

  it('중복이 없으면 입력 순서를 그대로 유지한다', () => {
    const list = [
      makeChallenge(10, 'A'),
      makeChallenge(20, 'B'),
      makeChallenge(30, 'C'),
    ];

    const result = dedupeChallengeApplications(list);

    expect(result.map((item) => item.application.id)).toEqual([10, 20, 30]);
  });

  it('빈 배열은 빈 배열을 반환한다', () => {
    expect(dedupeChallengeApplications([])).toEqual([]);
  });
});

describe('dedupeFlatApplications', () => {
  it('LIVE: 동일 id가 중복되면 첫 번째만 남긴다', () => {
    const list = [makeLive(1, 'A'), makeLive(1, 'A-dup'), makeLive(2, 'B')];

    const result = dedupeFlatApplications(list);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.id)).toEqual([1, 2]);
  });

  it('GUIDEBOOK: 동일 id가 중복되면 첫 번째만 남긴다', () => {
    const list = [
      makeGuidebook(1, 'A'),
      makeGuidebook(2, 'B'),
      makeGuidebook(2, 'B-dup'),
    ];

    const result = dedupeFlatApplications(list);

    expect(result.map((item) => item.id)).toEqual([1, 2]);
  });

  it('VOD: 동일 id가 중복되면 첫 번째만 남긴다', () => {
    const list = [makeVod(1, 'A'), makeVod(1, 'A-dup')];

    const result = dedupeFlatApplications(list);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});
