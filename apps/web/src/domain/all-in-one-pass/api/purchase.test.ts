import { applicationFormSchema } from './purchase';

jest.mock('@/utils/axios', () => ({ __esModule: true, default: {} }));

const BASE_FORM = {
  title: '올인원패스',
  planList: [{ membershipPlanId: 1, title: '3개월', price: 100000 }],
};

const VOD_PASS_PRODUCT = {
  id: 7,
  title: 'VOD 전체 이용권',
  price: 20000,
  additionalMonthPrice: 10000,
  durationDays: 30,
  maxPurchaseMonths: 3,
  maxTotalMonths: 12,
  availableMonths: 2,
};

describe('올인원패스 신청폼 스키마의 vodPassProduct', () => {
  it('상품이 있으면 그대로 파싱한다', () => {
    const form = applicationFormSchema.parse({
      ...BASE_FORM,
      vodPassProduct: VOD_PASS_PRODUCT,
    });

    expect(form.vodPassProduct).toEqual(VOD_PASS_PRODUCT);
    expect(form.planList).toHaveLength(1);
  });

  it('판매가 꺼져 null 이면 null 로 받고 나머지는 파싱된다', () => {
    const form = applicationFormSchema.parse({
      ...BASE_FORM,
      vodPassProduct: null,
    });

    expect(form.vodPassProduct).toBeNull();
    expect(form.title).toBe('올인원패스');
  });

  it('서버 배포 전이라 필드가 없어도 파싱된다', () => {
    const form = applicationFormSchema.parse(BASE_FORM);

    expect(form.vodPassProduct).toBeUndefined();
    expect(form.planList).toHaveLength(1);
  });

  it('상품의 선택 필드가 없거나 모르는 필드가 있어도 파싱된다', () => {
    const form = applicationFormSchema.parse({
      ...BASE_FORM,
      vodPassProduct: {
        id: 7,
        title: 'VOD 전체 이용권',
        price: 29000,
        durationDays: 30,
        unknownField: 'x',
      },
    });

    expect(form.vodPassProduct).toMatchObject({ id: 7, price: 29000 });
    expect(form.vodPassProduct?.availableMonths).toBeUndefined();
  });
});
