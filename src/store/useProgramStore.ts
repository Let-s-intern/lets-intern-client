import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgramApplicationFormStore {
  data: {
    priceId: number | null;
    price: number | null;
    discount: number | null;
    couponId: string | null;
    couponPrice: number | null;
    totalPrice: number | null;
    contactEmail: string | null;
    question: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
    programTitle: string | null;
    programType: 'challenge' | 'live' | null;
    progressType: string | null;
    programId: number | null;
    programOrderId: string | null;
    isFree: boolean | null;
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
          },
        });
      },

      // data내에 하나라도 null이 있으면 true 반환
      checkInvalidate: () => {
        const currentData = get().data;
        return Object.values(currentData).some((value) => value === null);
      },
    }),
    {
      name: 'programApplicationForm',
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
