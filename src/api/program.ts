import { useMutation, useQuery } from '@tanstack/react-query';

import { useCallback } from 'react';
import {
  CreateChallengeReq,
  CreateLiveReq,
  CreateVodReq,
  getChallengeIdSchema,
  getLiveIdSchema,
  programAdminSchema,
  programSchema,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
  UpdateVodReq,
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

export const useDeleteProgramMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const deleteChallenge = useDeleteChallengeMutation({
    successCallback,
    errorCallback,
  });
  const deleteLive = useDeleteLiveMutation({
    successCallback,
    errorCallback,
  });
  const deleteVod = useDeleteVodMutation({
    successCallback,
    errorCallback,
  });
  return useCallback(
    (arg: { type: ProgramTypeUpperCase; id: number }) => {
      switch (arg.type) {
        case 'CHALLENGE':
          return deleteChallenge.mutateAsync(arg.id);
        case 'LIVE':
          return deleteLive.mutateAsync(arg.id);
        case 'VOD':
          return deleteVod.mutateAsync(arg.id);
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [deleteChallenge, deleteLive, deleteVod],
  );
};

export const usePatchVisibleProgramMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  const patchChallenge = usePatchChallengeMutation({
    successCallback,
    errorCallback,
  });
  const patchLive = usePatchLiveMutation({
    successCallback,
    errorCallback,
  });
  const patchVod = usePatchVodMutation({
    successCallback,
    errorCallback,
  });

  return useCallback(
    (arg: { type: ProgramTypeUpperCase; id: number; isVisible: boolean }) => {
      switch (arg.type) {
        case 'CHALLENGE':
          return patchChallenge.mutateAsync({
            challengeId: arg.id,
            isVisible: arg.isVisible,
          });
        case 'LIVE':
          return patchLive.mutateAsync({
            liveId: arg.id,
            isVisible: arg.isVisible,
          });
        case 'VOD':
          return patchVod.mutateAsync({
            vodId: arg.id,
            isVisible: arg.isVisible,
          });
        case 'REPORT':
          throw new Error('Not implemented');
      }
    },
    [patchChallenge, patchLive, patchVod],
  );
};
