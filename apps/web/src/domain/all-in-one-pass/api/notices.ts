// 공지/가이드 조회 — type 미전달로 전체 받고 NoticesView가 NOTICE/GUIDE 필터
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { AllInOnePassNotice } from '../types';

const passNoticeSchema = z.object({
  id: z.number(),
  type: z.enum(['NOTICE', 'GUIDE']),
  title: z.string(),
  contents: z.string(),
  createDate: z.string(),
});

export const useGetPassNotices = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'notices', applicationId],
    queryFn: async (): Promise<AllInOnePassNotice[]> => {
      const res = await axios.get('/membership_notice', {
        params: { membershipApplicationId: applicationId },
      });
      return z.array(passNoticeSchema).parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });
