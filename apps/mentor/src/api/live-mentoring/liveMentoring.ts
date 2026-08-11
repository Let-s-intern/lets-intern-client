import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type LiveMentoringOpeningCreate,
  type LiveMentoringSettingsUpdate,
  type LiveMentoringSubmit,
  type LiveMentoringTemplate,
  liveMentoringSettingsSchema,
  liveMentoringTemplateSchema,
  openingHistoryResponseSchema,
  settlementListResponseSchema,
} from './liveMentoringSchema';

const SETTINGS_PATH = '/mentor/live-mentoring/settings';
const TEMPLATE_PATH = '/mentor/live-mentoring/template';
const SETTLEMENT_PATH = '/mentor/live-mentoring/settlement';
const OPEN_STATUS_PATH = '/mentor/live-mentoring/open-status';
const SUBMIT_PATH = '/mentor/live-mentoring/submit';
const OPENINGS_PATH = '/mentor/live-mentoring/openings';
const START_EDIT_PATH = '/mentor/live-mentoring/start-edit';

/** 오픈 설정(메타) query key. */
export const LIVE_MENTORING_SETTINGS_QUERY_KEY = [
  'liveMentoring',
  'settings',
] as const;
/** 상세 페이지 템플릿 query key. */
export const LIVE_MENTORING_TEMPLATE_QUERY_KEY = [
  'liveMentoring',
  'template',
] as const;
/** 정산 현황 query key. */
export const LIVE_MENTORING_SETTLEMENT_QUERY_KEY = [
  'liveMentoring',
  'settlement',
] as const;
/** 오픈 현황 query key. */
export const LIVE_MENTORING_OPEN_STATUS_QUERY_KEY = [
  'liveMentoring',
  'openStatus',
] as const;

/**
 * GET /mentor/live-mentoring/settings — 오픈 설정(메타) 조회.
 */
export const useLiveMentoringSettingsQuery = () => {
  return useQuery({
    queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get(SETTINGS_PATH);
      return liveMentoringSettingsSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * PUT /mentor/live-mentoring/settings — 상품 설정 저장.
 * 백엔드가 받는 건 title/categories 둘뿐이다 — 진행시간·기간은 검토 제출이 받고,
 * nickname/profileImage/introduction/careers는 프로필 도메인 참조용이라 요청에 포함하지 않는다.
 * 응답은 전체 설정(프로필 참조 필드 포함)이라 저장 성공 시 곧바로 최신 상태로 갱신할 수 있다.
 * 승인 이후에는 서버가 잠그므로(409 `LIVE_MENTORING_LOCKED`) 재개설은 `POST /openings` 를 쓴다.
 */
export const useUpdateLiveMentoringSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: LiveMentoringSettingsUpdate) => {
      const res = await axios.put(SETTINGS_PATH, settings);
      return liveMentoringSettingsSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
      });
    },
  });
};

/**
 * POST /mentor/live-mentoring/submit — 자가승인 및 개설.
 *
 * 진행시간·기간은 이 요청에서만 서버에 저장된다(오픈 설정 PUT 은 제목·타입만 받는다).
 * 성공하면 서버가 한 트랜잭션에서 상품을 `DRAFT → APPROVED` 로 전이시키고 곧바로 개설까지
 * 만든다(관리자 검토 없음). 전이로 설정이 잠기므로 설정 캐시를 무효화한다.
 * 응답 `data` 는 null 이라 파싱하지 않는다.
 */
export const useSubmitLiveMentoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: LiveMentoringSubmit) => {
      await axios.post(SUBMIT_PATH, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
      });
    },
  });
};

/**
 * POST /mentor/live-mentoring/openings — 승인된 상품 재개설.
 *
 * 종료 후에는 상품이 `APPROVED` 로 남아 `PUT /settings` 가 잠긴다. 그래서 재개설은
 * 제목·타입·진행시간·기간을 한 요청에 담아 보내고, 관리자 재승인 없이 바로 열린다.
 * 활성 개설이 있으면 서버가 409 `LIVE_MENTORING_LOCKED` 로 막는다.
 */
export const useCreateLiveMentoringOpeningMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    /*
     * 응답은 개설 이력이다. 방금 만들어진 개설의 id 가 필요하다 —
     * 오픈 직후 "바로 내리기"를 하려면 종료 API 에 넘길 openingId 가 있어야 한다.
     */
    mutationFn: async (body: LiveMentoringOpeningCreate) => {
      const res = await axios.post(OPENINGS_PATH, body);
      return openingHistoryResponseSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
      });
    },
  });
};

/**
 * POST /mentor/live-mentoring/start-edit — 승인된 상품을 다시 초안으로.
 *
 * 상세 페이지까지 고쳐 재검토를 받고 싶을 때 쓴다. 활성 개설이 있으면 서버가 막는다.
 * 성공하면 상품이 `DRAFT` 가 되어 설정·상세 편집이 다시 열리고, 재제출이 필요해진다.
 */
export const useStartEditLiveMentoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.post(START_EDIT_PATH);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
      });
    },
  });
};

/**
 * PATCH /mentor/live-mentoring/openings/{openingId}/close — 본인 개설 종료.
 *
 * 서버는 예약 존재 여부를 검사하지 않고 종료한다. 이미 종료된 개설은 그대로 200 이다.
 * 종료 후에는 개설 이력뿐 아니라 설정 화면의 잠금 표시도 달라지므로 두 캐시를 함께 무효화한다.
 */
export const useCloseLiveMentoringOpeningMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (openingId: number) => {
      await axios.patch(`/mentor/live-mentoring/openings/${openingId}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
      });
    },
  });
};

/**
 * GET /mentor/live-mentoring/template — 상세 페이지 템플릿 조회.
 */
export const useLiveMentoringTemplateQuery = () => {
  return useQuery({
    queryKey: LIVE_MENTORING_TEMPLATE_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get(TEMPLATE_PATH);
      return liveMentoringTemplateSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
    // ⚠️ 임시 — 백엔드에 아직 없는 엔드포인트라 재시도해도 성공하지 않는다.
    //    기본 3회 재시도(약 7초)를 끄고 개발 중 안내를 바로 띄우려는 것이다.
    //    API 연동 후 이 줄을 지워 기본 재시도로 되돌릴 것.
    retry: false,
  });
};

/**
 * PUT /mentor/live-mentoring/template — 상세 페이지 템플릿 저장.
 * 성공 시 템플릿 캐시를 invalidate. (MSW는 body를 echo)
 */
export const useUpdateLiveMentoringTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: LiveMentoringTemplate) => {
      const res = await axios.put(TEMPLATE_PATH, template);
      return liveMentoringTemplateSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_TEMPLATE_QUERY_KEY,
      });
    },
  });
};

/**
 * GET /mentor/live-mentoring/settlement — 정산 현황(read-only) 조회.
 * 기간별 합계(`settlementList`)와 개별 정산 내역(`itemList`)을 함께 반환한다.
 */
export const useLiveMentoringSettlementQuery = () => {
  return useQuery({
    queryKey: LIVE_MENTORING_SETTLEMENT_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get(SETTLEMENT_PATH);
      return settlementListResponseSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
    // ⚠️ 임시 — 백엔드에 아직 없는 엔드포인트라 재시도해도 성공하지 않는다.
    //    기본 3회 재시도(약 7초)를 끄고 개발 중 안내를 바로 띄우려는 것이다.
    //    API 연동 후 이 줄을 지워 기본 재시도로 되돌릴 것.
    retry: false,
  });
};

/**
 * GET /mentor/live-mentoring/open-status — 개설 이력 조회.
 * 최신 개설이 먼저 온다(서버 `id DESC`). 응답 `openings`만 추출해 반환한다.
 */
export const useLiveMentoringOpenStatusQuery = () => {
  return useQuery({
    queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get(OPEN_STATUS_PATH);
      return openingHistoryResponseSchema.parse(res.data.data).openings;
    },
    refetchOnWindowFocus: false,
  });
};
