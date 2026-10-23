import { beforeEach, describe, expect, it, vi } from 'vitest';
import useProgramStore, {
  checkInvalidate,
  initProgramApplicationForm,
  setProgramApplicationForm,
} from './useProgramStore';

/** 결제까지 가는 챌린지 신청 폼. 버전은 고르지 않았다 */
const FILLED_FORM = {
  priceId: 10,
  price: 100000,
  discount: 10000,
  couponId: '',
  couponPrice: 0,
  totalPrice: 90000,
  contactEmail: 'user@example.com',
  question: '',
  email: 'user@example.com',
  phone: '010-0000-0000',
  name: '참여자',
  programTitle: '챌린지',
  programType: 'challenge' as const,
  progressType: 'none',
  programId: 1,
  programOrderId: 'order-1',
  isFree: false,
  deposit: 0,
};

beforeEach(() => {
  window.localStorage.clear();
  initProgramApplicationForm();
});

describe('useProgramStore challengeVersionId', () => {
  it('폼을 초기화하면 null 이다', () => {
    setProgramApplicationForm({ ...FILLED_FORM, challengeVersionId: 3 });
    initProgramApplicationForm();

    expect(useProgramStore.getState().data.challengeVersionId).toBeNull();
  });

  it('버전을 묻지 않는 신청(null)은 잘못된 접근으로 보지 않는다', () => {
    setProgramApplicationForm({ ...FILLED_FORM, challengeVersionId: null });

    expect(checkInvalidate()).toBe(false);
  });

  it('다른 필드가 null 이면 여전히 잘못된 접근이다', () => {
    setProgramApplicationForm({ ...FILLED_FORM, programOrderId: null });

    expect(checkInvalidate()).toBe(true);
  });

  it('토스 결제창을 다녀와 새 문서로 로드해도 localStorage 에서 복원된다', async () => {
    setProgramApplicationForm({ ...FILLED_FORM, challengeVersionId: 3 });

    const saved = JSON.parse(
      window.localStorage.getItem('programApplicationForm') ?? '{}',
    );
    expect(saved.state.data.challengeVersionId).toBe(3);

    vi.resetModules();
    const { default: reloadedStore } = await import('./useProgramStore');
    await reloadedStore.persist.rehydrate();

    expect(reloadedStore.getState().data.challengeVersionId).toBe(3);
    expect(reloadedStore.getState()._hasHydrated).toBe(true);
  });
});

const VOD_STORAGE_KEY = 'programApplicationForm';

/** 신청 폼에서 이용권을 제외한 필드를 모두 채운 상태 (null 이 하나도 없다) */
const VOD_FILLED_FORM = {
  priceId: 1,
  price: 100000,
  discount: 10000,
  couponId: '',
  couponPrice: 0,
  totalPrice: 90000,
  contactEmail: 'qa@letscareer.test',
  question: '',
  email: 'qa@letscareer.test',
  phone: '010-0000-0000',
  name: 'QA',
  programTitle: 'QA 챌린지',
  programType: 'challenge' as const,
  progressType: 'none',
  programId: 406,
  programOrderId: 'order-1',
  isFree: false,
  deposit: 0,
};

async function loadStoreFresh() {
  vi.resetModules();
  const mod = await import('./useProgramStore');
  // persist 는 모듈 로드 시 비동기로 rehydrate 하므로 한 번 더 호출해 완료를 보장한다.
  await mod.default.persist.rehydrate();
  return mod;
}

describe('useProgramStore VOD 이용권 필드 (LC-3438)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('이용권 필드의 기본값은 null 이 아니라 0 이다 (0 이면 미선택)', async () => {
    const { default: store } = await loadStoreFresh();

    expect(store.getState().data).toMatchObject({
      vodPassProductId: 0,
      vodPassPrice: 0,
      vodPassDurationDays: 0,
      vodPassMonths: 0,
    });
  });

  it('이용권 필드가 기본값이어도 다른 필드가 채워지면 checkInvalidate 는 false 다', async () => {
    const {
      default: store,
      setProgramApplicationForm,
      checkInvalidate,
    } = await loadStoreFresh();

    setProgramApplicationForm(VOD_FILLED_FORM);

    expect(store.getState().data.vodPassProductId).toBe(0);
    expect(checkInvalidate()).toBe(false);
  });

  it('이용권을 선택하면 네 필드가 스토어에 담긴다', async () => {
    const {
      default: store,
      setProgramApplicationForm,
      checkInvalidate,
    } = await loadStoreFresh();

    setProgramApplicationForm({
      ...VOD_FILLED_FORM,
      vodPassProductId: 7,
      vodPassPrice: 40000,
      vodPassDurationDays: 90,
      vodPassMonths: 3,
    });

    expect(store.getState().data).toMatchObject({
      vodPassProductId: 7,
      vodPassPrice: 40000,
      vodPassDurationDays: 90,
      vodPassMonths: 3,
    });
    expect(checkInvalidate()).toBe(false);
  });

  it('initProgramApplicationForm 은 이용권 필드를 0 으로 되돌린다', async () => {
    const {
      default: store,
      setProgramApplicationForm,
      initProgramApplicationForm,
    } = await loadStoreFresh();
    setProgramApplicationForm({
      vodPassProductId: 7,
      vodPassPrice: 40000,
      vodPassDurationDays: 90,
      vodPassMonths: 3,
    });

    initProgramApplicationForm();

    expect(store.getState().data).toMatchObject({
      vodPassProductId: 0,
      vodPassPrice: 0,
      vodPassDurationDays: 0,
      vodPassMonths: 0,
    });
  });

  it('이용권 필드가 없던 시절에 저장된 상태를 복원해도 결제 폼이 막히지 않는다', async () => {
    // persist 는 data 를 통째로 복원하므로 이 필드들은 undefined 로 돌아온다.
    // undefined 는 null 이 아니라 checkInvalidate 가 미완성으로 보지 않는다.
    window.localStorage.setItem(
      VOD_STORAGE_KEY,
      JSON.stringify({ state: { data: VOD_FILLED_FORM }, version: 0 }),
    );
    const { default: store, checkInvalidate } = await loadStoreFresh();

    const { data } = store.getState();
    expect(data.vodPassPrice).toBeUndefined();
    expect(data.vodPassProductId ?? 0).toBe(0);
    expect(checkInvalidate()).toBe(false);
  });
});
