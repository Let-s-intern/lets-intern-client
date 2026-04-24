import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import axios from '@/utils/axios';

// --- Zod Schemas ---

const questionAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const magnetApplicationByMagnetSchema = z.object({
  magnetApplicationId: z.number(),
  name: z.string().nullable(),
  phoneNum: z.string().nullable(),
  grade: z.string().nullable(),
  wishField: z.string().nullable(),
  wishJob: z.string().nullable(),
  wishIndustry: z.string().nullable(),
  wishCompany: z.string().nullable(),
  marketingAgree: z.boolean(),
  questionAnswerList: z.array(questionAnswerSchema),
});

// --- Types ---

export type MagnetApplicationByMagnet = z.infer<
  typeof magnetApplicationByMagnetSchema
>;

// --- Query Keys ---

export const magnetApplicationByMagnetQueryKey =
  'magnetApplicationByMagnetQueryKey';

// --- Query Hooks ---

// GET /admin/magnet/{magnetId}/applications — 마그넷별 신청자 목록 조회
export const useMagnetApplicationByMagnetIdQuery = (
  magnetId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [magnetApplicationByMagnetQueryKey, magnetId],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<MagnetApplicationByMagnet[]> => {
      const res = await axios.get(
        `/magnet/${magnetId}/applications`,
      );
      return z
        .array(magnetApplicationByMagnetSchema)
        .parse(res.data.data.magnetApplicationList);
    },
  });
};
