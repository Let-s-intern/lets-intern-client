import { ChallengeIdPrimitive } from '@/schema';

import {
  applyChallengeVersion,
  findChallengeVersion,
  resolveChallengeDetailRoute,
} from './challengeVersionRoute';

const versionA = {
  challengeVersionId: 11,
  title: '무경력자',
  sortOrder: 2,
  programTitle: '[무경력자] 마케팅 챌린지',
  shortDesc: 'A 설명',
  thumbnail: 'a.png',
  desktopThumbnail: 'a-desktop.png',
  description: '{"a":1}',
};
const versionB = {
  ...versionA,
  challengeVersionId: 12,
  title: '경력자',
  sortOrder: 1,
  programTitle: '[경력자] 마케팅 챌린지',
};
const versionList = [versionA, versionB];

const slugOf = (title: string) =>
  encodeURIComponent(title.replace(/[ /]/g, '-').toLowerCase());
const pathOf = (title: string, versionId?: number) =>
  `/program/challenge/5/${slugOf(title)}${versionId ? `?version=${versionId}` : ''}`;

describe('resolveChallengeDetailRoute', () => {
  it('E1: 버전 있는 챌린지를 version 없이 열면 sortOrder 첫 버전으로', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList,
        slug: '마케팅-챌린지',
        searchParams: {},
      }),
    ).toEqual({
      type: 'redirect',
      url: pathOf('[경력자] 마케팅 챌린지', 12),
    });
  });

  it('E1: slug 없는 경로(/program/challenge/{id})도 첫 버전으로', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList,
        searchParams: {},
      }),
    ).toEqual({
      type: 'redirect',
      url: pathOf('[경력자] 마케팅 챌린지', 12),
    });
  });

  it('E2: 다른 챌린지의 버전 id 면 첫 버전으로', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList,
        slug: slugOf('[무경력자] 마케팅 챌린지'),
        searchParams: { version: '999' },
      }),
    ).toEqual({
      type: 'redirect',
      url: pathOf('[경력자] 마케팅 챌린지', 12),
    });
  });

  it('E3: 버전 없는 챌린지에 version 이 붙으면 파라미터를 뗀다', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList: [],
        slug: '마케팅-챌린지',
        searchParams: { version: '11' },
      }),
    ).toEqual({ type: 'redirect', url: pathOf('마케팅 챌린지') });
  });

  it('버전 slug 가 버전 노출 제목과 다르면 같은 버전의 올바른 slug 로', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList,
        slug: '마케팅-챌린지',
        searchParams: { version: '11' },
      }),
    ).toEqual({
      type: 'redirect',
      url: pathOf('[무경력자] 마케팅 챌린지', 11),
    });
  });

  it('버전 없는 챌린지의 slug 불일치는 챌린지 제목 slug 로', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList: [],
        slug: 'old-title',
        searchParams: {},
      }),
    ).toEqual({ type: 'redirect', url: pathOf('마케팅 챌린지') });
  });

  it('리다이렉트할 때 utm 등 기존 쿼리를 보존한다', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList,
        searchParams: { utm_source: 'blog', tag: ['a', 'b'], version: '999' },
      }),
    ).toEqual({
      type: 'redirect',
      url: `${pathOf('[경력자] 마케팅 챌린지', 12)}&utm_source=blog&tag=a&tag=b`,
    });

    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList: [],
        slug: 'x',
        searchParams: { utm_source: 'blog', version: '1' },
      }),
    ).toEqual({
      type: 'redirect',
      url: `${pathOf('마케팅 챌린지')}?utm_source=blog`,
    });
  });

  it('버전 id 와 slug 가 맞으면 그 버전으로 렌더한다', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList,
        slug: slugOf('[무경력자] 마케팅 챌린지'),
        searchParams: { version: '11', utm_source: 'blog' },
      }),
    ).toEqual({ type: 'render', version: versionA });
  });

  it('버전 없는 챌린지는 slug 가 맞으면 버전 없이 렌더한다', () => {
    expect(
      resolveChallengeDetailRoute({
        challengeId: '5',
        challengeTitle: '마케팅 챌린지',
        versionList: [],
        slug: '마케팅-챌린지',
        searchParams: {},
      }),
    ).toEqual({ type: 'render', version: null });
  });
});

describe('findChallengeVersion', () => {
  it('소속 버전이면 그 버전, 아니면 null', () => {
    expect(findChallengeVersion(versionList, '12')).toBe(versionB);
    expect(findChallengeVersion(versionList, '999')).toBeNull();
    expect(findChallengeVersion(versionList, undefined)).toBeNull();
  });
});

describe('applyChallengeVersion', () => {
  const challenge = {
    title: '마케팅 챌린지',
    shortDesc: '챌린지 설명',
    desc: '{"c":1}',
    thumbnail: 'c.png',
    desktopThumbnail: 'c-desktop.png',
    challengeType: 'MARKETING',
    priceInfo: [],
    faqInfo: [],
    classificationInfo: [],
    versionList,
  } as unknown as ChallengeIdPrimitive;

  it('제목·한 줄 설명·썸네일·본문만 버전 값으로 덮는다', () => {
    const result = applyChallengeVersion(challenge, versionA);

    expect(result).toEqual({
      ...challenge,
      title: '[무경력자] 마케팅 챌린지',
      shortDesc: 'A 설명',
      thumbnail: 'a.png',
      desktopThumbnail: 'a-desktop.png',
      desc: '{"a":1}',
    });
    expect(challenge.title).toBe('마케팅 챌린지');
  });

  it('버전 값이 null 이면 챌린지 값을 쓴다', () => {
    const result = applyChallengeVersion(challenge, {
      ...versionA,
      programTitle: null,
      description: null,
    });

    expect(result.title).toBe('마케팅 챌린지');
    expect(result.desc).toBe('{"c":1}');
  });

  it('버전이 없으면 원본 그대로', () => {
    expect(applyChallengeVersion(challenge, null)).toBe(challenge);
  });
});
