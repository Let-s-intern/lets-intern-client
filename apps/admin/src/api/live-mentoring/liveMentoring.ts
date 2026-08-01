import axios from '@/utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const APPROVE_PATH = (liveMentoringId: number) =>
  `/admin/live-mentoring/${liveMentoringId}/approve`;
const REJECT_PATH = (liveMentoringId: number) =>
  `/admin/live-mentoring/${liveMentoringId}/reject`;
const CLOSE_OPENING_PATH = (openingId: number) =>
  `/admin/live-mentoring/openings/${openingId}/close`;

/**
 * 관리자 라이브 멘토링 쿼리 key prefix.
 *
 * 지금은 관리자용 목록 조회 API 가 없어 이 prefix 로 등록된 쿼리가 하나도 없지만,
 * 승인·반려·강제 종료 세 mutation 이 성공 시 이 prefix 를 invalidate 한다.
 * 목록 API 가 붙어 쿼리가 생기면 mutation 쪽을 고치지 않아도 갱신된다.
 */
export const ADMIN_LIVE_MENTORING_QUERY_KEY = ['adminLiveMentoring'] as const;

/**
 * PATCH /admin/live-mentoring/{liveMentoringId}/approve — 상품 승인 (`PENDING_REVIEW` → `APPROVED`).
 *
 * 요청 바디도 응답 본문도 없다 — 컨트롤러가 `SuccessResponse.ok(null)` 을 돌려주므로 파싱하지 않는다.
 * `PENDING_REVIEW` 가 아니면 409 `LIVE_MENTORING_INVALID_STATE`,
 * 없는 id 면 404 `LIVE_MENTORING_NOT_FOUND` 다.
 */
export const useApproveLiveMentoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (liveMentoringId: number) => {
      await axios.patch(APPROVE_PATH(liveMentoringId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_QUERY_KEY,
      });
    },
  });
};

/**
 * PATCH /admin/live-mentoring/{liveMentoringId}/reject — 상품 반려 (`PENDING_REVIEW` → `REJECTED`).
 *
 * 서버가 Request Body 를 받지 않으므로 반려 사유를 함께 보내지 않는다.
 * 오류 코드는 승인과 같다.
 */
export const useRejectLiveMentoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (liveMentoringId: number) => {
      await axios.patch(REJECT_PATH(liveMentoringId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_QUERY_KEY,
      });
    },
  });
};

/**
 * PATCH /admin/live-mentoring/openings/{openingId}/close — 개설 강제 종료.
 *
 * 이미 `CLOSED` 인 개설에 대한 재요청은 서버가 아무 것도 하지 않고 성공으로 끝낸다
 * (`LiveMentoringLifecycleServiceImpl.closeOpening` 의 이른 return). 실패로 다루지 않는다.
 */
export const useCloseLiveMentoringOpeningMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (openingId: number) => {
      await axios.patch(CLOSE_OPENING_PATH(openingId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_QUERY_KEY,
      });
    },
  });
};
