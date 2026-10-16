import { ActiveChallengeType } from '@/schema';

import {
  getActiveChallengePathname,
  getActiveChallengeTag,
  isActiveChallengeSelected,
  sortActiveChallenges,
} from './activeChallengeRadio';

const item = (
  override: Partial<ActiveChallengeType> = {},
): ActiveChallengeType => ({
  id: 10,
  title: '마케팅 챌린지',
  beginning: '2026-10-01T00:00:00',
  deadline: '2026-10-05T00:00:00',
  startDate: '2026-10-06T00:00:00',
  endDate: '2026-10-20T00:00:00',
  challengeVersionId: null,
  versionTitle: null,
  programTitle: null,
  ...override,
});

describe('isActiveChallengeSelected', () => {
  it('챌린지 id 와 버전 id 가 모두 같아야 선택이다', () => {
    const a = item({ challengeVersionId: 1 });
    const b = item({ challengeVersionId: 2 });

    expect(isActiveChallengeSelected(a, 10, 1)).toBe(true);
    expect(isActiveChallengeSelected(b, 10, 1)).toBe(false);
    expect(isActiveChallengeSelected(a, 11, 1)).toBe(false);
  });

  it('버전 없는 챌린지는 버전 id null 끼리 같다(undefined 도 null 로 본다)', () => {
    expect(isActiveChallengeSelected(item(), 10, null)).toBe(true);
    expect(
      isActiveChallengeSelected(
        item({ challengeVersionId: undefined }),
        10,
        null,
      ),
    ).toBe(true);
    expect(
      isActiveChallengeSelected(item({ challengeVersionId: 1 }), 10, null),
    ).toBe(false);
  });
});

describe('getActiveChallengeTag', () => {
  it('versionTitle 이 있으면 그 값', () => {
    expect(
      getActiveChallengeTag(
        item({ title: '[경력자] 마케팅', versionTitle: '무경력자' }),
      ),
    ).toBe('무경력자');
  });

  it('versionTitle 이 없으면 제목 대괄호 fallback', () => {
    expect(getActiveChallengeTag(item({ title: '[경력자] 마케팅' }))).toBe(
      '경력자',
    );
    expect(getActiveChallengeTag(item())).toBeNull();
  });
});

describe('sortActiveChallenges', () => {
  it('startDate 순, 같은 날이면 서버 순서(sortOrder)를 유지하고 원본은 그대로', () => {
    const late = item({ id: 1, startDate: '2026-10-10T00:00:00' });
    const sameDayFirst = item({ id: 2, challengeVersionId: 5 });
    const sameDaySecond = item({ id: 2, challengeVersionId: 4 });
    const list = [late, sameDayFirst, sameDaySecond];

    expect(sortActiveChallenges(list)).toEqual([
      sameDayFirst,
      sameDaySecond,
      late,
    ]);
    expect(list[0]).toBe(late);
  });
});

describe('getActiveChallengePathname', () => {
  it('버전 항목은 버전 노출 제목 slug 와 version 파라미터', () => {
    expect(
      getActiveChallengePathname(
        item({ challengeVersionId: 3, programTitle: '무경력자 챌린지' }),
      ),
    ).toBe(
      `/program/challenge/10/${encodeURIComponent('무경력자-챌린지')}?version=3`,
    );
  });

  it('버전 없는 항목은 챌린지 제목 slug', () => {
    expect(getActiveChallengePathname(item())).toBe(
      `/program/challenge/10/${encodeURIComponent('마케팅-챌린지')}`,
    );
  });
});
