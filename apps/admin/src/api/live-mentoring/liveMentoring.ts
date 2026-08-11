import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminLiveMentoringListSchema,
  type LiveMentoringStatus,
} from './liveMentoringSchema';

/**
 * 1대1 라이브 멘토링 관리자 API.
 *
 * 이 도메인은 v1(`/api/v1/admin/live-mentoring`)이라 `@/utils/axios` 를 쓴다.
 * `axiosV2` 를 쓰면 `/api/v2` 로 나가 404 가 된다.
 */

const ADMIN_PATH = '/admin/live-mentoring';

export const ADMIN_LIVE_MENTORING_QUERY_KEY = [
  'adminLiveMentoring',
  'list',
] as const;

export interface UseAdminLiveMentoringListParams {
  /** 상태 필터. 생략하면 전체 조회. */
  status?: LiveMentoringStatus;
  /**
   * 1-based 페이지 번호.
   * 서버가 `spring.data.web.pageable.one-indexed-parameters: true` 라 첫 페이지는 1 이다
   * (반면 응답 `pageInfo.pageNum` 은 0-based 라 그대로 비교하면 어긋난다).
   */
  page?: number;
  size?: number;
}

/** GET /admin/live-mentoring — 상품 목록. 공개 목록과 달리 기간·노출 조건을 걸지 않는다. */
export const useAdminLiveMentoringListQuery = ({
  status,
  page = 1,
  size = 20,
}: UseAdminLiveMentoringListParams = {}) => {
  return useQuery({
    queryKey: [...ADMIN_LIVE_MENTORING_QUERY_KEY, { status, page, size }],
    queryFn: async () => {
      const res = await axios.get(ADMIN_PATH, {
        params: { status, page, size },
      });
      return adminLiveMentoringListSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

/** 강제 종료는 목록 화면에서만 쓰므로 성공 시 목록 전체를 무효화한다. */
const useAdminLiveMentoringMutation = <TVariables>(
  request: (variables: TVariables) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_QUERY_KEY,
      });
    },
  });
};

/** PATCH /admin/live-mentoring/openings/{openingId}/close — 강제 종료. 사유는 `ADMIN_FORCED`. */
export const useCloseLiveMentoringOpeningMutation = () =>
  useAdminLiveMentoringMutation((openingId: number) =>
    axios.patch(`${ADMIN_PATH}/openings/${openingId}/close`),
  );
