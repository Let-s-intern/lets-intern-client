import { JOURNEY_GROUPS } from './journeyNav';
import { buildJourneyGroups, findJourneyItem } from './landingMenu';

describe('buildJourneyGroups', () => {
  it('메뉴 값이 없거나 비면 고정 메뉴를 쓴다', () => {
    expect(buildJourneyGroups(undefined)).toBe(JOURNEY_GROUPS);
    expect(buildJourneyGroups([])).toBe(JOURNEY_GROUPS);
  });

  it('묶음 이름으로 묶고 순서대로 놓는다. 묶음 자리는 그 안의 가장 작은 순서', () => {
    const groups = buildJourneyGroups([
      {
        slug: 'portfolio',
        menuGroup: '서류 작성',
        menuLabel: '포트폴리오',
        menuOrder: 4,
      },
      {
        slug: 'experience',
        menuGroup: '경험정리',
        menuLabel: '경험정리',
        menuOrder: 1,
      },
      {
        slug: 'resume',
        menuGroup: '서류 작성',
        menuLabel: '이력서',
        menuOrder: 2,
      },
      {
        slug: 'interview',
        menuGroup: ' 면접 ',
        menuLabel: '면접',
        menuOrder: 7,
      },
    ]);
    expect(groups).toEqual([
      { label: '경험정리', items: [{ slug: 'experience', label: '경험정리' }] },
      {
        label: '서류 작성',
        items: [
          { slug: 'resume', label: '이력서' },
          { slug: 'portfolio', label: '포트폴리오' },
        ],
      },
      { label: '면접', items: [{ slug: 'interview', label: '면접' }] },
    ]);
  });

  it('묶음이 비면 제목 없는 묶음, 순서가 없으면 맨 뒤', () => {
    const groups = buildJourneyGroups([
      { slug: 'b', menuGroup: null, menuLabel: 'B', menuOrder: null },
      { slug: 'a', menuGroup: '', menuLabel: 'A', menuOrder: 1 },
    ]);
    expect(groups).toEqual([
      {
        label: null,
        items: [
          { slug: 'a', label: 'A' },
          { slug: 'b', label: 'B' },
        ],
      },
    ]);
  });

  it('지금 고정 메뉴와 같은 값을 넣으면 같은 메뉴가 된다', () => {
    let order = 0;
    const menuList = JOURNEY_GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        slug: item.slug,
        menuGroup: g.label,
        menuLabel: item.label,
        menuOrder: ++order,
      })),
    );
    expect(buildJourneyGroups(menuList)).toEqual(JOURNEY_GROUPS);
  });
});

describe('findJourneyItem', () => {
  it('브레드크럼용 묶음과 이름을 찾는다', () => {
    expect(findJourneyItem(JOURNEY_GROUPS, 'resume')).toEqual({
      groupLabel: '서류 작성',
      label: '이력서',
    });
    expect(findJourneyItem(JOURNEY_GROUPS, 'nope')).toBeNull();
  });
});
