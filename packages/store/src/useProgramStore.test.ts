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
