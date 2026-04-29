import dayjs from '@/lib/dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { number, z } from 'zod';

import { faqSchema, reportTypeSchema } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { Dayjs } from 'dayjs';
import axios from '../utils/axios';
import { tossInfoType } from './payment/paymentSchema';

// Common schemas
const pageInfoSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  pageNum: z.number(),
  pageSize: z.number(),
});

export type ReportType = z.infer<typeof reportTypeSchema>;

export function convertReportTypeToDisplayName(
  type?: ReportType | 'PERSONAL-STATEMENT' | null,
) {
  if (!type) {
    return '';
  }

  switch (type) {
    case 'RESUME':
      return '이력서';
    case 'PERSONAL_STATEMENT':
      return '자기소개서';
    case 'PERSONAL-STATEMENT':
      return '자기소개서';
    case 'PORTFOLIO':
      return '포트폴리오';
  }
}

export const convertReportTypeToShortName = (type: ReportType) => {
  switch (type) {
    case 'RESUME':
      return '이력서';
    case 'PERSONAL_STATEMENT':
      return '자소서';
    case 'PORTFOLIO':
      return '포트폴리오';
  }
};

export function convertReportTypeToLandingPath(type: ReportType) {
  switch (type) {
    case 'RESUME':
      return '/report/landing/resume';
    case 'PERSONAL_STATEMENT':
      return '/report/landing/personal-statement';
    case 'PORTFOLIO':
      return '/report/landing/portfolio';
  }
}

export function convertReportStatusToUserDisplayName(
  status: ReportApplicationStatus | null | undefined,
  isSubmitted: boolean,
) {
  if (!status) return '';
  if (!isSubmitted) return '제출 전';

  switch (status) {
    case 'APPLIED':
      return '확인중';
    case 'REPORTING':
      return '진단중';
    case 'REPORTED':
      return '진단중'; // ADMIN: 진단서 업로드. 확정되지 않은 상태임
    case 'COMPLETED':
      return '진단완료';
  }
}

export function convertReportTypeToPathname(reportType: ReportType) {
  switch (reportType) {
    case 'RESUME':
      return 'resume';
    case 'PERSONAL_STATEMENT':
      return 'personal-statement';
    case 'PORTFOLIO':
      return 'portfolio';
  }
}

export function convertParamToReportType(param?: string) {
  const { RESUME, PORTFOLIO, PERSONAL_STATEMENT } = reportTypeSchema.enum;

  switch (param) {
    case 'personal-statement':
      return PERSONAL_STATEMENT;
    case 'portfolio':
      return PORTFOLIO;
    default:
      return RESUME;
  }
}

export function convertReportPriceTypeToDisplayName(
  type: ReportPriceType | null | undefined,
): string {
  if (!type) {
    return '';
  }

  switch (type) {
    case 'BASIC':
      return '베이직';
    case 'PREMIUM':
      return '프리미엄';
  }
}

export function convertReportStatusToBadgeStatus(
  status: ReportApplicationStatus | null | undefined,
  isSubmitted: boolean,
): 'info' | 'success' | 'warning' {
  if (!status) return 'info';
  // 서류를 제출하지 않았으면
  if (!isSubmitted) return 'warning';

  switch (status) {
    case 'APPLIED':
      return 'info';
    case 'REPORTING':
      return 'info';
    case 'REPORTED':
      return 'success';
    case 'COMPLETED':
      return 'success';
  }
}

export function convertFeedbackStatusToDisplayName({
  now,
  reportFeedback,
  status,
  isAdmin = false,
  isReportSubmitted,
}: {
  status: ReportFeedbackStatus | null | undefined;
  reportFeedback: Dayjs | null | undefined;
  now: Dayjs;
  isAdmin?: boolean;
  isReportSubmitted: boolean;
}) {
  if (!status) {
    return '';
  }

  if (!isReportSubmitted) return '일정선택 전';

  switch (status) {
    case 'APPLIED':
      return isAdmin ? '신청완료' : '확인중';
    case 'PENDING':
      return '확인중';
    case 'CONFIRMED':
      if (!reportFeedback || now.isBefore(reportFeedback.add(1, 'hour'))) {
        return '일정확정';
      } else {
        return '진행완료';
      }
    case 'COMPLETED':
      return '진행완료';
  }
}

export function convertFeedbackStatusToBadgeStatus({
  now,
  reportFeedback,
  status,
  isReportSubmitted,
}: {
  status: ReportFeedbackStatus | null | undefined;
  reportFeedback: Dayjs | null | undefined;
  now: Dayjs;
  isReportSubmitted: boolean;
}): 'info' | 'success' | 'warning' {
  if (!status) {
    return 'info';
  }

  if (!isReportSubmitted) return 'warning';

  switch (status) {
    case 'APPLIED':
      return 'info';
    case 'PENDING':
      return 'info';
    case 'CONFIRMED':
      if (!reportFeedback || now.isBefore(reportFeedback.add(1, 'hour'))) {
        return 'info';
      } else {
        return 'success';
      }
    case 'COMPLETED':
      return 'success';
  }
}

export const reportPriceTypeEnum = z.enum(['BASIC', 'PREMIUM']);

export type ReportPriceType = z.infer<typeof reportPriceTypeEnum>;

export const convertReportPriceType = (type?: ReportPriceType) => {
  switch (type) {
    case 'BASIC':
      return '베이직';
    case 'PREMIUM':
      return '프리미엄';
    default:
      return '-';
  }
};

const desiredDateTypeSchema = z.enum([
  'DESIRED_DATE_1',
  'DESIRED_DATE_2',
  'DESIRED_DATE_3',
  'DESIRED_DATE_ADMIN',
]);

const reportApplicationStatusSchema = z.enum([
  'APPLIED',
  'REPORTING',
  'REPORTED',
  'COMPLETED',
]);

export type ReportApplicationStatus = z.infer<
  typeof reportApplicationStatusSchema
>;

export const convertReportApplicationsStatus = (
  status: ReportApplicationStatus,
) => {
  switch (status) {
    case 'APPLIED':
      return '신청완료';
    case 'REPORTING':
      return '진단중';
    case 'REPORTED':
      return '진단서 업로드';
    case 'COMPLETED':
      return '진단완료';
    default:
      return '-';
  }
};

const reportFeedbackStatusSchema = z.enum([
  'APPLIED',
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
]);

export type ReportFeedbackStatus = z.infer<typeof reportFeedbackStatusSchema>;

export const convertReportTypeStatus = (type: string) => {
  switch (type.toUpperCase()) {
    case 'RESUME':
      return '이력서';
    case 'PORTFOLIO':
      return '포트폴리오';
    default:
      return '자기소개서';
  }
};

// GET /api/v1/report
const getReportsForAdminSchema = z
  .object({
    reportForAdminInfos: z.array(
      z.object({
        reportId: z.number().nullable().optional(),
        reportType: reportTypeSchema.nullable().optional(),
        title: z.string().nullable().optional(),
        applicationCount: z.number().nullable().optional(),
        feedbackApplicationCount: z.number().nullable().optional(),
        visibleDate: z.string().nullable().optional(),
        isVisible: z.boolean().nullable().optional(),
        createDateTime: z.string().nullable().optional(),
      }),
    ),
    pageInfo: pageInfoSchema,
  })
  .transform((data) => ({
    ...data,
    reportForAdminInfos: data.reportForAdminInfos.map((report) => ({
      ...report,
      visibleDate: report.visibleDate ? dayjs(report.visibleDate) : null,
      createDateTime: report.createDateTime
        ? dayjs(report.createDateTime)
        : null,
    })),
  }));

export const getReportsForAdminQueryKey = 'getReportsForAdmin';

export const useGetReportsForAdmin = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [getReportsForAdminQueryKey],
    queryFn: async () => {
      const res = await axios.get('/report', {
        params: {
          size: 10000,
        },
      });
      return getReportsForAdminSchema.parse(res.data.data);
    },
    enabled,
  });
};

export type AdminReportListItem = z.infer<
  typeof getReportsForAdminSchema
>['reportForAdminInfos'][0];

// POST /api/v1/report
const createReportSchema = z.object({
  reportType: reportTypeSchema,
  visibleDate: z.string().nullable().optional(),
  title: z.string(),
  contents: z.string(),
  notice: z.string(),
  priceInfo: z.array(
    z.object({
      reportPriceType: reportPriceTypeEnum,
      price: z.number(),
      discountPrice: z.number(),
    }),
  ),
  optionInfo: z.array(
    z.object({
      price: z.number(),
      discountPrice: z.number(),
      title: z.string(),
      code: z.string(),
    }),
  ),
  feedbackInfo: z.object({
    price: z.number(),
    discountPrice: z.number(),
  }),
  faqInfo: z
    .array(
      z.object({
        faqId: z.number(),
      }),
    )
    .nullable(),
});

export type CreateReportData = z.infer<typeof createReportSchema>;

export const usePostReportMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateReportData) => {
      await axios.post('/report', data);
      return { success: true, message: 'Report created successfully' };
    },
  });
};

// GET /api/v1/report/{reportId}
const getReportDetailSchema = z.object({
  reportId: z.number(),
  title: z.string().nullable().optional(),
  notice: z.string().nullable().optional(),
  contents: z.string().nullable().optional(),
  reportType: reportTypeSchema.nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
  visibleDate: z.string().nullable().optional(),
});

export type ReportDetail = z.infer<typeof getReportDetailSchema>;

export const getReportDetailQueryKey = 'getReportDetail';

export const useGetReportDetailQuery = (
  reportId: number,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: [getReportDetailQueryKey, reportId],
    enabled,
    queryFn: async () => {
      const res = await axios.get(`/report/${reportId}`);
      return getReportDetailSchema.parse(res.data.data);
    },
  });
};

const reportOptionInfo = z.object({
  reportOptionId: z.number(),
  price: z.number().nullable().optional(),
  discountPrice: z.number().nullable().optional(),
  optionTitle: z.string().nullable().optional(),
});
export type ReportOptionInfo = z.infer<typeof reportOptionInfo>;

// GET /api/v1/report/{reportId}/price
const getReportPriceDetailSchema = z.object({
  reportId: z.number(),
  reportPriceInfos: z
    .array(
      z.object({
        reportPriceType: reportPriceTypeEnum.nullable().optional(),
        price: z.number().nullable().optional(),
        discountPrice: z.number().nullable().optional(),
      }),
    )
    .nullable()
    .optional(),
  reportOptionInfos: z.array(reportOptionInfo).nullable().optional(),
  feedbackPriceInfo: z
    .object({
      reportFeedbackId: z.number(),
      reportPriceType: reportPriceTypeEnum.nullable().optional(),
      feedbackPrice: z.number().nullable().optional(),
      feedbackDiscountPrice: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type ReportPriceDetail = z.infer<typeof getReportPriceDetailSchema>;

export const getReportPriceDetailQueryKey = 'getReportPriceDetail';

export const useGetReportPriceDetail = (reportId?: number) => {
  return useQuery({
    queryKey: [getReportPriceDetailQueryKey, reportId],
    enabled: !!reportId,
    queryFn: async () => {
      const res = await axios.get(`/report/${reportId}/price`);
      return getReportPriceDetailSchema.parse(res.data.data);
    },
  });
};

// GET /api/v1/report/active
export const getActiveReportsSchema = z.object({
  resumeInfoList: z.array(getReportDetailSchema),
  personalStatementInfoList: z.array(getReportDetailSchema),
  portfolioInfoList: z.array(getReportDetailSchema),
});

export type ActiveReports = z.infer<typeof getActiveReportsSchema>;

export type ActiveReport = z.infer<typeof getReportDetailSchema>;

export const getActiveReportsQueryKey = 'getActiveReports';

export const useGetActiveReports = () => {
  return useQuery({
    queryKey: [getActiveReportsQueryKey],
    queryFn: async () => {
      const res = await axios.get('/report/active');
      return getActiveReportsSchema.parse(res.data.data);
    },
  });
};

/**
 * 진단서 데이터 조회
 * TODO: 구조 더 깔끔하게 정리하기. 현재 하나의 id라도 전체 Active Reports를 가져오는 구조
 */
export const fetchReport = async ({
  type,
  id,
}: {
  type: ReportType;
  id?: number;
}): Promise<ReportDetail | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/report/active`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch report data');
  }

  const data = await res.json();

  const activeReports = getActiveReportsSchema.parse(data.data);

  let list: ReportDetail[];

  if (type === 'PERSONAL_STATEMENT') {
    list = activeReports.personalStatementInfoList;
  } else if (type === 'PORTFOLIO') {
    list = activeReports.portfolioInfoList;
  } else if (type === 'RESUME') {
    list = activeReports.resumeInfoList;
  } else {
    throw new Error('Invalid report type');
  }
  const visibleList = list.filter(
    (item) =>
      item.isVisible === true &&
      item.visibleDate &&
      new Date(item.visibleDate) <= new Date(),
  );

  const report = !id
    ? visibleList.length > 0
      ? visibleList[0]
      : undefined
    : list.find((item) => item.reportId === id);

  return report ?? null;
};

// GET /api/v1/report/{reportId}/admin
const getReportDetailForAdminSchema = z.object({
  reportId: z.number(),
  reportType: reportTypeSchema,
  title: z.string(),
  contents: z.string(),
  notice: z.string(),
  reportPriceInfos: z.array(
    z.object({
      reportPriceType: reportPriceTypeEnum,
      price: z.number(),
      discountPrice: z.number(),
    }),
  ),
  reportOptionForAdminInfos: z.array(
    z.object({
      reportOptionId: z.number().nullable().optional(),
      price: z.number().nullable().optional(),
      discountPrice: z.number().nullable().optional(),
      title: z.string().nullable().optional(),
      code: z.string().nullable().optional(),
    }),
  ),
  feedbackPriceInfo: z.object({
    reportFeedbackId: z.number(),
    reportPriceType: reportPriceTypeEnum,
    feedbackPrice: z.number(),
    feedbackDiscountPrice: z.number(),
  }),
  isVisible: z.boolean().nullable(),
  visibleDate: z.string().nullable().optional(),
  faqInfo: z
    .array(
      z.object({
        id: z.number(),
        question: z.string().nullable(),
        answer: z.string().nullable(),
        category: z.string().nullable(),
        faqProgramType: z.string().nullable(),
      }),
    )
    .nullable()
    .optional(),
});

export type ReportDetailAdmin = z.infer<typeof getReportDetailForAdminSchema>;

export const getReportDetailForAdminQueryKey = 'getReportDetailForAdmin';

export const useGetReportDetailAdminQuery = (reportId: number) => {
  return useQuery({
    queryKey: [getReportDetailForAdminQueryKey, reportId],
    queryFn: async () => {
      const data = await axios.get(`/report/${reportId}/admin`);
      return getReportDetailForAdminSchema.parse(data.data.data);
    },
  });
};

// GET /api/v1/report/my
const getMyReportsSchema = z
  .object({
    myReportInfos: z.array(
      z.object({
        reportId: z.number(),
        applicationId: z.number(),
        title: z.string().nullable().optional(),
        reportType: reportTypeSchema,
        reportPriceType: reportPriceTypeEnum.optional().nullable(),
        reportFeedbackPriceType: reportPriceTypeEnum.optional().nullable(),
        applicationStatus: reportApplicationStatusSchema.nullable().optional(),
        feedbackStatus: reportFeedbackStatusSchema.nullable().optional(),
        reportUrl: z.string().nullable().optional(),
        applyUrl: z.string().nullable().optional(),
        recruitmentUrl: z.string().nullable().optional(),
        zoomLink: z.string().nullable().optional(),
        zoomPassword: z.string().nullable().optional(),
        desiredDate1: z.string().nullable().optional(),
        desiredDate2: z.string().nullable().optional(),
        desiredDate3: z.string().nullable().optional(),
        applicationTime: z.string().nullable().optional(),
        confirmedTime: z.string().nullable().optional(),
        isCanceled: z.boolean().nullable().optional(),
        feedbackIsCanceled: z.boolean().nullable().optional(),
        optionIds: z.array(number()),
      }),
    ),
    pageInfo: pageInfoSchema,
  })
  .transform((data) => ({
    ...data,
    myReportInfos: data.myReportInfos.map((report) => ({
      ...report,
      desiredDate1: report.desiredDate1 ? dayjs(report.desiredDate1) : null,
      desiredDate2: report.desiredDate2 ? dayjs(report.desiredDate2) : null,
      desiredDate3: report.desiredDate3 ? dayjs(report.desiredDate3) : null,
      applicationTime: dayjs(report.applicationTime),
      confirmedTime: report.confirmedTime ? dayjs(report.confirmedTime) : null,
    })),
  }));

export type MyReportInfoType = z.infer<
  typeof getMyReportsSchema
>['myReportInfos'][0];

export const getMyReportsQueryKey = 'getMyReports';

export const useGetMyReports = (reportType?: ReportType) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    enabled: isLoggedIn,
    queryKey: [getMyReportsQueryKey, reportType],
    queryFn: async () => {
      const res = await axios.get('/report/my', {
        params: {
          reportType,
          size: 1000,
        },
      });

      return getMyReportsSchema.parse(res.data.data);
    },
  });
};

// 유저 - 진단서 faq 목록 조회
//  GET /api/v1/report/{reportId}/faqs
export const useGetReportFaqs = (reportId: string | number) => {
  return useQuery({
    queryKey: ['useGetReportFaq', reportId],
    queryFn: async () => {
      const res = await axios.get(`/report/${reportId}/faqs`);

      return faqSchema.parse(res.data.data);
    },
  });
};

const SubmitTypeEnum = z.enum(['NORMAL', 'LATE']);

const reportApplicationsForAdminInfoSchema = z.object({
  applicationId: z.number(),
  name: z.string(),
  contactEmail: z.string(),
  phoneNumber: z.string(),
  wishJob: z.string().nullable(),
  message: z.string().nullable(),
  reportApplicationStatus: reportApplicationStatusSchema,
  submitType: SubmitTypeEnum.nullable(),
  applyFileUrl: z.string().nullable(),
  reportFileUrl: z.string().nullable(),
  recruitmentFileUrl: z.string().nullable(),
  reportFeedbackApplicationId: z.number().nullable(),
  reportFeedbackStatus: reportFeedbackStatusSchema.nullable(),
  zoomLink: z.string().nullable(),
  desiredDate1: z.string().nullable(),
  desiredDate2: z.string().nullable(),
  desiredDate3: z.string().nullable(),
  desiredDateAdmin: z.string().nullable(),
  desiredDateType: desiredDateTypeSchema.nullable(),
  createDate: z.string().nullable(),
  paymentId: z.number().nullable(),
  orderId: z.string().nullable(),
  reportPriceType: reportPriceTypeEnum.nullable(),
  couponTitle: z.string().nullable(),
  finalPrice: z.number().nullable(),
  isRefunded: z.boolean().nullable(),
});

export type reportApplicationsForAdminInfoType = z.infer<
  typeof reportApplicationsForAdminInfoSchema
>;

// GET /api/v1/report/applications
const getReportApplicationsForAdminSchema = z.object({
  reportApplicationsForAdminInfos: z.array(
    reportApplicationsForAdminInfoSchema,
  ),
  pageInfo: pageInfoSchema,
});

export const useGetReportApplicationsForAdminQueryKey =
  'getReportApplicationsForAdmin';

export const useGetReportApplicationsForAdmin = ({
  reportId,
  reportType,
  priceType,
  isApplyFeedback,
  pageable: { page = 0, size = 10 },
  enabled = true,
}: {
  reportId?: number;
  reportType?: 'RESUME' | 'PERSONAL_STATEMENT' | 'PORTFOLIO';
  priceType?: 'BASIC' | 'PREMIUM';
  isApplyFeedback?: boolean;
  pageable: {
    page?: number;
    size?: number;
  };
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      useGetReportApplicationsForAdminQueryKey,
      reportId,
      reportType,
      priceType,
      isApplyFeedback,
      page,
      size,
    ],
    queryFn: async () => {
      const res = await axios.get('/report/applications', {
        params: {
          reportId,
          reportType,
          priceType,
          isApplyFeedback,
          page,
          size,
        },
      });
      return getReportApplicationsForAdminSchema.parse(res.data.data);
    },
    enabled,
  });
};

// GET /api/v1/report/application/options
const getReportApplicationOptionsForAdminSchema = z.object({
  reportApplicationOptionForAdminInfos: z.array(
    z.object({
      reportApplicationOptionId: z.number(),
      price: z.number(),
      discountPrice: z.number(),
      title: z.string(),
      code: z.string(),
    }),
  ),
});

export const useGetReportApplicationOptionsForAdminQueryKey =
  'getReportApplicationOptionsForAdmin';

export const useGetReportApplicationOptionsForAdmin = ({
  applicationId,
  code,
  priceType,
  reportId,
  enabled,
}: {
  reportId?: number;
  applicationId?: number;
  priceType?: string;
  code?: string;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [
      useGetReportApplicationOptionsForAdminQueryKey,
      reportId,
      applicationId,
      priceType,
      code,
    ],
    queryFn: async () => {
      const res = await axios.get('/report/application/options', {
        params: { reportId, applicationId, priceType, code },
      });

      return getReportApplicationOptionsForAdminSchema.parse(res.data.data);
    },
    enabled,
  });
};

export const usePatchApplicationDocument = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      reportUrl,
    }: {
      applicationId: number;
      reportUrl?: string;
    }) => {
      const res = await axios.patch(
        `/report/application/${applicationId}/document`,
        {
          reportUrl,
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useGetReportApplicationsForAdminQueryKey],
      });
      if (successCallback) {
        successCallback();
      }
    },
    onError: (error: Error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};

// 진단서 신처 업데이트 /api/v1/report/application/{applicationId}/my
export const usePatchMyApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      applyUrl,
      recruitmentUrl,
      desiredDate1,
      desiredDate2,
      desiredDate3,
      wishJob,
      message,
    }: {
      applicationId: number;
      applyUrl: string;
      recruitmentUrl: string;
      desiredDate1: string;
      desiredDate2: string;
      desiredDate3: string;
      wishJob: string;
      message: string;
    }) => {
      const res = await axios.patch(`/report/application/${applicationId}/my`, {
        applyUrl,
        recruitmentUrl,
        desiredDate1,
        desiredDate2,
        desiredDate3,
        wishJob,
        message,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [getMyReportsQueryKey],
      });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};

export const usePatchApplicationStatus = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      reportApplicationStatus,
    }: {
      applicationId: number;
      reportApplicationStatus: ReportApplicationStatus;
    }) => {
      const res = await axios.patch(
        `/report/application/${applicationId}/status`,
        {
          status: reportApplicationStatus,
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useGetReportApplicationsForAdminQueryKey],
      });
      successCallback?.();
    },
    onError: (error: Error) => {
      errorCallback?.(error);
    },
  });
};

export const usePatchReportApplicationSchedule = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      applicationId,
      reportFeedbackStatus = 'PENDING',
      desiredDateType,
      desiredDateAdmin,
    }: {
      reportId: number;
      applicationId: number;
      reportFeedbackStatus?: ReportFeedbackStatus;
      desiredDateType?:
        | 'DESIRED_DATE_1'
        | 'DESIRED_DATE_2'
        | 'DESIRED_DATE_3'
        | 'DESIRED_DATE_ADMIN';
      desiredDateAdmin?: string;
    }) => {
      const payload = {
        reportFeedbackStatus,
        ...(desiredDateType !== undefined && { desiredDateType }),
        ...(desiredDateAdmin !== undefined && { desiredDateAdmin }),
      };

      const res = await axios.patch(
        `/report/${reportId}/application/${applicationId}/schedule`,
        payload,
      );

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useGetReportApplicationsForAdminQueryKey],
      });
      if (successCallback) {
        successCallback();
      }
    },
    onError: (error: Error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};

// POST /api/v1/report/application
const createReportApplicationSchema = z.object({
  reportId: z.number(),
  reportPriceType: reportPriceTypeEnum,
  optionIds: z.array(z.number()),
  isFeedbackApplied: z.boolean(),
  couponId: z.number().nullable(),
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.string(),
  discountPrice: z.number(),
  applyUrl: z.string(),
  recruitmentUrl: z.string(),
  desiredDate1: z.string(),
  desiredDate2: z.string(),
  desiredDate3: z.string(),
  wishJob: z.string(),
  message: z.string(),
});

export type CreateReportApplication = z.infer<
  typeof createReportApplicationSchema
>;

export const useCreateReportApplication = () => {
  return useMutation({
    mutationFn: async (data: CreateReportApplication) => {
      // Mock API call
      console.log('Creating report application:', data);
      return {
        success: true,
        message: 'Report application created successfully',
        applicationId: 103,
      };
    },
  });
};

// DELETE /api/v1/report/{reportId}
export const useDeleteReport = () => {
  return useMutation({
    mutationFn: async (reportId: number) => {
      // Mock API call
      console.log('Deleting report:', reportId);
      return { success: true, message: 'Report deleted successfully' };
    },
  });
};

// PATCH /api/v1/report/{reportId}
const updateReportSchema = z.object({
  reportType: reportTypeSchema.optional(),
  isVisible: z.boolean().nullable().optional(),
  visibleDate: z.string().optional().nullable(),
  title: z.string().optional(),
  contents: z.string().optional(),
  notice: z.string().optional(),
  priceInfo: z
    .array(
      z.object({
        reportPriceType: reportPriceTypeEnum,
        price: z.number(),
        discountPrice: z.number(),
      }),
    )
    .optional(),
  optionInfo: z
    .array(
      z.object({
        price: z.number(),
        discountPrice: z.number(),
        title: z.string(),
        code: z.string(),
      }),
    )
    .optional(),
  feedbackInfo: z
    .object({
      price: z.number(),
      discountPrice: z.number(),
    })
    .optional(),
  faqInfo: z
    .array(
      z.object({
        faqId: z.number(),
      }),
    )
    .nullable(),
});

export type UpdateReportData = z.infer<typeof updateReportSchema>;

export const usePatchReportMutation = () => {
  return useMutation({
    mutationFn: async ({
      reportId,
      data,
    }: {
      reportId: number;
      data: z.infer<typeof updateReportSchema>;
    }) => {
      await axios.patch(`/report/${reportId}`, data);
      return { success: true, message: 'Report updated successfully' };
    },
  });
};

const reportApplicationInfoSchema = z.object({
  reportApplicationId: z.number(),
  reportFeedbackApplicationId: z.number().nullable(),
  title: z.string(),
  reportPriceType: reportPriceTypeEnum,
  options: z.array(z.string()),
  isCanceled: z.boolean(),
  reportApplicationStatus: reportApplicationStatusSchema,
  reportFeedbackStatus: reportFeedbackStatusSchema.nullable(),
  reportFeedbackDesiredDate: z.string().nullable(),
  applyUrlDate: z.string().nullable(),
});

export type ReportApplicationInfo = z.infer<typeof reportApplicationInfoSchema>;

const reportPaymentInfoSchema = z.object({
  paymentId: z.number(),
  paymentOrderId: z.string().nullable().optional(),
  finalPrice: z.number().nullable(),
  couponDiscount: z.number().nullable(),
  couponName: z.string().nullable()?.optional(),
  programPrice: z.number().nullable(),
  programDiscount: z.number().nullable(),
  reportRefundPrice: z.number().nullable(),
  feedbackRefundPrice: z.number().nullable(),
  reportPriceInfo: z.object({
    reportPriceType: reportPriceTypeEnum,
    price: z.number().nullable(),
    discountPrice: z.number().nullable(),
  }),
  reportOptionInfos: z.array(
    z
      .object({
        reportOptionId: z.number(),
        price: z.number(),
        discountPrice: z.number(),
        optionTitle: z.string(),
      })
      .nullable()
      .optional(),
  ),
  feedbackPriceInfo: z
    .object({
      reportFeedbackId: z.number().nullable().optional(),
      reportPriceType: reportPriceTypeEnum.nullable().optional(),
      feedbackPrice: z.number().nullable().optional(),
      feedbackDiscountPrice: z.number().nullable().optional(),
    })
    .nullable(),
  isRefunded: z.boolean(),
  createDate: z.string(),
  lastModifiedDate: z.string(),
});

const reportPaymentDetailSchema = z.object({
  reportApplicationInfo: reportApplicationInfoSchema,
  reportPaymentInfo: reportPaymentInfoSchema,
  tossInfo: tossInfoType.nullable().optional(),
});

export type ReportPaymentInfo = z.infer<typeof reportPaymentInfoSchema>;

export const useGetReportPaymentDetailQueryKey = 'getReportPayment';

export const useGetReportPaymentDetailQuery = ({
  applicationId,
  enabled,
}: {
  applicationId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [useGetReportPaymentDetailQueryKey, applicationId],
    queryFn: async () => {
      const res = await axios.get(
        `/report/application/${applicationId}/payment`,
      );
      return reportPaymentDetailSchema.parse(res.data.data);
    },
    enabled,
  });
};

export const useDeleteReportApplication = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportApplicationId: number) => {
      const res = await axios.delete(
        `/report/application/${reportApplicationId}`,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useGetReportApplicationsForAdminQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [useGetReportPaymentDetailQueryKey],
      });
      if (successCallback) {
        successCallback();
      }
    },
    onError: (error: Error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};

export const reportTitleSchema = z.object({
  title: z.string().optional().nullable(),
});

export const useGetReportTitle = (reportId: number) => {
  return useQuery({
    queryKey: ['useGetReportTitle', reportId],
    queryFn: async () => {
      const res = await axios.get(`/report/${reportId}/title`);
      return reportTitleSchema.parse(res.data.data);
    },
  });
};

// 서류 진단 고민 조회
export const getReportMessageQueryKey = (applicationId: number) => [
  'getReportMessage',
  applicationId,
];

export const reportMessageSchema = z.object({
  message: z.string(),
});

export const useGetReportMessage = (applicationId: number) => {
  return useQuery({
    queryKey: getReportMessageQueryKey(applicationId),
    queryFn: async () => {
      const res = await axios.get(
        `/report/application/${applicationId}/message`,
      );
      return reportMessageSchema.parse(res.data.data);
    },
  });
};

export const fetchReportId = async (
  id: string | number,
): Promise<ReportDetail> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/report/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch report data');
  }

  const data = await res.json();
  return getReportDetailSchema.parse(data.data);
};
