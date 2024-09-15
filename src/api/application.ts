import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { z } from 'zod';
import {
  challengeApplicationPriceType,
  liveApplicationPriceType,
  programStatus,
  programType,
} from '../schema';
import { UsePaymentDetailQueryKey, UsePaymentQueryKey } from './payment';

import { ProgramType } from '../types/common';
import axios from '../utils/axios';

const programApplicationSchema = z
  .object({
    applied: z.boolean().nullable().optional(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    contactEmail: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    criticalNotice: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    statusType: programStatus,
    priceList: z.array(challengeApplicationPriceType).nullable().optional(),
    price: liveApplicationPriceType.nullable().optional(),
  })
  .transform((data) => {
    return {
      ...data,
      startDate: data.startDate ? dayjs(data.startDate) : null,
      endDate: data.endDate ? dayjs(data.endDate) : null,
      deadline: data.deadline ? dayjs(data.deadline) : null,
    };
  });

export type ProgramApplicationFormInfo = z.infer<
  typeof programApplicationSchema
>;

const UseProgramApplicationQueryKey = 'useProgramApplicationQueryKey';

export const useProgramApplicationQuery = (
  programType: ProgramType,
  programId: number,
) => {
  return useQuery({
    queryKey: [UseProgramApplicationQueryKey, programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/application`);
      return programApplicationSchema.parse(res.data.data);
    },
  });
};

const useProgramTitleQueryKey = 'useProgramTitleQueryKey';

const useProgramTitleQuery = (programType: ProgramType, programId: number) => {
  return useQuery({
    queryKey: [useProgramTitleQueryKey, programType, programId],
    queryFn: async () => {
      const res = await axios.get(`/${programType}/${programId}/title`);
      return res.data.data;
    },
    retry: 0,
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

export const usePostApplicationMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  // const client = useQueryClient();

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
    onSuccess: (data) => {
      successCallback?.();
      //이 mutation이 성공하면 재로딩되어야 하는 쿼리키 invalidate 처리 후 successCallback
      // client.invalidateQueries(UseUserInfoQueryKey)
      // .then(() => successCallback());
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });
};

export const useCancelApplicationMutation = ({
  applicationId,
  successCallback,
  errorCallback,
}: {
  applicationId: number;
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
      successCallback && successCallback();
      client.invalidateQueries({
        queryKey: [UsePaymentQueryKey, UsePaymentDetailQueryKey, applicationId],
      });
    },
    onError: (error) => {
      errorCallback && errorCallback(error);
    },
  });
};

const useMypageApplicationsQueryKey = 'useMypageApplicationsQueryKey';

const applicationStatus = z.union([
  z.literal('WAITING'),
  z.literal('IN_PROGRESS'),
  z.literal('DONE'),
]);

const mypageApplicationsSchema = z
  .object({
    applicationList: z.array(
      z.object({
        id: z.number().nullable().optional(),
        status: applicationStatus.nullable().optional(),
        programId: z.number().nullable().optional(),
        programType: programType.nullable().optional(),
        programStatusType: programStatus.nullable().optional(),
        programTitle: z.string().nullable().optional(),
        programShortDesc: z.string().nullable().optional(),
        programThumbnail: z.string().nullable().optional(),
        programStartDate: z.string().nullable().optional(),
        programEndDate: z.string().nullable().optional(),
        reviewId: z.number().nullable().optional(),
        paymentId: z.number().nullable().optional(),
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
      })),
    };
  });

export type MypageApplication = z.infer<
  typeof mypageApplicationsSchema
>['applicationList'][0];

export const useMypageApplicationsQuery = () => {
  return useQuery({
    queryKey: [useMypageApplicationsQueryKey],
    queryFn: async () => {
      const res = await axios.get('/user/applications');
      return mypageApplicationsSchema
        .parse(res.data.data)
        .applicationList.filter(
          (application) => application.programType !== 'REPORT',
        );
    },
  });
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
