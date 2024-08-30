import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReportApplicationStore {
  data: {
    reportId: number | null;
    reportPriceType: 'BASIC' | 'PREMIUM';
    optionIds: number[];
    isFeedbackApplied: boolean;
    couponId: number | null;
    paymentKey: string | null;
    orderId: string | null;
    amount: string | null;
    discountPrice: number | null;
    applyUrl: string | null;
    recruitmentUrl: string | null;
    desiredDate1: string | null;
    desiredDate2: string | null;
    desiredDate3: string | null;
    wishJob: string | null;
    message: string | null;
  };
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
        reportPriceType: 'BASIC',
        optionIds: [],
        isFeedbackApplied: false,
        couponId: null,
        paymentKey: null,
        orderId: null,
        amount: null,
        discountPrice: null,
        applyUrl: null,
        recruitmentUrl: null,
        desiredDate1: null,
        desiredDate2: null,
        desiredDate3: null,
        wishJob: null,
        message: null,
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
            discountPrice: null,
            applyUrl: null,
            recruitmentUrl: null,
            desiredDate1: null,
            desiredDate2: null,
            desiredDate3: null,
            wishJob: null,
            message: null,
          },
        });
      },
      validate: () => {
        const currentData = get().data;
        if (!currentData.applyUrl)
          return { isValid: false, message: '진단용 이력서를 등록해주세요.' };

        if (
          currentData.reportPriceType === 'PREMIUM' &&
          !currentData.recruitmentUrl
        )
          return { isValid: false, message: '채용공고를 등록해주세요.' };

        if (
          !currentData.desiredDate1 ||
          !currentData.desiredDate2 ||
          !currentData.desiredDate3
        )
          return {
            isValid: false,
            message: '맞춤 첨삭 일정 모두 선택해주세요.',
          };

        if (!currentData.wishJob)
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
