import { ApiError } from '@letscareer/api';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const MENTOR_DETAIL_PATH = (mentorId: number) =>
  `/live-mentoring/mentors/${mentorId}`;
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
 * 멘토 ID 로 해석한 상품·개설 식별자.
 *
 * 공개 상세 응답에서 관리자 액션에 필요한 값만 뽑는다 — 전체를 복사하지 않는다.
 * 이 응답에는 상품 상태(`status`)가 없어 **승인 가능 여부를 미리 알 수 없다.**
 * 눌러야 409 `LIVE_MENTORING_INVALID_STATE` 로 알게 된다.
 */
export const mentorLiveMentoringSchema = z.object({
  liveMentoringId: z.number(),
  /** 활성 개설이 없으면 null — 강제 종료 대상이 없다는 뜻이다. */
  openingId: z.number().nullable(),
  title: z.string(),
  categories: z.array(z.string()),
});
export type MentorLiveMentoring = z.infer<typeof mentorLiveMentoringSchema>;

/**
 * GET /live-mentoring/mentors/{mentorId} — 멘토 ID 로 상품·개설 식별자를 해석한다.
 *
 * 공개 API 라 관리자 권한이 필요 없고, 상품 상태·개설 여부와 무관하게
 * **상세 페이지 저장만 되어 있으면 200** 이다(`LiveMentoringPublicDetailService`).
 * 서버 `submit` 이 상세 저장을 필수로 요구하므로(`LiveMentoringLifecycleServiceImpl`)
 * 검토 대기 상품은 반드시 여기서 조회된다 — 승인 대상과 조회 범위가 일치한다.
 *
 * 404 `LIVE_MENTORING_NOT_FOUND` 는 오류가 아니라 "아직 상세를 저장하지 않은 멘토" 라는
 * 정상 상태다. `null` 을 돌려주고 화면이 안내로 처리한다.
 */
export const useLiveMentoringByMentorQuery = (mentorId: number | null) =>
  useQuery({
    queryKey: [...ADMIN_LIVE_MENTORING_QUERY_KEY, 'byMentor', mentorId],
    queryFn: async () => {
      try {
        const res = await axios.get(MENTOR_DETAIL_PATH(mentorId as number));
        return mentorLiveMentoringSchema.parse(res.data.data);
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.code === 'LIVE_MENTORING_NOT_FOUND'
        ) {
          return null;
        }
        throw error;
      }
    },
    enabled: mentorId !== null,
    retry: false,
    refetchOnWindowFocus: false,
  });

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
