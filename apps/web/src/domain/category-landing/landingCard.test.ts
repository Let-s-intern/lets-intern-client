import { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import {
  getChallengeDisplayTitle,
  getSectionEyebrow,
  getSectionKind,
} from './landingCard';

const target = (
  targetType: ProgramCategoryTarget['targetType'],
): ProgramCategoryTarget => ({
  targetType,
  targetId: 1,
  title: 't',
  categoryIds: [1],
});

describe('랜딩 섹션 모양', () => {
  it('한 유형만 있으면 그 유형 전용 카드, 섞이면 일반 카드', () => {
    expect(getSectionKind([target('CHALLENGE')])).toBe('challenge');
    expect(getSectionKind([target('LIVE_MENTORING')])).toBe('mentoring');
    expect(getSectionKind([target('BLOG'), target('BLOG')])).toBe('blog');
    expect(getSectionKind([target('CHALLENGE'), target('VOD')])).toBe(
      'program',
    );
  });

  it('LIVE 와 VOD 가 섞이면 "LIVE · VOD 클래스"', () => {
    expect(getSectionEyebrow([target('LIVE'), target('VOD')])).toBe(
      'LIVE · VOD 클래스',
    );
    expect(getSectionEyebrow([target('MAGNET')])).toBe('무료 자료집');
  });
});

describe('챌린지 카드 제목', () => {
  it('앞의 [버전] 과 뒤의 기수를 뗀다', () => {
    expect(
      getChallengeDisplayTitle(
        '[인턴·실무 경험자 Ver.] 포트폴리오 1주 완성 챌린지 58기 (QA 버전 없음)',
      ),
    ).toBe('포트폴리오 1주 완성 챌린지');
    expect(getChallengeDisplayTitle('기필코 이력서 완성 챌린지 12기')).toBe(
      '기필코 이력서 완성 챌린지',
    );
    expect(getChallengeDisplayTitle('경험정리 챌린지')).toBe('경험정리 챌린지');
  });
});
