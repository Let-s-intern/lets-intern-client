/*
  `application.ts` 를 import 하면 jest 가 파싱하지 못하는 모듈이 딸려 온다.
  (`@/utils/axios`, `@/utils/axiosV2`, `@letscareer/api` → `import.meta`)
  검사 대상은 zod 스키마 두 개뿐이므로 네트워크 계층은 통째로 목으로 막는다.
*/
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock('@letscareer/api', () => ({
  __esModule: true,
  fetchJson: jest.fn(),
}));

import {
  postApplicationResultSchema,
  programApplicationSchema,
} from './application';

describe('programApplicationSchema.vodPassProduct (LC-3438)', () => {
  const vodPassProduct = {
    id: 7,
    title: 'VOD 전체 이용권',
    price: 29000,
    durationDays: 30,
  };

  it('이용권 상품이 있으면 그대로 파싱한다', () => {
    const parsed = programApplicationSchema.parse({ vodPassProduct });

    expect(parsed.vodPassProduct).toEqual(vodPassProduct);
  });

  it('상품이 비활성이라 null 이면 null 로 파싱한다', () => {
    const parsed = programApplicationSchema.parse({ vodPassProduct: null });

    expect(parsed.vodPassProduct).toBeNull();
  });

  it('서버 배포 전이라 필드가 없어도 파싱이 실패하지 않는다', () => {
    const parsed = programApplicationSchema.parse({ name: 'QA' });

    expect(parsed.vodPassProduct).toBeUndefined();
  });

  it('필드가 모자란 상품은 거른다', () => {
    expect(() =>
      programApplicationSchema.parse({ vodPassProduct: { id: 7 } }),
    ).toThrow();
  });
});

describe('postApplicationResultSchema (LC-3438)', () => {
  it('이용권 없이 결제한 기존 응답은 그대로 파싱한다', () => {
    const parsed = postApplicationResultSchema.parse({
      tossInfo: { method: '카드' },
    });

    expect(parsed.payments).toBeUndefined();
    expect(parsed.vodPass).toBeUndefined();
  });

  it('이용권을 함께 결제한 응답의 payments 를 파싱한다', () => {
    const parsed = postApplicationResultSchema.parse({
      tossInfo: { method: '카드' },
      vodPass: { applicationId: 91, status: 'UNACTIVATED' },
      payments: [
        {
          paymentId: 1,
          applicationId: 10,
          orderId: 'letsABC123',
          type: 'CHALLENGE',
          paidAmount: 100000,
        },
        {
          paymentId: 2,
          applicationId: 91,
          orderId: 'VOD_letsABC123',
          type: 'VOD_PASS',
          paidAmount: 29000,
        },
      ],
    });

    expect(parsed.payments).toHaveLength(2);
    expect(parsed.payments?.[1]).toMatchObject({
      type: 'VOD_PASS',
      paidAmount: 29000,
    });
  });
});
