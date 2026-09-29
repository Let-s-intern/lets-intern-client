import { toFormInput } from '@/domain/all-in-one-pass/util/membershipMapper';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { membershipDetailSchema } from './membershipSchema';

/**
 * 올인원패스(멤버십) 단건 상세 조회 훅 (수정 폼 프리필용).
 *
 * 서버: GET /api/v1/admin/membership/{id}. 응답 DTO를 membershipMapper 로 폼 입력값으로 변환.
 */

export const allInOnePassDetailQueryKey = 'allInOnePassDetail';

/** id 로 상세(폼 입력값)를 조회한다. */
export const useGetAllInOnePassDetailQuery = (id?: number) =>
  useQuery({
    queryKey: [allInOnePassDetailQueryKey, id],
    enabled: id != null,
    // 수정 폼 프리필용. 포커스 refetch로 편집 중 값이 덮어써지지 않게 한다.
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get(`/admin/membership/${id}`);
      return toFormInput(membershipDetailSchema.parse(res.data.data));
    },
  });
