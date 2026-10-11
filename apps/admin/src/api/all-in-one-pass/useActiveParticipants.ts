import { useQuery } from '@tanstack/react-query';
import { activeParticipantFixtures } from './mock/activeParticipantFixtures';
import { mockDelay } from './mock/mockDelay';

// A-8 참여중 유저 목록 조회. BE 미개발 — mock. 스펙 나오면 queryFn만 axios로 교체.
export const activeParticipantListQueryKey =
  'allInOnePassActiveParticipantList';

export const useGetActivePassParticipantsQuery = () =>
  useQuery({
    queryKey: [activeParticipantListQueryKey],
    queryFn: () => mockDelay([...activeParticipantFixtures]),
  });
