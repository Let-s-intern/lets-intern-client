import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReportApplication {
  reportId: number | null;
  reportPriceType: 'BASIC' | 'PREMIUM';
  optionIds: number[];
  isFeedbackApplied: boolean;
  couponId: number | null;
  paymentKey: string | null;
  orderId: string | null;
  amount: number | null;
  programPrice: number | null;
  programDiscount: number | null;
  applyUrl: string;
  recruitmentUrl: string;
  desiredDate1: string | undefined;
  desiredDate2: string | undefined;
  desiredDate3: string | undefined;
  wishJob: string;
  message: string;
  contactEmail: string;
}

interface ReportApplicationStore {
  data: ReportApplication;
  setReportApplication: (
    params: Partial<ReportApplicationStore['data']>,
  ) => void;
  initReportApplication: () => void;
  validate: () => { isValid: boolean; message: string | null };
}

const useReportApplicationStore = create(
  persist<ReportApplicationStore>(
    (set, get) => ({
      data: {
        reportId: null,
        reportPriceType: 'BASIC' as const,
        optionIds: [],
        isFeedbackApplied: false,
        couponId: null,
        paymentKey: null,
        orderId: null,
        amount: null,
        programPrice: null,
        programDiscount: null,
        applyUrl: '',
        recruitmentUrl: '',
        desiredDate1: undefined,
        desiredDate2: undefined,
        desiredDate3: undefined,
        wishJob: '',
        message: '',
        contactEmail: '',
      },
      setReportApplication: (params) => {
        const currentData = get().data;
        set({
          data: {
            ...currentData,
            ...params, // 전달된 값들만 업데이트
          },
        });
      },
      initReportApplication: () => {
        set({
          data: {
            reportId: null,
            reportPriceType: 'BASIC',
            optionIds: [],
            isFeedbackApplied: false,
            couponId: null,
            paymentKey: null,
            orderId: null,
            amount: null,
            programPrice: null,
            programDiscount: null,
            applyUrl: '',
            recruitmentUrl: '',
            desiredDate1: undefined,
            desiredDate2: undefined,
            desiredDate3: undefined,
            wishJob: '',
            message: '',
            contactEmail: '',
          },
        });
      },
      validate: () => {
        const isEmpty = (value: string | null | undefined) =>
          value === '' || !value || value === undefined;
        const currentData = get().data;

        if (
          isEmpty(currentData.desiredDate1) ||
          isEmpty(currentData.desiredDate2) ||
          isEmpty(currentData.desiredDate3)
        )
          return {
            isValid: false,
            message: '맞춤 첨삭 일정 모두 선택해주세요.',
          };

        if (isEmpty(currentData.wishJob))
          return { isValid: false, message: '희망직무를 입력해주세요.' };

        return { isValid: true, message: null };
      },
    }),
    {
      name: 'reportApplicationForm',
    },
  ),
);

export default useReportApplicationStore;
