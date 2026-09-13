import { describe, expect, it } from 'vitest';

import {
  buildPlanChangeConfirmSentence,
  buildPlanChangeSuccessMessage,
  getPlanChangeDisabledReason,
  getUpgradeOptions,
} from '../planChangeConfirm';

const option = (planType: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LIGHT') => ({
  planType,
  title: null,
  salePrice: 0,
  calculatedAmount: 0,
});

describe('getUpgradeOptions', () => {
  it('현재보다 높은 플랜만 남긴다', () => {
    const options = [option('BASIC'), option('STANDARD'), option('PREMIUM')];

    expect(
      getUpgradeOptions('STANDARD', options).map((o) => o.planType),
    ).toEqual(['PREMIUM']);
  });

  it('라이트는 대상에서도 빠진다', () => {
    expect(
      getUpgradeOptions('BASIC', [option('LIGHT'), option('STANDARD')]).map(
        (o) => o.planType,
      ),
    ).toEqual(['STANDARD']);
  });

  it('현재가 라이트면 고를 플랜이 없다', () => {
    expect(getUpgradeOptions('LIGHT', [option('PREMIUM')])).toEqual([]);
  });
});

describe('buildPlanChangeConfirmSentence', () => {
  it('이름·현재·대상·수납 금액을 문장에 넣는다', () => {
    expect(
      buildPlanChangeConfirmSentence({
        name: '김렛츠',
        fromPlan: 'BASIC',
        toPlan: 'PREMIUM',
        additionalAmount: 100000,
      }),
    ).toBe(
      '김렛츠님을 베이직에서 프리미엄으로 변경하고 추가 수납 100,000원을 기록합니다',
    );
  });

  it('받침 없는 대상은 "로" 를 붙인다', () => {
    expect(
      buildPlanChangeConfirmSentence({
        name: '김렛츠',
        fromPlan: 'BASIC',
        toPlan: 'STANDARD',
        additionalAmount: 0,
      }),
    ).toBe(
      '김렛츠님을 베이직에서 스탠다드로 변경하고 추가 수납 0원을 기록합니다',
    );
  });
});

describe('getPlanChangeDisabledReason', () => {
  it('라이트 플랜은 막는다', () => {
    expect(
      getPlanChangeDisabledReason({
        isCanceled: false,
        challengePricePlanType: 'LIGHT',
      }),
    ).toBe('라이트 플랜은 변경할 수 없습니다');
  });

  it('프리미엄은 올릴 플랜이 없어 막는다', () => {
    expect(
      getPlanChangeDisabledReason({
        isCanceled: false,
        challengePricePlanType: 'PREMIUM',
      }),
    ).toBe('이미 가장 높은 플랜입니다');
  });

  it('취소된 신청은 플랜과 상관없이 막는다', () => {
    expect(
      getPlanChangeDisabledReason({
        isCanceled: true,
        challengePricePlanType: 'BASIC',
      }),
    ).toBe('취소된 신청은 플랜을 변경할 수 없습니다');
    expect(
      getPlanChangeDisabledReason({
        isCanceled: true,
        challengePricePlanType: 'LIGHT',
      }),
    ).toBe('취소된 신청은 플랜을 변경할 수 없습니다');
  });

  it('베이직·스탠다드 참여자는 막지 않는다', () => {
    expect(
      getPlanChangeDisabledReason({
        isCanceled: false,
        challengePricePlanType: 'BASIC',
      }),
    ).toBeNull();
    expect(
      getPlanChangeDisabledReason({
        isCanceled: null,
        challengePricePlanType: 'STANDARD',
      }),
    ).toBeNull();
  });
});

describe('buildPlanChangeSuccessMessage', () => {
  it('대상 플랜에 맞는 조사를 붙인다', () => {
    expect(buildPlanChangeSuccessMessage('PREMIUM')).toBe(
      '플랜을 프리미엄으로 변경했습니다',
    );
    expect(buildPlanChangeSuccessMessage('STANDARD')).toBe(
      '플랜을 스탠다드로 변경했습니다',
    );
  });
});
