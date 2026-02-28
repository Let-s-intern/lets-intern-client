import { MagnetTypeKey } from '@/domain/admin/blog/magnet/types';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import {
  MagnetListResponse,
  magnetListResponseSchema,
} from './magnetSchema';

const magnetListQueryKey = 'MagnetListQueryKey';

export interface MagnetListQueryParams {
  typeList?: MagnetTypeKey[];
  keyword?: string;
}

export const useGetMagnetListQuery = (params: MagnetListQueryParams = {}) => {
  return useQuery({
    queryKey: [magnetListQueryKey, params.typeList, params.keyword],
    queryFn: async (): Promise<MagnetListResponse> => {
      const res = await axios.get('/admin/magnet', {
        params: {
          typeList: params.typeList,
          keyword: params.keyword || undefined,
        },
      });
      return magnetListResponseSchema.parse(res.data.data);
    },
  });
};
