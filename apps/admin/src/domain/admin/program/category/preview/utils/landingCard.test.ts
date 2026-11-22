import dayjs from '@/lib/dayjs';
import { describe, expect, it } from 'vitest';
import {
  getChallengeDisplayTitle,
  getSectionEyebrow,
  getSectionKind,
  isClosingSoon,
} from './landingCard';

const of = (...types: string[]) => types.map((targetType) => ({ targetType }));

describe('getSectionKind (웹과 같은 기준)', () => {
  it('정한 표시 방식은 그대로', () => {
    expect(getSectionKind(of('LIVE_MENTORING'), 'BLOG')).toBe('blog');
    expect(getSectionKind(of('LIVE'), 'FEATURED')).toBe('challenge');
  });
  it('카드 목록은 대표 카드가 되지 않고, 멘토링만·블로그만이면 전용 카드', () => {
    expect(getSectionKind(of('CHALLENGE'), 'CARDS')).toBe('program');
    expect(getSectionKind(of('LIVE_MENTORING'), 'CARDS')).toBe('mentoring');
    expect(getSectionKind(of('BLOG', 'BLOG'), 'CARDS')).toBe('blog');
    expect(getSectionKind(of('BLOG', 'LIVE'), 'CARDS')).toBe('program');
  });
  it('자동이면 한 유형일 때만 그 유형 모양', () => {
    expect(getSectionKind(of('CHALLENGE', 'CHALLENGE'), 'AUTO')).toBe(
      'challenge',
    );
    expect(getSectionKind(of('LIVE_MENTORING'), null)).toBe('mentoring');
    expect(getSectionKind(of('BLOG'), 'AUTO')).toBe('blog');
    expect(getSectionKind(of('CHALLENGE', 'LIVE'), 'AUTO')).toBe('program');
  });
});

describe('getSectionEyebrow', () => {
  it('LIVE·VOD 는 묶고, 셋 이상이면 추천 프로그램', () => {
    expect(getSectionEyebrow(of('LIVE', 'VOD'))).toBe('LIVE · VOD 클래스');
    expect(getSectionEyebrow(of('LIVE', 'VOD', 'MAGNET'))).toBe(
      '추천 프로그램',
    );
    expect(getSectionEyebrow(of('CHALLENGE', 'LIVE'), 'challenge')).toBe(
      '챌린지',
    );
  });
});

describe('카드 문구', () => {
  it('챌린지 제목에서 버전·기수를 뗀다', () => {
    expect(getChallengeDisplayTitle('[인턴 Ver.] 포트폴리오 챌린지 58기')).toBe(
      '포트폴리오 챌린지',
    );
  });
  it('마감 72시간 안이면 마감 임박', () => {
    const now = dayjs('2026-11-19T00:00:00');
    const target = (deadline: string) => ({
      targetType: 'CHALLENGE',
      targetId: 1,
      title: 't',
      categoryIds: [],
      deadline,
    });
    expect(isClosingSoon(target('2026-11-21T00:00:00'), now)).toBe(true);
    expect(isClosingSoon(target('2026-11-25T00:00:00'), now)).toBe(false);
  });
});
