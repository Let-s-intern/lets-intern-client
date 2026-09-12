import type { CareerGrowthItem } from './careerGrowth';
import { toCareerGrowthCardConfigs } from './careerGrowthCard';

function makeItem(overrides: Partial<CareerGrowthItem> = {}): CareerGrowthItem {
  return {
    id: 27,
    programId: 5,
    thumbnail: '',
    status: '참여예정',
    programType: 'LIVE 멘토링',
    programTypeKey: 'LIVE_MENTORING',
    programStatusType: 'PREV',
    startDate: '26.09.12',
    endDate: '26.09.12',
    createDate: '26.09.11',
    title: 'QA 멘토링',
    description: '',
    purchasePlan: '',
    contentUrl: '',
    contentFileUrl: '',
    isDownloaded: false,
    chatLink: '',
    chatPassword: '',
    ...overrides,
  };
}

/*
  LC-3301 — 멘토링 칩은 프로그램 칩에서 멘토링만 거른 목록이다. 같은 카드로 그려야
  두 칩에서 같은 신청이 똑같이 보인다.
*/
describe('toCareerGrowthCardConfigs — 멘토링 칩', () => {
  it('멘토링 칩은 프로그램 칩과 같은 카드 설정을 만든다', () => {
    const items = [makeItem()];
    expect(toCareerGrowthCardConfigs(items, 'MENTORING')).toEqual(
      toCareerGrowthCardConfigs(items, 'PROGRAM'),
    );
    expect(toCareerGrowthCardConfigs(items, 'MENTORING')).toHaveLength(1);
  });
});
