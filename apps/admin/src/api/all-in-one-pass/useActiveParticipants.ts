import { useQuery } from '@tanstack/react-query';
import { activeParticipantFixtures } from './mock/activeParticipantFixtures';
import { mockDelay } from './mock/passStore';

/**
 * A-8 참여중 유저 목록(전 패스 통합) 조회 훅.
 *
 * BE 미개발 — 현재는 mock 시드(./mock/activeParticipantFixtures)를 읽는다.
 * 스펙이 나오면 queryFn 본문만 axios 로 교체하고 ./mock 을 삭제한다.
 */

export const activeParticipantListQueryKey =
  'allInOnePassActiveParticipantList';

export const useGetActivePassParticipantsQuery = () =>
  useQuery({
    queryKey: [activeParticipantListQueryKey],
    queryFn: () => mockDelay([...activeParticipantFixtures]),
  });
