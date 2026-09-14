import type { MypageApplication } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { toCareerGrowthItems } from './careerGrowth';

function makeApplication(
  overrides: Partial<MypageApplication> = {},
): MypageApplication {
  return {
    id: 30,
    programId: 400,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    programTitle: 'QA 챌린지',
    programShortDesc: '',
    programThumbnail: '',
    programStartDate: dayjs('2026-09-13'),
    programEndDate: dayjs('2026-10-14'),
    createDate: dayjs('2026-09-12'),
    pricePlanType: 'BASIC',
    canUpgradePlan: true,
    ...overrides,
  } as MypageApplication;
}

describe('toCareerGrowthItems — 플랜 업그레이드 (LC-3247)', () => {
  it('마이페이지 카드와 같은 규칙으로 업그레이드 주소를 채운다', () => {
    const [item] = toCareerGrowthItems([makeApplication()]);

    expect(item.planUpgradeHref).toBe('/plan-upgrade/30');
  });

  it('서버가 불가라고 하면 업그레이드 주소를 두지 않는다', () => {
    const [item] = toCareerGrowthItems([
      makeApplication({ canUpgradePlan: false }),
    ]);

    expect(item.planUpgradeHref).toBeUndefined();
  });

  it('LIGHT 와 챌린지가 아닌 신청에는 업그레이드를 두지 않는다', () => {
    const [light, live] = toCareerGrowthItems([
      makeApplication({ id: 31, pricePlanType: 'LIGHT' }),
      makeApplication({ id: 32, programType: 'LIVE' }),
    ]);

    expect(light.planUpgradeHref).toBeUndefined();
    expect(live.planUpgradeHref).toBeUndefined();
  });
});
