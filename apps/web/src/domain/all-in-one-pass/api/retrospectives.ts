// U-4 회고 회차 조회 훅. 유저 조회 API 전까지 mock(dashboard.ts와 동일 패턴).
import { useQuery } from '@tanstack/react-query';
import { retrospectiveFixtures } from '../mock/retrospectiveFixtures';
import { mockDelay } from '../mock/mockDelay';
import type { PassRetrospectiveRound } from '../types';

export const useGetPassRetrospectives = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'retrospectives', applicationId],
    queryFn: (): Promise<PassRetrospectiveRound[]> =>
      mockDelay(retrospectiveFixtures),
    refetchOnWindowFocus: false,
  });
