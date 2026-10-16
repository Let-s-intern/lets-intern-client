import { fetchJson } from '@letscareer/api';
import dayjs from '@/lib/dayjs';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  UsePaymentDetailQueryKey,
  UsePaymentQueryKey,
} from './payment/payment';
import { tossInfoType } from './payment/paymentSchema';
import { useUserQueryKey } from './user/user';
import { UseVodPassQueryKey, vodPassStatusSchema } from './vodPass';

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
  // 챌린지와 함께 결제하는 VOD 이용권 상품 (LC-3438). 상품이 비활성이거나 서버 배포 전이면 null·누락이다.
  vodPassProduct: z
    .object({
      id: z.number(),
      title: z.string(),
      price: z.number(),
      // 1개월 초과분에 매월 더해지는 금액. 없으면 개월 선택을 지원하지 않는 서버라 1개월만 판다
      additionalMonthPrice: z.number().nullable().optional(),
      durationDays: z.number(),
    })
    .nullable()
    .optional(),
});

export type ProgramApplicationFormInfo = z.infer<
  typeof programApplicationSchema
>;

export const fetchProgramApplication = async (
  programId: string,
): Promise<ProgramApplicationFormInfo> => {
  return fetchJson<ProgramApplicationFormInfo>(
    `${process.env.NEXT_PUBLIC_SERVER_API}/challenge/${programId}/application`,
    {
      code: 'APPLICATION_FETCH_FAILED',
      displayMessage: '신청 정보 조회에 실패했습니다.',
      parse: (data) => programApplicationSchema.parse(data),
    },
  );
};

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
  // VOD 이용권을 함께 결제할 때만 네 값을 모두 보낸다 (LC-3438). 하나라도 있으면 서버가 전부 요구한다.
  vodPassProductId?: number;
  vodPassExpectedPrice?: number;
  vodPassExpectedDurationDays?: number;
  vodPassMonths?: number;
}

export const usePostApplicationMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      programId,
      programType,
      requestBody,
    }: {
      programId: number;
      programType: string;
      requestBody: PostApplicationInterface;
    }) => {
      return (
        await axios.post(
          `/application/${programId}?type=${programType.toUpperCase()}`,
          requestBody,
        )
      ).data.data;
    },
    onSuccess: () => {
      successCallback?.();
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });
};

export const postApplicationResultSchema = z.object({
  tossInfo: tossInfoType.nullable().optional(),
  // 이용권을 함께 결제한 경우에만 내려온다 (LC-3438). status 는 ACTIVE 또는 SCHEDULED 다.
  vodPass: z
    .object({
      applicationId: z.number(),
      paymentId: z.number().nullable().optional(),
      durationDays: z.number().nullable().optional(),
      purchasedMonths: z.number().nullable().optional(),
      status: vodPassStatusSchema,
      startsAt: z.string().nullable().optional(),
      endsAt: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  payments: z
    .array(
      z.object({
        paymentId: z.number(),
        applicationId: z.number(),
        orderId: z.string(),
        type: z.enum(['CHALLENGE', 'VOD_PASS']),
        paidAmount: z.number(),
      }),
    )
    .nullable()
    .optional(),
});

export type PostApplicationResult = z.infer<typeof postApplicationResultSchema>;

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

export const useApplicationDownloadQuery = ({
  applicationId,
  type,
  enabled,
}: {
  applicationId: number | null | undefined;
  type: ApplicationDownloadType;
  enabled: boolean;
}) =>
  useQuery<ApplicationDownloadResponse>({
    queryKey: ['applicationDownload', applicationId, type],
    queryFn: () =>
      getApplicationDownloadStatus({ applicationId: applicationId!, type }),
    enabled: enabled && typeof applicationId === 'number',
  });

export const useCancelApplicationMutation = ({
  applicationId,
  paymentId,
  successCallback,
  errorCallback,
}: {
  applicationId: number;
  paymentId: string | number;
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ programType }: { programType: string }) => {
      const res = await axios.delete(`/application/${applicationId}`, {
        params: { type: programType.toUpperCase() },
      });
      return res.data;
    },
    onSuccess: () => {
      if (successCallback) {
        successCallback();
      }
      client.invalidateQueries({
        queryKey: [UsePaymentQueryKey],
      });
      client.invalidateQueries({
        queryKey: [UsePaymentDetailQueryKey, paymentId],
      });
      // VOD 이용권 환불 뒤 이용권 상태(CANCELED)를 다시 받는다
      client.invalidateQueries({
        queryKey: [UseVodPassQueryKey],
      });
    },
    onError: (error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};

export interface PatchApplicationSurveyInterface {
  awarenessPath: string;
  decisionPeriod: string;
  paymentPath: string;
}

export type PatchApplicationSurveyField = keyof PatchApplicationSurveyInterface;

export const usePatchApplicationSurveyMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      programType,
      applicationId,
      requestBody,
    }: {
      programType: string;
      applicationId: number;
      requestBody: PatchApplicationSurveyInterface;
    }) => {
      const res = await axios.patch(
        `/application/${applicationId}/survey`,
        requestBody,
        {
          params: { type: programType.toUpperCase() },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      if (successCallback) {
        successCallback();
      }
      client.invalidateQueries({
        queryKey: [useUserQueryKey],
      });
      client.invalidateQueries({
        queryKey: [useProgramApplicationQueryKey],
      });
    },
    onError: (error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};

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
        // 챌린지 오픈채팅방. 어드민이 챌린지 기본정보에서 입력한 값(Challenge.chatLink/chatPassword)이며
        // BE 응답 추가 전까지는 undefined 라 오픈채팅방 버튼이 렌더되지 않는다.
        chatLink: z.string().nullable().optional(),
        chatPassword: z.string().nullable().optional(),
        // 셀프 플랜 업그레이드 가능 여부 (LC-3247). 챌린지가 아니거나 서버 배포 전이면 값이 오지 않는다.
        canUpgradePlan: z
          .boolean()
          .nullable()
          .optional()
          .transform((canUpgradePlan) => canUpgradePlan ?? false),
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

export const mypageApplicationsQueryOptions = {
  queryKey: [useMypageApplicationsQueryKey] as const,
  queryFn: async () => {
    const res = await axiosV2.get('/user/applications');
    return mypageApplicationsSchema
      .parse(res.data.data)
      .applicationList.filter(
        (application) => application.programType !== 'REPORT',
      );
  },
};

export const useMypageApplicationsQuery = () => {
  return useQuery(mypageApplicationsQueryOptions);
};

const participationInfoSchema = z.object({
  name: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
});

export const useGetParticipationInfo = () => {
  return useQuery({
    queryKey: ['getParticipationInfo'],
    queryFn: async () => {
      const res = await axios.get('/user/participation-info');

      return participationInfoSchema.parse(res.data.data);
    },
  });
};
