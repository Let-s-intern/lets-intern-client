import useMembershipOrderStore from './useMembershipOrderStore';

const STORAGE_KEY = 'membershipOrderForm';

// VOD 필드가 생기기 전 버전이 저장한 상태
const LEGACY_DATA = {
  orderType: 'PURCHASE',
  membershipId: 3,
  membershipPlanId: 1,
  applicationId: null,
  membershipOptionId: null,
  passTitle: '올인원패스',
  thumbnail: null,
  price: 100000,
  discount: 10000,
  couponCode: null,
  couponPrice: 0,
  totalPrice: 90000,
  contactEmail: 'a@b.com',
  email: 'a@b.com',
  name: '홍길동',
  phone: '010-0000-0000',
  orderId: 'order-1',
  isFree: false,
  beginning: null,
  deadline: null,
};

describe('useMembershipOrderStore 의 VOD 이용권 선택', () => {
  beforeEach(() => {
    localStorage.clear();
    useMembershipOrderStore.getState().initOrder();
  });

  it('VOD 필드 없이 persist 된 이전 상태는 미선택으로 복원한다', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { data: LEGACY_DATA }, version: 0 }),
    );

    await useMembershipOrderStore.persist.rehydrate();

    const { data } = useMembershipOrderStore.getState();
    expect(data.membershipId).toBe(3);
    expect(data.totalPrice).toBe(90000);
    expect(data.vodPassProductId).toBeNull();
    expect(data.vodPassPrice).toBeNull();
    expect(data.vodPassDurationDays).toBeNull();
    expect(data.vodPassMonths).toBeNull();
    expect(useMembershipOrderStore.getState().checkInvalidate()).toBe(false);
  });

  it('persist 된 VOD 선택은 그대로 복원한다', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: {
          data: {
            ...LEGACY_DATA,
            vodPassProductId: 7,
            vodPassPrice: 30000,
            vodPassDurationDays: 60,
            vodPassMonths: 2,
          },
        },
        version: 0,
      }),
    );

    await useMembershipOrderStore.persist.rehydrate();

    expect(useMembershipOrderStore.getState().data).toMatchObject({
      vodPassProductId: 7,
      vodPassPrice: 30000,
      vodPassDurationDays: 60,
      vodPassMonths: 2,
    });
  });

  it('initOrder 는 VOD 선택을 비운다', () => {
    const store = useMembershipOrderStore.getState();
    store.setOrder({
      vodPassProductId: 7,
      vodPassPrice: 30000,
      vodPassDurationDays: 60,
      vodPassMonths: 2,
    });

    useMembershipOrderStore.getState().initOrder();

    expect(useMembershipOrderStore.getState().data).toMatchObject({
      vodPassProductId: null,
      vodPassPrice: null,
      vodPassDurationDays: null,
      vodPassMonths: null,
    });
  });
});
