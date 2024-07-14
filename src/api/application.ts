import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { z } from 'zod';
import {
  challengeApplicationPriceType,
  liveApplicationPriceType,
  programStatus,
} from '../schema';

import { ProgramType } from '../types/common';
import axios from '../utils/axios';

export const programApplicationSchema = z
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

export const UseProgramApplicationQueryKey = 'useProgramApplicationQueryKey';

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
    retry: 0,
  });
};

export const UseProgramTitleQueryKey = 'useProgramTitleQueryKey';

export const useProgramTitleQuery = (
  programType: ProgramType,
  programId: number,
) => {
  return useQuery({
    queryKey: [UseProgramTitleQueryKey, programType, programId],
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
    paymentKey: string;
    orderId: string;
    amount: string;
  };
  contactEmail?: string;
  motivate?: string;
  question?: string;
}

export const usePostApplicationMutation = (
  successCallback: () => void,
  errorCallback: (error: Error) => void,
) => {
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
      successCallback();
      //이 mutation이 성공하면 재로딩되어야 하는 쿼리키 invalidate 처리 후 successCallback
      // client.invalidateQueries(UseUserInfoQueryKey)
      // .then(() => successCallback());
    },
    onError: (error) => {
      errorCallback(error);
    },
  });
};
