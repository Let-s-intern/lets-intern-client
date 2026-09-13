import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HydrationStore } from './hydration';

interface ProgramApplicationFormStore extends HydrationStore {
  data: {
    priceId: number | null;
    price: number | null; // 정가 = 이용료 + 보증금 + 모든 옵션 정가
    discount: number | null; // 할인 금액
    couponId: string | null;
    couponPrice: number | null;
    totalPrice: number | null; // 판매가 = 정가 - 할인 금액
    contactEmail: string | null;
    question: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
    programTitle: string | null;
    programType: 'challenge' | 'live' | 'guidebook' | 'vod' | null;
    progressType: string | null;
    programId: number | null;
    programOrderId: string | null;
    isFree: boolean | null;
    deposit: number;
    // 신청 입력에서 고른 챌린지 버전. 버전을 묻지 않는 신청은 null (LC-3247)
    challengeVersionId: number | null;
  };
  setProgramApplicationForm: (
    params: Partial<ProgramApplicationFormStore['data']>,
  ) => void;
  initProgramApplicationForm: () => void;
  checkInvalidate: () => boolean;
}

const useProgramStore = create(
  persist<ProgramApplicationFormStore>(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      data: {
        priceId: null,
        price: null,
        discount: null,
        couponId: null,
        couponPrice: null,
        totalPrice: null,
        contactEmail: null,
        question: null,
        email: null,
        phone: null,
        name: null,
        programTitle: null,
        programType: null,
        progressType: null,
        programId: null,
        programOrderId: null,
        isFree: null,
        deposit: 0,
        challengeVersionId: null,
      },
      setProgramApplicationForm: (params) => {
        const currentData = get().data;
        set({
          data: {
            ...currentData,
            ...params, // 전달된 값들만 업데이트
          },
        });
      },
      initProgramApplicationForm: () => {
        set({
          data: {
            priceId: null,
            price: null,
            discount: null,
            couponId: null,
            couponPrice: null,
            totalPrice: null,
            contactEmail: null,
            question: null,
            email: null,
            phone: null,
            name: null,
            programTitle: null,
            programType: null,
            progressType: null,
            programId: null,
            programOrderId: null,
            isFree: null,
            deposit: 0,
            challengeVersionId: null,
          },
        });
      },

      // data내에 하나라도 null이 있으면 true 반환
      // challengeVersionId 는 LIGHT·버전 없는 챌린지·챌린지 외 프로그램에서 null 이 정상이라 제외한다 (LC-3247)
      checkInvalidate: () => {
        const currentData = get().data;
        return Object.entries(currentData).some(
          ([key, value]) => key !== 'challengeVersionId' && value === null,
        );
      },
    }),
    {
      name: 'programApplicationForm',
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);

export const checkInvalidate = () => {
  return useProgramStore.getState().checkInvalidate();
};

export const initProgramApplicationForm = () => {
  useProgramStore.getState().initProgramApplicationForm();
};

export const setProgramApplicationForm = (
  params: Partial<ProgramApplicationFormStore['data']>,
) => {
  useProgramStore.getState().setProgramApplicationForm(params);
};

export default useProgramStore;
