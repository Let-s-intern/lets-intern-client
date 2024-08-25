import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { z } from 'zod';
import { pageInfo } from '../schema';

export const reportTypeSchema = z.enum([
  'RESUME',
  'PERSONAL_STATEMENT',
  'PORTFOLIO',
]);

export const getReportAdminQueryKey = 'getReportAdmin';

export const getReportAdminSchema = z
  .object({
    reportForAdminInfos: z.array(
      z.object({
        reportId: z.number(),
        reportType: reportTypeSchema.nullable().optional(),
        title: z.string().nullable().optional(),
        applicationCount: z.number().nullable().optional(),
        feedbackApplicationCount: z.number().nullable().optional(),
        visibleDate: z.string().nullable().optional(),
        createDateTime: z.string().nullable().optional(),
      }),
    ),
    pageInfo,
  })
  .transform((data) => {
    return {
      ...data,
      reportForAdminInfos: data.reportForAdminInfos.map((report) => ({
        ...report,
        visibleDate: report.visibleDate ? dayjs(report.visibleDate) : null,
        createDateTime: report.createDateTime
          ? dayjs(report.createDateTime)
          : null,
      })),
    };
  });

/** ADMIN 전체 Report 프로그램을 가져옵니다. */
export const useGetReportAdmin = () => {
  return useQuery({
    queryKey: [getReportAdminQueryKey],
    queryFn: async () => {
      // const res = await axios.get(`/report`, {
      //   params: { pageable: { page: 0, size: 100 } },
      // });

      /** TODO: Remove mock */
      const res = {
        data: {
          data: {
            reportForAdminInfos: [
              {
                reportId: 1,
                reportType: 'RESUME',
                title: '이력서',
                applicationCount: 10,
                feedbackApplicationCount: 5,
                visibleDate: '2021-01-01T00:00:00',
                createDateTime: '2021-01-01T00:00:00',
              },
              {
                reportId: 2,
                reportType: 'PERSONAL_STATEMENT',
                title: '자기소개서',
                applicationCount: 10,
                feedbackApplicationCount: 5,
                visibleDate: '2021-01-01T00:00:00',
                createDateTime: '2021-01-01T00:00:00',
              },
              {
                reportId: 3,
                reportType: 'PORTFOLIO',
                title: '포트폴리오',
                applicationCount: 10,
                feedbackApplicationCount: 5,
                visibleDate: '2021-01-01T00:00:00',
                createDateTime: '2021-01-01T00:00:00',
              },
            ],
            pageInfo: {
              totalElements: 3,
              totalPages: 1,
              currentPage: 0,
              currentElements: 3,
            },
          },
        },
      };

      return getReportAdminSchema.parse(res.data.data);
    },
  });
};
