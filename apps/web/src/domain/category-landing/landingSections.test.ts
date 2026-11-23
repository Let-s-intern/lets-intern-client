import type {
  CategoryLandingData,
  ProgramCategoryTarget,
  PublicProgramCategoryGroup,
} from '@/api/program-category/programCategory';
import { landingSectionsOf } from './landingSections';

const target = (id: number, categoryIds: number[]): ProgramCategoryTarget => ({
  targetType: 'CHALLENGE',
  targetId: id,
  title: `상품${id}`,
  categoryIds,
});

describe('landingSectionsOf', () => {
  it('새 분류 랜딩이 있으면 서버가 푼 섹션을 쓰고, 빈 섹션은 숨긴다', () => {
    const landing: CategoryLandingData = {
      page: { id: 10, title: '이력서', slug: 'resume' },
      sectionList: [
        {
          id: 1,
          title: '대표 챌린지',
          displayType: 'FEATURED',
          targetList: [target(7, [10])],
        },
        { id: 2, title: '블로그', displayType: 'CARDS', targetList: [] },
      ],
    };
    expect(
      landingSectionsOf({
        landing,
        group: undefined,
        groupTargets: [],
        content: undefined,
      }),
    ).toEqual([
      {
        id: 1,
        title: '대표 챌린지',
        description: undefined,
        displayType: 'FEATURED',
        targets: [target(7, [10])],
      },
    ]);
  });

  it('새 랜딩이 없으면 예전 노출 목록의 카테고리를 섹션으로, 설명은 어드민 값 → 고정 문구', () => {
    const group: PublicProgramCategoryGroup = {
      id: 3,
      title: '이력서 랜딩',
      categoryList: [
        { id: 30, title: '챌린지', slug: 'resume-challenge' },
        { id: 31, title: '클래스', description: '어드민 설명' },
        { id: 32, title: '비어 있음' },
      ],
    };
    const sections = landingSectionsOf({
      landing: null,
      group,
      groupTargets: [target(1, [30]), target(2, [31])],
      content: {
        heroTitle: '',
        heroDescription: '',
        sectionDescriptions: { 'resume-challenge': '고정 설명' },
      },
    });
    expect(
      sections.map((s) => [s.id, s.description, s.targets.length]),
    ).toEqual([
      [30, '고정 설명', 1],
      [31, '어드민 설명', 1],
    ]);
  });

  it('끝난 LIVE 클래스는 숨기고, 다 숨겨진 섹션도 숨긴다', () => {
    const live = (id: number, endDate: string): ProgramCategoryTarget => ({
      targetType: 'LIVE',
      targetId: id,
      title: `라이브${id}`,
      categoryIds: [],
      endDate,
    });
    const landing: CategoryLandingData = {
      page: { id: 10, title: '포트폴리오', slug: 'portfolio' },
      sectionList: [
        {
          id: 1,
          title: '클래스',
          displayType: 'CARDS',
          targetList: [
            live(102, '2026-08-08T20:00:00'),
            target(7, []),
            live(123, '2026-11-28T21:00:00'),
          ],
        },
        {
          id: 2,
          title: '끝난 클래스만',
          displayType: 'CARDS',
          targetList: [live(108, '2026-09-09T20:00:00')],
        },
      ],
    };
    const sections = landingSectionsOf({
      landing,
      group: undefined,
      groupTargets: [],
      content: undefined,
      now: new Date('2026-11-23T12:00:00'),
    });
    expect(sections.map((s) => s.id)).toEqual([1]);
    expect(sections[0].targets.map((t) => t.targetId)).toEqual([7, 123]);
  });
});
