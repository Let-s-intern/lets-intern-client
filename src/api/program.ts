import { useQuery } from '@tanstack/react-query';

import { getLiveIdSchema, programSchema } from '../schema';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';
import { useChallengeQuery } from './challenge';

const useLiveQueryKey = 'useLiveQueryKey';
const useProgramAdminQueryKey = 'useProgramAdminQueryKey';

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

export const useProgramListQeury = ({
  pageable,
  type,
  classification,
  status,
}: {
  pageable: IPageable;
  type?: 'LIVE' | 'VOD' | 'CHALLENGE';
  classification?:
    | 'CAREER_SEARCH'
    | 'DOCUMENT_PREPARATION'
    | 'MEETING_PREPARATION'
    | 'PASS';
  status?: 'PREV' | 'PROCEEDING' | 'POST';
}) => {
  return useQuery({
    queryKey: [useProgramAdminQueryKey, pageable],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { pageable, type, classification, status },
      });
      return programSchema.parse(res.data.data);
    },
  });
};
