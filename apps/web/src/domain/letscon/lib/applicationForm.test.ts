import type { ProgramApplicationFormInfo } from '@/api/application';
import { buildApplicationForm } from './applicationForm';

// order.ts 가 끌어오는 nanoid 는 ESM 배포라 jest 에서 파싱되지 않는다
jest.mock('nanoid', () => ({ customAlphabet: () => () => 'id' }));

const USER = {
  name: '참여자',
  email: 'user@example.com',
  contactEmail: 'contact@example.com',
  phoneNumber: '010-0000-0000',
};

const ONLINE: ProgramApplicationFormInfo = {
  ...USER,
  price: { priceId: 1, price: 0, discount: 0, livePriceType: 'FREE' },
};

const OFFLINE: ProgramApplicationFormInfo = {
  ...USER,
  price: { priceId: 2, price: 15000, discount: 0, livePriceType: 'CHARGE' },
};

const build = (application: ProgramApplicationFormInfo, hasPrivilege = false) =>
  buildApplicationForm({
    application,
    liveId: 10,
    title: '렛츠콘',
    orderId: 'order-1',
    hasPrivilege,
  });

describe('buildApplicationForm', () => {
  it('온라인은 0원 신청이다', () => {
    expect(build(ONLINE)).toMatchObject({
      priceId: 1,
      price: 0,
      discount: 0,
      totalPrice: 0,
      membershipDiscount: 0,
      isFree: true,
    });
  });

  it('현장은 15,000원 결제다', () => {
    expect(build(OFFLINE)).toMatchObject({
      priceId: 2,
      price: 15000,
      totalPrice: 15000,
      membershipDiscount: 0,
      isFree: false,
    });
  });

  it('멤버십 LIVE 권한이 있으면 현장도 0원이고 보증금만큼 멤버십 할인이 잡힌다', () => {
    expect(build(OFFLINE, true)).toMatchObject({
      price: 15000,
      totalPrice: 0,
      membershipDiscount: 15000,
      isFree: true,
    });
  });

  it('LiveCTAButtons 와 같은 필드를 모두 채운다', () => {
    expect(build(OFFLINE)).toEqual({
      priceId: 2,
      price: 15000,
      discount: 0,
      couponId: '',
      couponPrice: 0,
      totalPrice: 15000,
      membershipDiscount: 0,
      contactEmail: USER.contactEmail,
      question: '',
      email: USER.email,
      phone: USER.phoneNumber,
      name: USER.name,
      programTitle: '렛츠콘',
      programType: 'live',
      progressType: 'none',
      programId: 10,
      programOrderId: 'order-1',
      isFree: false,
    });
  });

  it('가격 정보가 없으면 null 이다', () => {
    expect(build({ ...USER, price: null })).toBeNull();
  });
});
