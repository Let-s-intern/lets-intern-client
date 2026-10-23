// U-8 패스 ONLY 자료집 — GET /{id}/library (accessible·typeList·libraryList).
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const libraryItemSchema = z.object({
  membershipBenefitId: z.number(),
  type: z.string().nullish(),
  title: z.string().nullish(),
  introduction: z.string().nullish(),
  link: z.string().nullish(),
  thumbnail: z.string().nullish(),
});
const librarySchema = z.object({
  accessible: z.boolean().nullish(), // 이용기간 밖이면 false(+ libraryList 빈 배열)
  typeList: z.array(z.string()).default([]), // 필터 칩용 전체 유형
  libraryList: z.array(libraryItemSchema).default([]),
});
export type LibraryItem = z.infer<typeof libraryItemSchema>;
export type PassLibrary = z.infer<typeof librarySchema>;

export const useGetPassLibrary = (applicationId: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'library', applicationId],
    queryFn: async (): Promise<PassLibrary> => {
      const res = await axios.get(
        `/membership-application/${applicationId}/library`,
      );
      return librarySchema.parse(res.data.data);
    },
    enabled: Number.isFinite(applicationId) && applicationId > 0,
    refetchOnWindowFocus: false,
  });
