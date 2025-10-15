import { ReportPriceType } from '@/api/report';
import dayjs from '@/lib/dayjs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HydrationStore } from './hydration';

export interface ReportApplication {
  reportId: number | null;
  reportPriceType?: ReportPriceType;
  optionIds: number[];
  isFeedbackApplied: boolean;
  couponId: number | null;
  couponCode: string;
  couponDiscount: number;
  paymentKey: string | null;
  orderId: string | null;
  amount: number | null;
  programPrice: number | null;
  programDiscount: number | null;
  applyUrl?: string | null;
  recruitmentUrl?: string | null;
  desiredDate1: string | undefined;
  desiredDate2: string | undefined;
  desiredDate3: string | undefined;
  wishJob: string;
  message: string;
  contactEmail: string;
}

interface ReportApplicationStore extends HydrationStore {
  data: ReportApplication;
  /** 계산 완료 여부 (payment -> application 로딩이 느려서 final로 판단함) */
  final: boolean;
  setReportApplication: (
    params: Partial<ReportApplicationStore['data']>,
    isFinal?: boolean,
  ) => void;
  initReportApplication: () => void;
  validate: () => { isValid: boolean; message: string | null };
}

const useReportApplicationStore = create(
  persist<ReportApplicationStore>(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
      final: false,

      data: {
        reportId: null,
        reportPriceType: undefined,
        optionIds: [],
        isFeedbackApplied: false,
        couponId: null,
        couponDiscount: 0,
        couponCode: '',
        paymentKey: null,
        orderId: null,
        amount: null,
        programPrice: null,
        programDiscount: null,
        desiredDate1: undefined,
        desiredDate2: undefined,
        desiredDate3: undefined,
        wishJob: '',
        message: '',
        contactEmail: '',
      },
      setReportApplication: (newData, isFinal?: boolean) => {
        const currentData = get().data;
        set({
          data: {
            ...currentData,
            ...newData, // 전달된 값들만 업데이트
          },
          ...(typeof isFinal === 'boolean' ? { final: isFinal } : {}),
        });
      },
      initReportApplication: () => {
        set({
          data: {
            reportId: null,
            reportPriceType: undefined,
            optionIds: [],
            isFeedbackApplied: false,
            couponId: null,
            couponDiscount: 0,
            couponCode: '',
            paymentKey: null,
            orderId: null,
            amount: null,
            programPrice: null,
            programDiscount: null,
            desiredDate1: undefined,
            desiredDate2: undefined,
            desiredDate3: undefined,
            wishJob: '',
            message: '',
            contactEmail: '',
          },
          final: false,
        });
      },
      validate: () => {
        const isEmpty = (value: string | null | undefined) =>
          value === '' || !value || value === undefined;
        const currentData = get().data;

        if (!isEmpty(currentData.applyUrl)) {
          try {
            new URL(currentData.applyUrl ?? '');
          } catch (error) {
            return {
              isValid: false,
              message: '올바른 주소를 입력해주세요.',
            };
          }
        }

        if (
          currentData.reportPriceType === 'PREMIUM' &&
          !isEmpty(currentData.recruitmentUrl)
        ) {
          try {
            new URL(currentData.recruitmentUrl ?? '');
          } catch (error) {
            return {
              isValid: false,
              message: '올바른 주소를 입력해주세요.',
            };
          }
        }

        if (
          currentData.isFeedbackApplied &&
          (isEmpty(currentData.desiredDate1) ||
            isEmpty(currentData.desiredDate2) ||
            isEmpty(currentData.desiredDate3))
        )
          return {
            isValid: false,
            message: '1:1 온라인 상담 일정을 모두 선택해주세요.',
          };

        if (currentData.isFeedbackApplied && notSelectTime(currentData))
          return {
            isValid: false,
            message: '시간을 선택해주세요.',
          };

        if (currentData.isFeedbackApplied && isDuplicateDate(currentData))
          return {
            isValid: false,
            message: '1:1 온라인 상담 일정이 중복되지 않게 선택해주세요.',
          };

        if (isEmpty(currentData.wishJob))
          return { isValid: false, message: '희망직무를 입력해주세요.' };

        return { isValid: true, message: null };
      },
    }),
    {
      name: 'reportApplicationForm',
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);

const notSelectTime = (reportApplication: ReportApplication) => {
  const { desiredDate1, desiredDate2, desiredDate3 } = reportApplication;
  if (
    dayjs(desiredDate1).hour() === 0 ||
    dayjs(desiredDate2).hour() === 0 ||
    dayjs(desiredDate3).hour() === 0
  )
    return true;

  return false;
};

const isDuplicateDate = (reportApplication: ReportApplication) => {
  const { desiredDate1, desiredDate2, desiredDate3 } = reportApplication;
  const set = new Set([desiredDate1, desiredDate2, desiredDate3]);

  return set.size === 3 ? false : true;
};

export default useReportApplicationStore;
