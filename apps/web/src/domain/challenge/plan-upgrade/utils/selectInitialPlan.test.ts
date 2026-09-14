import { selectInitialPlan } from './selectInitialPlan';

const options = [
  { planType: 'STANDARD' as const },
  { planType: 'PREMIUM' as const },
];

describe('selectInitialPlan', () => {
  it('쿼리 플랜이 선택지에 있으면 그 플랜을 고른다', () => {
    expect(selectInitialPlan(options, 'STANDARD')).toBe('STANDARD');
  });

  it.each([
    ['쿼리가 없으면', null],
    ['쿼리가 선택지에 없으면', 'BASIC'],
    ['쿼리가 계약에 없는 값이면', 'unknown'],
  ])('%s 가장 높은 플랜인 마지막 선택지를 고른다', (_, planQuery) => {
    expect(selectInitialPlan(options, planQuery)).toBe('PREMIUM');
  });

  it('선택지가 없으면 null 이다', () => {
    expect(selectInitialPlan([], 'PREMIUM')).toBeNull();
  });
});
