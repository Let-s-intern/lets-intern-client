import { useMutation, useQuery } from '@tanstack/react-query';

import {
  CreateChallengeReq,
  getChallengeIdSchema,
  getLiveIdSchema,
  programAdminSchema,
  programSchema,
} from '../schema';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';

const useLiveQueryKey = 'useLiveQueryKey';

const useChallengeQueryKey = 'useChallengeQueryKey';

export const useChallengeQuery = ({
  challengeId,
  enabled,
}: {
  challengeId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useChallengeQueryKey, challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdSchema.parse(res.data.data);
    },
  });
};

export const useLiveQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useLiveQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}`);
      return getLiveIdSchema.parse(res.data.data);
    },
  });
};

export const useProgramQuery = ({
  programId,
  type,
}: {
  type: 'live' | 'vod' | 'challenge';
  programId: number;
}) => {
  const liveQuery = useLiveQuery({
    liveId: programId,
    enabled: type === 'live',
  });

  const challengeQuery = useChallengeQuery({
    challengeId: programId,
    enabled: type === 'challenge',
  });

  switch (type) {
    case 'live':
      return {
        type: 'live' as const,
        query: liveQuery,
      };
    case 'vod':
      throw new Error('Not implemented');
    case 'challenge':
      return {
        type: 'challenge' as const,
        query: challengeQuery,
      };
  }
};

export type ProgramQuery = ReturnType<typeof useProgramQuery>;

export const useUserProgramQuery = ({
  pageable,
  searchParams,
}: {
  pageable: IPageable;
  searchParams: URLSearchParams;
}) => {
  return useQuery({
    queryKey: [useUserProgramQuery, pageable.page, searchParams.toString()],
    queryFn: async () => {
      const pageableQuery = Object.entries({
        ...pageable,
      })?.map(([key, value]) => `${key}=${value}`);

      const res = await axios.get(
        `/program?${pageableQuery.join('&')}&${searchParams.toString()}`,
      );

      return programSchema.parse(res.data.data);
    },
  });
};

export const useGetProgramAdminQueryKey = 'useGetProgramAdminQueryKey';

export const useGetProgramAdminQuery = ({
  pageable,
}: {
  pageable: IPageable;
}) => {
  return useQuery({
    queryKey: [useGetProgramAdminQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get(`/program/admin`, { params: pageable });
      return programAdminSchema.parse(res.data.data);
    },
  });
};

export const usePostChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateChallengeReq) => {
      const res = await axios.post(`/challenge`, data);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};
