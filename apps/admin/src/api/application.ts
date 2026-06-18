import dayjs from '@/lib/dayjs';
import axiosV2 from '@/utils/axiosV2';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import {
  challengeApplicationPriceType,
  ChallengePricePlanEnum,
  guidebookApplicationPriceType,
  liveApplicationPriceType,
  vodApplicationPriceType,
  ProgramStatusEnum,
  ProgramTypeEnum,
  reportTypeSchema,
} from '../schema';
import { ProgramType } from '../types/common';
import axios from '../utils/axios';

export const programApplicationSchema = z.object({
  applied: z.boolean().nullable().optional(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  criticalNotice: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  statusType: ProgramStatusEnum.optional(),
  priceList: z.array(challengeApplicationPriceType).nullable().optional(),
  price: z
    .union([
      liveApplicationPriceType,
      guidebookApplicationPriceType,
      vodApplicationPriceType,
    ])
    .nullable()
    .optional(),
});

export type ProgramApplicationFormInfo = z.infer<
  typeof programApplicationSchema
>;

export const useProgramApplicationQueryKey = 'useProgramApplicationQueryKey';

export const useProgramApplicationQuery = (
  programType: ProgramType,
  programId: number,
) => {
  return useQuery({
    queryKey: [useProgramApplicationQueryKey, programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/application`);
      return programApplicationSchema.parse(res.data.data);
    },
  });
};

export interface PostApplicationInterface {
  paymentInfo: {
    couponId: number | null;
    priceId: number;
    paymentKey: string | null;
    orderId: string;
    amount: string;
  };
  contactEmail?: string;
  motivate?: string;
  question?: string;
}

export type ApplicationDownloadType =
  | 'GUIDEBOOK'
  | 'CHALLENGE'
  | 'LIVE'
  | 'VOD'
  | 'REPORT';

export const patchApplicationDownload = async ({
  applicationId,
  type,
}: {
  applicationId: number;
  type: ApplicationDownloadType;
}) => {
  await axios.patch(`/application/${applicationId}/download`, null, {
    params: { type },
  });
};

const applicationDownloadResponseSchema = z.object({
  isDownloaded: z.boolean(),
  downloadedAt: z.string().nullable().optional(),
});

export type ApplicationDownloadResponse = z.infer<
  typeof applicationDownloadResponseSchema
>;

export const getApplicationDownloadStatus = async ({
  applicationId,
  type,
}: {
  applicationId: number;
  type: ApplicationDownloadType;
}): Promise<ApplicationDownloadResponse> => {
  const res = await axios.get(`/application/${applicationId}/download`, {
    params: { type },
  });
  return applicationDownloadResponseSchema.parse(res.data.data);
};

export interface PatchApplicationSurveyInterface {
  awarenessPath: string;
  decisionPeriod: string;
  paymentPath: string;
}

const applicationStatus = z.union([
  z.literal('WAITING'),
  z.literal('IN_PROGRESS'),
  z.literal('DONE'),
]);

export const mypageApplicationsSchema = z
  .object({
    applicationList: z.array(
      z.object({
        id: z.number().nullable().optional(),
        createDate: z.string().nullable().optional(),
        status: applicationStatus.nullable().optional(),
        programId: z.number().nullable().optional(),
        programType: ProgramTypeEnum.nullable().optional(),
        programStatusType: ProgramStatusEnum.nullable().optional(),
        reportType: reportTypeSchema.nullable().optional(),
        programTitle: z.string().nullable().optional(),
        programShortDesc: z.string().nullable().optional(),
        programThumbnail: z.string().nullable().optional(),
        programStartDate: z.string().nullable().optional(),
        programEndDate: z.string().nullable().optional(),
        reviewId: z.number().nullable().optional(),
        paymentId: z.number().nullable().optional(),
        pricePlanType: ChallengePricePlanEnum.nullable().default('BASIC'),
        challengeOptionList: z
          .array(z.string())
          .nullable()
          .default(() => []),
        contentUrl: z.string().nullable().optional(),
        contentFileUrl: z.string().nullable().optional(),
        isDownloaded: z.boolean().nullable().optional(),
      }),
    ),
  })
  .transform((data) => {
    return {
      applicationList: data.applicationList.map((application) => ({
        ...application,
        programStartDate: application.programStartDate
          ? dayjs(application.programStartDate)
          : null,
        programEndDate: application.programEndDate
          ? dayjs(application.programEndDate)
          : null,
        createDate: application.createDate
          ? dayjs(application.createDate)
          : null,
      })),
    };
  });

export type MypageApplication = z.infer<
  typeof mypageApplicationsSchema
>['applicationList'][0];

export const useMypageApplicationsQueryKey = 'useMypageApplicationsQueryKey';

export const useMypageApplicationsQuery = () => {
  return useQuery({
    queryKey: [useMypageApplicationsQueryKey],
    queryFn: async () => {
      const res = await axiosV2.get('/user/applications');
      return mypageApplicationsSchema
        .parse(res.data.data)
        .applicationList.filter(
          (application) => application.programType !== 'REPORT',
        );
    },
  });
};

