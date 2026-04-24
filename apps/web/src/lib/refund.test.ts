import {
  ReportApplicationInfo,
  ReportApplicationStatus,
  ReportFeedbackStatus,
  ReportPaymentInfo,
} from '@/api/report';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { expect, test } from 'vitest';
import { getTotalRefund } from './refund';

function createMockPaymentInfo({
  coupon,
  feedback,
}: {
  coupon: boolean;
  feedback: boolean;
}): {
  reportApplicationInfo: ReportApplicationInfo;
  reportPaymentInfo: ReportPaymentInfo;
  reportFeedbackDesiredDate: Dayjs | null | undefined;
} {
  return {
    reportApplicationInfo: {
      applyUrlDate: '2024-09-07T10:00:00Z',
      reportApplicationId: 1,
      reportApplicationStatus: 'APPLIED',
      reportFeedbackStatus: null,
      reportFeedbackApplicationId: null,
      reportPriceType: 'BASIC',
      reportFeedbackDesiredDate: null,
      title: '진단서 신청',
      isCanceled: false,
      options: ['option1', 'option2'],
    },
    reportFeedbackDesiredDate: feedback ? dayjs('2024-09-09T10:00:00Z') : null,
    reportPaymentInfo: {
      reportPriceInfo: {
        price: 110000,
        discountPrice: 10000,
        reportPriceType: 'BASIC',
      },
      reportOptionInfos: [
        {
          price: 22000,
          discountPrice: 2000,
          reportOptionId: 1,
          optionTitle: '옵션1',
        },
        {
          price: 33000,
          discountPrice: 3000,
          reportOptionId: 2,
          optionTitle: '옵션2',
        },
      ],
      feedbackPriceInfo: feedback
        ? {
            reportFeedbackId: 1,
            reportPriceType: 'BASIC',
            feedbackPrice: 55000,
            feedbackDiscountPrice: 5000,
          }
        : null,
      programPrice: 165000,
      programDiscount: 15000,
      finalPrice: 100000,
      couponDiscount: coupon ? 50000 : null,
      createDate: '2024-09-07T10:00:00Z',
      isRefunded: false,
      lastModifiedDate: '2024-09-07T12:00:00Z', // unused
      feedbackRefundPrice: -1, // unused
      reportRefundPrice: -1, // unused
      paymentId: -1, // unused
    },
  };
}

const feedbackCouponCases = {
  '피드백 하고 쿠폰 적용할 경우': {
    message: '피드백 하고 쿠폰 적용할 경우',
    coupon: true,
    feedback: true,
  },
  '피드백 하고 쿠폰 적용하지 않을 경우': {
    message: '피드백 하고 쿠폰 적용하지 않을 경우',
    coupon: false,
    feedback: true,
  },
  '피드백 안하고 쿠폰 적용할 경우': {
    message: '피드백 안하고 쿠폰 적용할 경우',
    coupon: true,
    feedback: false,
  },
  '피드백 안하고 쿠폰 적용하지 않을 경우': {
    message: '피드백 안하고 쿠폰 적용하지 않을 경우',
    coupon: false,
    feedback: false,
  },
};

const timings: Record<
  string,
  {
    message: string;
    time: Dayjs;
    reportApplicationStatus: ReportApplicationStatus;
    reportFeedbackStatus: ReportFeedbackStatus | null | undefined;
  }
> = {
  '결제 후 3시간 이내 (피드백X)': {
    message: '결제 후 3시간 이내 (피드백X)',
    time: dayjs('2024-09-07T12:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: undefined,
  },
  '결제 후 3시간 이후 (피드백X)': {
    message: '결제 후 3시간 이후 (피드백X)',
    time: dayjs('2024-09-07T14:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: undefined,
  },
  '진단서 수령 후 (피드백X)': {
    message: '진단서 수령 후 (피드백X)',
    time: dayjs('2024-09-08T10:00:00Z'),
    reportApplicationStatus: 'COMPLETED',
    reportFeedbackStatus: undefined,
  },

  '결제 후 3시간 이내 (피드백 일정 확정 전)': {
    message: '결제 후 3시간 이내 (피드백 일정 확정 전)',
    time: dayjs('2024-09-07T12:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: 'APPLIED',
  },
  '결제 후 3시간 이후 (피드백 일정 확정 전)': {
    message: '결제 후 3시간 이후 (피드백 일정 확정 전)',
    time: dayjs('2024-09-07T14:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: 'APPLIED',
  },
  '진단서 수령 후 (피드백 일정 확정 전)': {
    message: '진단서 수령 후 (피드백 일정 확정 전)',
    time: dayjs('2024-09-08T10:00:00Z'),
    reportApplicationStatus: 'COMPLETED',
    reportFeedbackStatus: 'APPLIED',
  },

  '결제 후 3시간 이내 (피드백 일정 확정 후)': {
    message: '결제 후 3시간 이내 (피드백 일정 확정 후)',
    time: dayjs('2024-09-07T12:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: 'CONFIRMED',
  },
  '결제 후 3시간 이후 (피드백 일정 확정 후)': {
    message: '결제 후 3시간 이후 (피드백 일정 확정 후)',
    time: dayjs('2024-09-07T14:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: 'CONFIRMED',
  },
  '진단서 수령 후 (피드백 일정 확정 후)': {
    message: '진단서 수령 후 (피드백 일정 확정 후)',
    time: dayjs('2024-09-08T09:30:00Z'),
    reportApplicationStatus: 'COMPLETED',
    reportFeedbackStatus: 'CONFIRMED',
  },

  '결제 후 3시간 이후 (피드백 일정 24시간 이내)': {
    message: '결제 후 3시간 이후 (피드백 일정 24시간 이내)',
    time: dayjs('2024-09-08T10:30:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: 'CONFIRMED',
  },
  '진단서 수령 후 (피드백 일정 24시간 이내)': {
    message: '진단서 수령 후 (피드백 일정 24시간 이내)',
    time: dayjs('2024-09-08T10:30:00Z'),
    reportApplicationStatus: 'COMPLETED',
    reportFeedbackStatus: 'CONFIRMED',
  },

  '결제 후 3시간 이후 (피드백 이후)': {
    message: '결제 후 3시간 이후 (피드백 이후)',
    time: dayjs('2024-09-09T20:00:00Z'),
    reportApplicationStatus: 'APPLIED',
    reportFeedbackStatus: 'COMPLETED',
  },
  '진단서 수령 후 (피드백 이후)': {
    message: '진단서 수령 후 (피드백 이후)',
    time: dayjs('2024-09-09T20:00:00Z'),
    reportApplicationStatus: 'COMPLETED',
    reportFeedbackStatus: 'COMPLETED',
  },
};

/**
 * - 결제일: 2024-09-07T10:00:00Z
 * - 정가: 110,000원
 * - 할인: 10,000원,
 * - 옵션1: 22,000원, 2,000원 할인
 * - 옵션2: 33,000원, 3,000원 할인
 * - 쿠폰 50,000원 (true/false)
 * - 피드백 (true/false)
 *   - 확정일: 2024-09-09T10:00:00Z
 *   - 정가: 55,000원
 *   - 할인: 5,000원
 *
 * ---
 *
 * - 실결제액: 서류-100,000원, 피드백-50,000원 = 150,000원
 * - 쿠폰제외 결제액 (% 계산 대상액): 200,000원
 */
const createTest = (
  couponAndFeedback: {
    message: string;
    coupon: boolean;
    feedback: boolean;
  },
  now: {
    message: string;
    time: Dayjs;
    reportApplicationStatus: ReportApplicationStatus;
    reportFeedbackStatus: ReportFeedbackStatus | null | undefined;
  },
  expected: number,
  extra?: string,
  only?: boolean,
) => {
  const testFunc = only ? test.only : test;

  testFunc(
    `${couponAndFeedback.message} ${now.message}일 때 ${expected.toLocaleString()}원 환불${extra ? ` (${extra})` : ''}`,
    async () => {
      // Arrange
      const { coupon, feedback } = couponAndFeedback;
      const { time, reportApplicationStatus, reportFeedbackStatus } = now;
      const {
        reportApplicationInfo,
        reportPaymentInfo,
        reportFeedbackDesiredDate,
      } = createMockPaymentInfo({
        coupon,
        feedback,
      });

      // Act
      const result = getTotalRefund({
        applicationInfo: reportApplicationInfo,
        paymentInfo: reportPaymentInfo,
        reportApplicationStatus,
        reportFeedbackStatus,
        reportFeedbackDesiredDate,
        now: time,
      });

      // Assert
      expect(result).toBe(expected);
    },
  );
};

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이내 (피드백 일정 확정 전)'],
  150000,
  '전액',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이후 (피드백 일정 확정 전)'],
  120000,
  '서류만 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['진단서 수령 후 (피드백 일정 확정 전)'],
  50000,
  '피드백만 전액',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이내 (피드백 일정 확정 후)'],
  140000,
  '피드백만 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이후 (피드백 일정 확정 후)'],
  110000,
  '서류 80%, 피드백 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['진단서 수령 후 (피드백 일정 확정 후)'],
  40000,
  '서류 0%, 피드백 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이후 (피드백 일정 24시간 이내)'],
  95000,
  '서류 80%, 피드백 50%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['진단서 수령 후 (피드백 일정 24시간 이내)'],
  25000,
  '서류 0%, 피드백 50%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이후 (피드백 이후)'],
  70000,
  '서류 80%, 피드백 0%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용할 경우'],
  timings['진단서 수령 후 (피드백 이후)'],
  0,
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이내 (피드백 일정 확정 전)'],
  200000,
  '전액',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이후 (피드백 일정 확정 전)'],
  170000,
  '서류만 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['진단서 수령 후 (피드백 일정 확정 전)'],
  50000,
  '피드백만 전액',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이내 (피드백 일정 확정 후)'],
  190000,
  '서류 100%, 피드백 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이후 (피드백 일정 확정 후)'],
  160000,
  '서류 80%, 피드백 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['진단서 수령 후 (피드백 일정 확정 후)'],
  40000,
  '서류 0%, 피드백 80%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이후 (피드백 일정 24시간 이내)'],
  145000,
  '서류 80%, 피드백 50%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['진단서 수령 후 (피드백 일정 24시간 이내)'],
  25000,
  '서류 0%, 피드백 50%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이후 (피드백 이후)'],
  120000,
  '서류 80%, 피드백 0%',
);

createTest(
  feedbackCouponCases['피드백 하고 쿠폰 적용하지 않을 경우'],
  timings['진단서 수령 후 (피드백 이후)'],
  0,
);

createTest(
  feedbackCouponCases['피드백 안하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이내 (피드백X)'],
  100000,
  '전액',
);

createTest(
  feedbackCouponCases['피드백 안하고 쿠폰 적용할 경우'],
  timings['결제 후 3시간 이후 (피드백X)'],
  70000,
  '서류만 80%',
);

createTest(
  feedbackCouponCases['피드백 안하고 쿠폰 적용할 경우'],
  timings['진단서 수령 후 (피드백X)'],
  0,
);

createTest(
  feedbackCouponCases['피드백 안하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이내 (피드백X)'],
  150000,
  '전액',
);

createTest(
  feedbackCouponCases['피드백 안하고 쿠폰 적용하지 않을 경우'],
  timings['결제 후 3시간 이후 (피드백X)'],
  120000,
  '서류만 80%',
);

createTest(
  feedbackCouponCases['피드백 안하고 쿠폰 적용하지 않을 경우'],
  timings['진단서 수령 후 (피드백X)'],
  0,
);
