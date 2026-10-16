// U-5 공지사항/패스 가이드 조회 훅. 유저 조회 API 전까지 mock 반환(dashboard.ts와 동일 패턴).
import { useQuery } from '@tanstack/react-query';
import { noticeFixtures } from '../mock/noticeFixtures';
import { mockDelay } from '../mock/mockDelay';
import type { AllInOnePassNotice } from '../types';

export const useGetPassNotices = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'notices', applicationId],
    queryFn: (): Promise<AllInOnePassNotice[]> => mockDelay(noticeFixtures),
    refetchOnWindowFocus: false,
  });
