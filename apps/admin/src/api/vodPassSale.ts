import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import axios from '@/utils/axios';

/** 서버 `ProgramType` 중 VOD 이용권 판매를 켜고 끌 수 있는 유형 */
export const VOD_PASS_SALE_PROGRAM_TYPES = [
  'CHALLENGE',
  'LIVE',
  'VOD',
  'REPORT',
  'GUIDEBOOK',
] as const;

export type VodPassSaleProgramType =
  (typeof VOD_PASS_SALE_PROGRAM_TYPES)[number];

/** GET /api/v1/admin/vod-pass-sale 응답. 판매가 켜진 프로그램만 내려온다 */
export const vodPassSaleSchema = z.object({
  programs: z.array(
    z.object({
      programType: z.string(),
      programId: z.number(),
    }),
  ),
});

export const vodPassSaleQueryKey = ['admin', 'vodPassSale'];

export const toVodPassSaleKey = (programType: string, programId: number) =>
  `${programType}:${programId}`;

/** GET /api/v1/admin/vod-pass-sale */
export const useVodPassSaleQuery = () =>
  useQuery({
    queryKey: vodPassSaleQueryKey,
    queryFn: async () => {
      const res = await axios.get('/admin/vod-pass-sale');
      const { programs } = vodPassSaleSchema.parse(res.data.data);
      return new Set(
        programs.map((p) => toVodPassSaleKey(p.programType, p.programId)),
      );
    },
  });

/** PUT /api/v1/admin/vod-pass-sale */
export const useUpdateVodPassSaleMutation = ({
  onError,
}: {
  onError?: (message: string) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: {
      programType: VodPassSaleProgramType;
      programId: number;
      enabled: boolean;
    }) => {
      await axios.put('/admin/vod-pass-sale', req);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: vodPassSaleQueryKey }),
    onError: (error) => {
      onError?.(
        error instanceof Error && error.message
          ? error.message
          : '저장에 실패했습니다.',
      );
    },
  });
};
