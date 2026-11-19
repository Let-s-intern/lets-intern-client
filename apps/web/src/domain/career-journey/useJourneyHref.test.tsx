import { renderHook } from '@testing-library/react';

const mockGroups = jest.fn();
const mockMenu = jest.fn();
jest.mock('@/api/program-category/programCategory', () => ({
  useFilterProgramCategoryGroupsQuery: () => ({ data: mockGroups() }),
  useLandingMenuQuery: () => ({ data: mockMenu() }),
}));

import { getTargetHref } from './journeyNav';
import { useJourneyHrefMap } from './useJourneyHref';

describe('useJourneyHrefMap', () => {
  it('노출 분류를 받기 전에는 모든 메뉴가 랜딩으로 간다', () => {
    mockGroups.mockReturnValue(undefined);
    const { result } = renderHook(() => useJourneyHrefMap());
    expect(result.current.resume).toBe('/category/resume');
    expect(result.current['large-corp']).toBe('/category/large-corp');
  });

  it('어드민이 바로 갈 상품을 지정한 카테고리만 상세로 간다', () => {
    mockGroups.mockReturnValue([
      {
        id: 1,
        title: '직무특화',
        categoryList: [
          {
            id: 10,
            title: 'HR',
            slug: 'hr',
            directTargetType: 'CHALLENGE',
            directTargetId: 437,
          },
          {
            id: 11,
            title: '마케팅',
            slug: 'marketing',
            directTargetType: null,
            directTargetId: null,
          },
        ],
      },
    ]);
    const { result } = renderHook(() => useJourneyHrefMap());
    expect(result.current.hr).toBe('/program/challenge/437');
    expect(result.current.marketing).toBe('/category/marketing');
  });
});

describe('getTargetHref', () => {
  it('제목이 필요한 상세는 제목 조각을 붙이고, 모르면 detail 을 쓴다', () => {
    expect(getTargetHref('MAGNET', 5, { title: '이력서 템플릿' })).toBe(
      '/library/5/%EC%9D%B4%EB%A0%A5%EC%84%9C-%ED%85%9C%ED%94%8C%EB%A6%BF',
    );
    expect(getTargetHref('GUIDEBOOK', 2)).toBe('/program/guidebook/2/detail');
  });

  it('1:1 LIVE 멘토링은 멘토 id 가 있어야 상세로 간다', () => {
    expect(getTargetHref('LIVE_MENTORING', 4, { mentorId: 8 })).toBe(
      '/live-mentoring/8',
    );
    expect(getTargetHref('LIVE_MENTORING', 4)).toBe(
      '/program?catalog=mentoring',
    );
  });

  it('어드민 메뉴에만 있는 새 랜딩도 주소를 갖고, 고정 메뉴 slug 도 남는다', () => {
    mockGroups.mockReturnValue([]);
    mockMenu.mockReturnValue([
      {
        slug: 'new-landing',
        menuGroup: '신규',
        menuLabel: '새 랜딩',
        menuOrder: 1,
      },
    ]);
    const { result } = renderHook(() => useJourneyHrefMap());
    expect(result.current['new-landing']).toBe('/category/new-landing');
    expect(result.current.resume).toBe('/category/resume');
    mockMenu.mockReset();
  });
});
