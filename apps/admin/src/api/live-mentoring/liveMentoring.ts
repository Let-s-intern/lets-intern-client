import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminLiveMentoringListSchema,
  adminLiveMentoringParticipantListSchema,
  adminLiveMentoringReservationListSchema,
  type LiveMentoringAttendanceStatus,
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

export const ADMIN_LIVE_MENTORING_RESERVATION_QUERY_KEY = [
  'adminLiveMentoring',
  'reservations',
] as const;

export interface UseAdminLiveMentoringReservationsParams {
  mentorId?: number;
  /** 예약 시작 시각 범위 (LocalDateTime, 예: `2026-08-01T00:00:00`) */
  reservationStartDate?: string;
  reservationEndDate?: string;
  /** 신청 시각 범위 (LocalDateTime) */
  createStartDate?: string;
  createEndDate?: string;
  page?: number;
  size?: number;
}

/** 빈 값(undefined·빈 문자열)을 뺀 쿼리 파라미터. 빈 문자열을 보내면 서버 파싱이 깨진다. */
export function serializeReservationParams(
  params: UseAdminLiveMentoringReservationsParams,
): Record<string, number | string> {
  const result: Record<string, number | string> = {};
  if (params.mentorId != null) result.mentorId = params.mentorId;
  if (params.reservationStartDate) {
    result.reservationStartDate = params.reservationStartDate;
  }
  if (params.reservationEndDate) {
    result.reservationEndDate = params.reservationEndDate;
  }
  if (params.createStartDate) result.createStartDate = params.createStartDate;
  if (params.createEndDate) result.createEndDate = params.createEndDate;
  return result;
}

/**
 * GET /admin/live-mentoring/applications — 1대1 예약 목록.
 *
 * 멘티명은 서버에도 조건이 있지만 보내지 않는다. 챌린지 라이브 피드백 쪽이 이름 부분 일치
 * 클라이언트 필터라, 한 표에 섞어 보여주는 이상 두 유형의 검색 결과가 같은 규칙이어야 한다.
 *
 * `enabled` 를 false 로 주면 조회하지 않는다(유형 필터가 챌린지 전용일 때).
 */
export const useAdminLiveMentoringReservationsQuery = (
  {
    page = 1,
    size = 20,
    ...filters
  }: UseAdminLiveMentoringReservationsParams = {},
  enabled = true,
) => {
  const queryParams = serializeReservationParams(filters);
  return useQuery({
    queryKey: [
      ...ADMIN_LIVE_MENTORING_RESERVATION_QUERY_KEY,
      { ...queryParams, page, size },
    ],
    queryFn: async () => {
      const res = await axios.get(`${ADMIN_PATH}/applications`, {
        params: { ...queryParams, page, size },
      });
      return adminLiveMentoringReservationListSchema.parse(res.data.data);
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * POST /admin/live-mentoring/applications/{applicationId}/slots — 예약 일정 변경.
 *
 * 슬롯 id 목록을 통째로 보낸다. 30분이면 1개, 60분이면 연속한 2개다 — 라이브
 * 피드백의 "슬롯 하나를 다른 하나로" 방식과 다르다(§4.3). 서버가 개수·연속성·
 * 오픈 상태를 다시 검증하므로 화면은 그 결과(400/409)를 그대로 사용자에게 보여준다.
 */
/**
 * PATCH /admin/live-mentoring/applications/{applicationId}/attendance — 출석 수정.
 *
 * 서버는 멘토 입장 시 mentorStatus 를 자동으로 기록하지만, 어드민 화면에서
 * 조회·수정할 방법이 없었다. 멘토용 출석 갱신과 같은 부분 갱신 계약을 쓴다 — 두
 * 필드 모두 선택이고, 넘기지 않은 쪽은 서버가 건드리지 않는다.
 */
export const useUpdateLiveMentoringReservationAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      mentorStatus,
      menteeStatus,
    }: {
      applicationId: number;
      mentorStatus?: LiveMentoringAttendanceStatus;
      menteeStatus?: LiveMentoringAttendanceStatus;
    }) => {
      const body: Record<string, string> = {};
      if (mentorStatus) body.mentorStatus = mentorStatus;
      if (menteeStatus) body.menteeStatus = menteeStatus;
      await axios.patch(
        `${ADMIN_PATH}/applications/${applicationId}/attendance`,
        body,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_RESERVATION_QUERY_KEY,
      });
    },
  });
};

export const useUpdateLiveMentoringReservationSlotsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      slotIds,
    }: {
      applicationId: number;
      slotIds: number[];
    }) => {
      await axios.post(`${ADMIN_PATH}/applications/${applicationId}/slots`, {
        slotIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_RESERVATION_QUERY_KEY,
      });
    },
  });
};

export const ADMIN_LIVE_MENTORING_PARTICIPANT_QUERY_KEY = [
  'adminLiveMentoring',
  'participants',
] as const;

export interface UseAdminLiveMentoringParticipantsParams {
  /** 생략하면 멘토 구분 없이 전체 결제자를 본다. */
  mentorId?: number;
  page?: number;
  size?: number;
}

/** GET /admin/live-mentoring/participants — 결제자 목록. mentorId 를 주면 그 멘토 건만. */
export const useAdminLiveMentoringParticipantsQuery = ({
  mentorId,
  page = 1,
  size = 20,
}: UseAdminLiveMentoringParticipantsParams = {}) => {
  return useQuery({
    queryKey: [
      ...ADMIN_LIVE_MENTORING_PARTICIPANT_QUERY_KEY,
      { mentorId, page, size },
    ],
    queryFn: async () => {
      const res = await axios.get(`${ADMIN_PATH}/participants`, {
        params: mentorId != null ? { mentorId, page, size } : { page, size },
      });
      return adminLiveMentoringParticipantListSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};
