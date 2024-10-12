import { useMutation, useQuery } from '@tanstack/react-query';

import {
  CreateChallengeReq,
  CreateLiveReq,
  CreateVodReq,
  getChallengeIdSchema,
  getLiveIdSchema,
  getVodIdSchema,
  programAdminSchema,
  programSchema,
  UpdateChallengeReq,
  UpdateLiveReq,
  UpdateVodReq,
} from '../schema';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';

export const useProgramQuery = ({
  programId,
  type,
}: {
  type: 'live' | 'vod' | 'challenge';
  programId: number;
}) => {
  const liveQuery = useGetLiveQuery({
    liveId: programId,
    enabled: type === 'live',
  });

  const challengeQuery = useGetChallengeQuery({
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

export const useGetChallengeQueryKey = 'useGetChallengeQueryKey';

export const useGetChallengeQuery = ({
  challengeId,
  enabled,
}: {
  challengeId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetChallengeQueryKey, challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 */
export const getChallenge = async (challengeId: number) => {
  const res = await axios.get(`/challenge/${challengeId}`);
  return getChallengeIdSchema.parse(res.data.data);
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
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateChallengeReq & { challengeId: number }) => {
      const { challengeId, ...rest } = data;
      const res = await axios.patch(`/challenge/${challengeId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (challengeId: number) => {
      const res = await axios.delete(`/challenge/${challengeId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveQueryKey = 'useGetLiveQueryKey';

export const useGetLiveQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}`);
      return getLiveIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 */
export const getLive = async (liveId: number) => {
  const res = await axios.get(`/live/${liveId}`);
  return getLiveIdSchema.parse(res.data.data);
};

export const usePostLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateLiveReq) => {
      const res = await axios.post(`/live`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateLiveReq & { liveId: number }) => {
      const { liveId, ...rest } = data;
      const res = await axios.post(`/liveId/${liveId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (liveId: number) => {
      const res = await axios.delete(`/live/${liveId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetVodQueryKey = 'useGetVodQueryKey';

export const useGetVodQuery = ({
  vodId,
  enabled,
}: {
  vodId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetVodQueryKey, vodId],
    queryFn: async () => {
      const res = await axios.get(`/vod/${vodId}`);
      return getVodIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 */
export const getVod = async (vodId: number) => {
  const res = await axios.get(`/vod/${vodId}`);
  return getVodIdSchema.parse(res.data.data);
};

export const usePostVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateVodReq) => {
      const res = await axios.post(`/vod`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateVodReq & { vodId: number }) => {
      const { vodId, ...rest } = data;
      const res = await axios.post(`/vodId/${vodId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (vodId: number) => {
      const res = await axios.delete(`/vod/${vodId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};
