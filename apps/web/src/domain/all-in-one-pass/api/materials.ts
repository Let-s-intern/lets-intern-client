// U-8 패스 ONLY 자료집 조회 훅. 유저 조회 API 전까지 mock 반환(dashboard.ts와 동일 패턴).
import { useQuery } from '@tanstack/react-query';
import { materialFixtures } from '../mock/materialFixtures';
import { mockDelay } from '../mock/mockDelay';
import type { PassMaterial } from '../types';

export const useGetPassMaterials = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'materials', applicationId],
    queryFn: (): Promise<PassMaterial[]> => mockDelay(materialFixtures),
    refetchOnWindowFocus: false,
  });
