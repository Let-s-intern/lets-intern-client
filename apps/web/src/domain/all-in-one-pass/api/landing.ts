// 랜딩 상품 상세 조회. 공개 API(GET /api/v1/membership/{id}) 전까지 mock — queryFn만 교체.
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
