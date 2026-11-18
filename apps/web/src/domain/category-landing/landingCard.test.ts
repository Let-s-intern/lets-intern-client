import { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { getSectionEyebrow, getSectionKind } from './landingCard';

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
