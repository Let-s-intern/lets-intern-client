// 랜딩(구매) 페이지 상품 상세 조회 훅. 유저용 공개 조회 API 전까지 mock 반환
// (dashboard.ts 와 동일 패턴). 실제 API 나오면 queryFn 본문만 axios 호출로 교체하고
// ../mock 을 삭제한다. queryKey 에 id(membershipId)를 넣어 패스별 캐시 분리.
import { useQuery } from '@tanstack/react-query';
import { landingFixture } from '../mock/landingFixtures';
import { mockDelay } from '../mock/mockDelay';
import type { AllInOnePassLanding } from '../types';

export const useGetAllInOnePassLanding = (id: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'landing', id],
    queryFn: (): Promise<AllInOnePassLanding> => mockDelay(landingFixture),
    refetchOnWindowFocus: false,
  });
