import { getProgramCardKey, getProgramCardLink } from './programCardIdentity';

const versionCard = (challengeVersionId: number, title: string) => ({
  id: 10,
  programType: 'CHALLENGE' as const,
  title,
  challengeVersionId,
});

describe('programCardIdentity', () => {
  it('같은 챌린지의 버전 카드 2장은 key 가 다르다', () => {
    const a = versionCard(1, '[무경력자] 마케팅 챌린지');
    const b = versionCard(2, '[경력자] 마케팅 챌린지');

    expect(getProgramCardKey(a)).toBe('CHALLENGE-10-1');
    expect(getProgramCardKey(b)).toBe('CHALLENGE-10-2');
  });

  it('같은 챌린지의 버전 카드 2장은 링크가 각 버전 상세다', () => {
    expect(getProgramCardLink(versionCard(1, '무경력자 챌린지'))).toBe(
      `/program/challenge/10/${encodeURIComponent('무경력자-챌린지')}?version=1`,
    );
    expect(getProgramCardLink(versionCard(2, '경력자 챌린지'))).toBe(
      `/program/challenge/10/${encodeURIComponent('경력자-챌린지')}?version=2`,
    );
  });

  it('버전 없는 프로그램은 기존 id 경로 그대로다', () => {
    const live = {
      id: 5,
      programType: 'LIVE' as const,
      title: '라이브',
      challengeVersionId: null,
    };

    expect(getProgramCardLink(live)).toBe('/program/live/5');
    expect(getProgramCardKey(live)).toBe('LIVE-5-');
  });
});
