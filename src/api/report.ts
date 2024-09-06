import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { z } from 'zod';
import axios from '../utils/axios';
import { tossInfoType } from './paymentSchema';

// Common schemas
const pageInfoSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  pageNum: z.number(),
  pageSize: z.number(),
});

const reportTypeSchema = z.enum(['RESUME', 'PERSONAL_STATEMENT', 'PORTFOLIO']);

export type ReportType = z.infer<typeof reportTypeSchema>;

export function convertReportTypeToDisplayName(type: ReportType) {
  switch (type) {
    case 'RESUME':
      return '이력서';
    case 'PERSONAL_STATEMENT':
      return '자기소개서';
    case 'PORTFOLIO':
      return '포트폴리오';
  }
}

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

const reportPriceTypeSchema = z.enum(['BASIC', 'PREMIUM']);

export type ReportPriceType = z.infer<typeof reportPriceTypeSchema>;

export const convertReportPriceType = (type: ReportPriceType) => {
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

export const convertReportFeedbackStatus = (status: ReportFeedbackStatus) => {
  switch (status) {
    case 'APPLIED':
      return '신청완료';
    case 'PENDING':
      return '일정확인중';
    case 'CONFIRMED':
      return '일정확정';
    case 'COMPLETED':
      return '진행완료';
    default:
      return '-';
  }
};

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

export const useGetReportsForAdmin = () => {
  return useQuery({
    queryKey: [getReportsForAdminQueryKey],
    queryFn: async () => {
      const res = await axios.get('/report?size=9999');
      return getReportsForAdminSchema.parse(res.data.data);
    },
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
      reportPriceType: reportPriceTypeSchema,
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
});

export const getReportDetailQueryKey = 'getReportDetail';

export const useGetReportDetailQuery = (reportId: number) => {
  return useQuery({
    queryKey: [getReportDetailQueryKey, reportId],
    queryFn: async () => {
      const res = await axios.get(`/report/${reportId}`);
      return getReportDetailSchema.parse(res.data.data);
    },
  });
};

// GET /api/v1/report/{reportId}/price
const getReportPriceDetailSchema = z.object({
  reportId: z.number(),
  reportPriceInfos: z
    .array(
      z.object({
        reportPriceType: reportPriceTypeSchema.nullable().optional(),
        price: z.number().nullable().optional(),
        discountPrice: z.number().nullable().optional(),
      }),
    )
    .nullable()
    .optional(),
  reportOptionInfos: z
    .array(
      z.object({
        reportOptionId: z.number(),
        price: z.number().nullable().optional(),
        discountPrice: z.number().nullable().optional(),
        title: z.string().nullable().optional(),
      }),
    )
    .nullable()
    .optional(),
  feedbackPriceInfo: z
    .object({
      reportFeedbackId: z.number(),
      reportPriceType: reportPriceTypeSchema.nullable().optional(),
      feedbackPrice: z.number().nullable().optional(),
      feedbackDiscountPrice: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const useGetReportPriceDetail = (reportId: number) => {
  return useQuery({
    queryKey: ['getReportPriceDetail', reportId],
    queryFn: async () => {
      // Mock data
      const mockData = {
        reportId,
        reportPriceInfos: [
          { reportPriceType: 'BASIC', price: 50000, discountPrice: 45000 },
          { reportPriceType: 'PREMIUM', price: 100000, discountPrice: 90000 },
        ],
        reportOptionInfos: [
          {
            reportOptionId: 1,
            price: 20000,
            discountPrice: 18000,
            title: '추가 피드백',
          },
          {
            reportOptionId: 2,
            price: 30000,
            discountPrice: 27000,
            title: '심층 분석',
          },
        ],
        feedbackPriceInfo: {
          reportFeedbackId: 1,
          reportPriceType: 'PREMIUM',
          feedbackPrice: 80000,
          feedbackDiscountPrice: 72000,
        },
      };
      const res = await axios.get(`/report/${reportId}/price`);

      return getReportPriceDetailSchema.parse(res.data.data);
    },
  });
};

// GET /api/v1/report/active
export const getActiveReportsSchema = z.object({
  resumeInfo: getReportDetailSchema.nullable().optional(),
  personalStatementInfo: getReportDetailSchema.nullable().optional(),
  portfolioInfo: getReportDetailSchema.nullable().optional(),
});

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

// GET /api/v1/report/{reportId}/admin
const getReportDetailForAdminSchema = z.object({
  reportId: z.number(),
  reportType: reportTypeSchema,
  title: z.string(),
  contents: z.string(),
  notice: z.string(),
  reportPriceInfos: z.array(
    z.object({
      reportPriceType: reportPriceTypeSchema,
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
    reportPriceType: reportPriceTypeSchema,
    feedbackPrice: z.number(),
    feedbackDiscountPrice: z.number(),
  }),
  visibleDate: z.string().nullable().optional(),
});

export type ReportDetailAdmin = z.infer<typeof getReportDetailForAdminSchema>;

export const getReportDetailForAdminQueryKey = 'getReportDetailForAdmin';

export const useGetReportDetailAdminQuery = (reportId: number) => {
  return useQuery({
    queryKey: ['getReportDetailForAdmin', reportId],
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
        applicationStatus: reportApplicationStatusSchema,
        feedbackStatus: reportFeedbackStatusSchema,
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

export const useGetMyReports = (reportType?: ReportType) => {
  return useQuery({
    queryKey: ['getMyReports', reportType],
    queryFn: async () => {
      // const res = await axios.get('/report/my', {
      //   params: {
      //     reportType,
      //     size: 1000,
      //   },
      // });

      // return getMyReportsSchema.parse(res.data.data);

      const mockMyReportsData: z.infer<typeof getMyReportsSchema> = {
        myReportInfos: [
          {
            reportId: 1,
            applicationId: 1001,
            title: 'Software Engineer Application',
            reportType: 'RESUME',
            applicationStatus: 'REPORTING',
            feedbackStatus: 'PENDING',
            reportUrl: 'https://example.com/report/1',
            applyUrl: 'https://example.com/apply/1001',
            recruitmentUrl: 'https://example.com/job/se001',
            zoomLink: 'https://zoom.us/j/123456789',
            zoomPassword: '987654',
            desiredDate1: dayjs('2024-09-10T14:00:00.000Z'),
            desiredDate2: dayjs('2024-09-11T15:00:00.000Z'),
            desiredDate3: dayjs('2024-09-12T16:00:00.000Z'),
            applicationTime: dayjs('2024-09-06T13:41:47.404Z'),
            confirmedTime: dayjs('2024-09-07T10:30:00.000Z'),
          },
          {
            reportId: 2,
            applicationId: 1002,
            title: 'Data Scientist Position',
            reportType: 'PORTFOLIO',
            applicationStatus: 'APPLIED',
            feedbackStatus: 'APPLIED',
            reportUrl: 'https://example.com/report/2',
            applyUrl: 'https://example.com/apply/1002',
            recruitmentUrl: 'https://example.com/job/ds001',
            zoomLink: 'https://zoom.us/j/987654321',
            zoomPassword: '123456',
            desiredDate1: dayjs('2024-09-15T10:00:00.000Z'),
            desiredDate2: dayjs('2024-09-16T11:00:00.000Z'),
            desiredDate3: null,
            applicationTime: dayjs('2024-09-05T09:30:00.000Z'),
            confirmedTime: null,
          },
          {
            reportId: 3,
            applicationId: 1003,
            title: 'UX Designer Opening',
            reportType: 'RESUME',
            applicationStatus: 'COMPLETED',
            feedbackStatus: 'COMPLETED',
            reportUrl: 'https://example.com/report/3',
            applyUrl: 'https://example.com/apply/1003',
            recruitmentUrl: 'https://example.com/job/ux001',
            zoomLink: null,
            zoomPassword: null,
            desiredDate1: null,
            desiredDate2: null,
            desiredDate3: null,
            applicationTime: dayjs('2024-09-01T11:15:00.000Z'),
            confirmedTime: dayjs('2024-09-03T16:45:00.000Z'),
          },
        ],
        pageInfo: {
          pageNum: 0,
          pageSize: 10,
          totalElements: 3,
          totalPages: 1,
        },
      };

      return mockMyReportsData;
    },
  });
};

// GET /api/v1/report/my/feedback
const getMyReportFeedbacksSchema = z
  .object({
    myReportFeedbackInfos: z.array(
      z.object({
        reportId: z.number(),
        applicationId: z.number(),
        title: z.string(),
        type: reportTypeSchema,
        reportFeedbackStatus: reportFeedbackStatusSchema,
        zoomLink: z.string().nullable(),
        zoomPassword: z.string().nullable(),
        desiredDate1: z.string().nullable(),
        desiredDate2: z.string().nullable(),
        desiredDate3: z.string().nullable(),
        applicationTime: z.string(),
        confirmedTime: z.string().nullable(),
      }),
    ),
    pageInfo: pageInfoSchema,
  })
  .transform((data) => ({
    ...data,
    myReportFeedbackInfos: data.myReportFeedbackInfos.map((feedback) => ({
      ...feedback,
      desiredDate1: feedback.desiredDate1 ? dayjs(feedback.desiredDate1) : null,
      desiredDate2: feedback.desiredDate2 ? dayjs(feedback.desiredDate2) : null,
      desiredDate3: feedback.desiredDate3 ? dayjs(feedback.desiredDate3) : null,
      applicationTime: dayjs(feedback.applicationTime),
      confirmedTime: feedback.confirmedTime
        ? dayjs(feedback.confirmedTime)
        : null,
    })),
  }));

export const useGetMyReportFeedbacks = (
  reportType?: string,
  pageNumber: number = 0,
  pageSize: number = 10,
) => {
  return useQuery({
    queryKey: ['getMyReportFeedbacks', reportType, pageNumber, pageSize],
    queryFn: async () => {
      // Mock data
      const mockData = {
        myReportFeedbackInfos: [
          {
            reportId: 1,
            applicationId: 101,
            title: '이력서 1:1 첨삭',
            type: 'RESUME',
            reportFeedbackStatus: 'COMPLETED',
            zoomLink: 'https://zoom.us/j/1234567890',
            zoomPassword: '123456',
            desiredDate1: '2024-08-15T10:00:00',
            desiredDate2: '2024-08-16T14:00:00',
            desiredDate3: '2024-08-17T16:00:00',
            applicationTime: '2024-08-01T10:00:00',
            confirmedTime: '2024-08-15T10:00:00',
          },
          {
            reportId: 2,
            applicationId: 102,
            title: '자기소개서 1:1 첨삭',
            type: 'PERSONAL_STATEMENT',
            reportFeedbackStatus: 'PENDING',
            zoomLink: null,
            zoomPassword: null,
            desiredDate1: '2024-08-20T11:00:00',
            desiredDate2: '2024-08-21T15:00:00',
            desiredDate3: '2024-08-22T17:00:00',
            applicationTime: '2024-08-10T14:00:00',
            confirmedTime: null,
          },
        ],
        pageInfo: {
          totalElements: 5,
          totalPages: 1,
          currentPage: pageNumber,
          currentElements: 2,
        },
      };

      return getMyReportFeedbacksSchema.parse(mockData);
    },
  });
};

const reportApplicationsForAdminInfoSchema = z.object({
  applicationId: z.number(),
  name: z.string(),
  contactEmail: z.string(),
  phoneNumber: z.string(),
  wishJob: z.string().nullable(),
  message: z.string().nullable(),
  reportApplicationStatus: reportApplicationStatusSchema,
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
  reportPriceType: reportPriceTypeSchema.nullable(),
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
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      reportUrl,
    }: {
      applicationId: number;
      reportUrl: string;
    }) => {
      const res = await axios.patch(
        `/report/application/${applicationId}/document`,
        {
          reportUrl,
        },
      );
      // Mock API call
      // return { success: true, message: 'Document uploaded successfully' };
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [useGetReportApplicationsForAdminQueryKey],
      });
      successCallback && successCallback();
    },
    onError: (error: Error) => {
      errorCallback && errorCallback(error);
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
      successCallback && successCallback();
    },
    onError: (error: Error) => {
      errorCallback && errorCallback(error);
    },
  });
};

// POST /api/v1/report/application
const createReportApplicationSchema = z.object({
  reportId: z.number(),
  reportPriceType: reportPriceTypeSchema,
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
  visibleDate: z.string().optional().nullable(),
  title: z.string().optional(),
  contents: z.string().optional(),
  notice: z.string().optional(),
  priceInfo: z
    .array(
      z.object({
        reportPriceType: reportPriceTypeSchema,
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
  reportPriceType: reportPriceTypeSchema,
  options: z.array(z.string()),
  isCanceled: z.boolean(),
  reportApplicationStatus: reportApplicationStatusSchema,
  reportFeedbackStatus: reportFeedbackStatusSchema.nullable(),
  reportFeedbackDesiredDate: z.string().nullable(),
});

const reportPaymentInfoSchema = z.object({
  paymentId: z.number(),
  finalPrice: z.number(),
  couponDiscount: z.number().nullable(),
  programPrice: z.number(),
  programDiscount: z.number(),
  reportRefundPrice: z.number().nullable(),
  feedbackRefundPrice: z.number().nullable(),
  reportPriceInfo: z.object({
    reportPriceType: reportPriceTypeSchema,
    price: z.number(),
    discountPrice: z.number(),
  }),
  reportOptionInfos: z.array(
    z.object({
      reportOptionId: z.number(),
      price: z.number(),
      discountPrice: z.number(),
      title: z.string(),
    }),
  ),
  feedbackPriceInfo: z
    .object({
      reportFeedbackId: z.number(),
      reportPriceType: reportPriceTypeSchema,
      feedbackPrice: z.number(),
      feedbackDiscountPrice: z.number(),
    })
    .nullable(),
  createDate: z.string(),
  lastModifiedDate: z.string(),
});

const reportPaymentDetailSchema = z.object({
  reportApplicationInfo: reportApplicationInfoSchema,
  reportPaymentInfo: reportPaymentInfoSchema,
  tossInfo: tossInfoType.nullable().optional(),
});

export const useGetReportPaymentDetailQueryKey = 'getReportPayment';

export const useGetReportPaymentDetailQuery = ({
  applicationId,
  enabled,
}: {
  applicationId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [useGetReportPaymentDetailQueryKey],
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
        queryKey: [
          useGetReportApplicationsForAdminQueryKey,
          useGetReportPaymentDetailQueryKey,
        ],
      });
      successCallback && successCallback();
    },
    onError: (error: Error) => {
      errorCallback && errorCallback(error);
    },
  });
};

// Utility function to generate mock data (for demonstration purposes)
// const generateMockData = <T extends z.ZodType>(schema: T): z.infer<T> => {
//   const shape = schema._def.shape();
//   const mockData: any = {};

//   for (const [key, value] of Object.entries(shape)) {
//     if (value instanceof z.ZodString) {
//       mockData[key] = 'mock string';
//     } else if (value instanceof z.ZodNumber) {
//       mockData[key] = 123;
//     } else if (value instanceof z.ZodBoolean) {
//       mockData[key] = true;
//     } else if (value instanceof z.ZodArray) {
//       mockData[key] = [generateMockData(value.element)];
//     } else if (value instanceof z.ZodObject) {
//       mockData[key] = generateMockData(value);
//     } else if (value instanceof z.ZodEnum) {
//       mockData[key] = value.options[0];
//     } else if (value instanceof z.ZodNullable) {
//       mockData[key] = null;
//     } else {
//       mockData[key] = undefined;
//     }
//   }

//   return schema.parse(mockData);
// };
