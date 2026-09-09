import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminPassCertificationListSchema,
  PassCertificationStatus,
} from './passCertificationSchema';

export const ADMIN_PASS_CERTIFICATION_QUERY_KEY = 'adminPassCertificationList';

export interface AdminPassCertificationListParams {
  statusList?: string[];
  passTypeList?: string[];
  programTypeList?: string[];
  keyword?: string;
  page: number;
  size: number;
}

/** GET 합격 인증 목록 /api/v1/admin/pass-certification (배열 필터는 콤마 구분) */
export const useAdminPassCertificationListQuery = (
  params: AdminPassCertificationListParams,
) =>
  useQuery({
    queryKey: [ADMIN_PASS_CERTIFICATION_QUERY_KEY, params],
    queryFn: async () => {
      const res = await axios.get('/admin/pass-certification', {
        params: {
          statusList: params.statusList?.length
            ? params.statusList.join(',')
            : undefined,
          passTypeList: params.passTypeList?.length
            ? params.passTypeList.join(',')
            : undefined,
          programTypeList: params.programTypeList?.length
            ? params.programTypeList.join(',')
            : undefined,
          keyword: params.keyword || undefined,
          page: params.page,
          size: params.size,
        },
      });
      return adminPassCertificationListSchema.parse(res.data.data);
    },
  });

/** PATCH 합격 인증 승인 상태 변경 /api/v1/admin/pass-certification/{id}/status */
export const usePatchPassCertificationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: PassCertificationStatus;
    }) => axios.patch(`/admin/pass-certification/${id}/status`, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PASS_CERTIFICATION_QUERY_KEY],
      }),
  });
};
