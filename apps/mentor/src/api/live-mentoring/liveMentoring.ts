import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type LiveMentoringOpeningCreate,
  type LiveMentoringSettingsUpdate,
  type LiveMentoringTemplateUpdate,
  liveMentoringSettingsSchema,
  liveMentoringTemplateSchema,
  openingHistoryResponseSchema,
} from './liveMentoringSchema';

const SETTINGS_PATH = '/mentor/live-mentoring/settings';
const TEMPLATE_PATH = '/mentor/live-mentoring/template';
const OPEN_STATUS_PATH = '/mentor/live-mentoring/open-status';
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
 * 백엔드가 받는 건 title/categories 둘뿐이다 — 진행시간은 개설(`POST /openings`)이 받고,
 * nickname/profileImage/introduction/careers는 프로필 도메인 참조용이라 요청에 포함하지 않는다.
 * 응답은 전체 설정(프로필 참조 필드 포함)이라 저장 성공 시 곧바로 최신 상태로 갱신할 수 있다.
 * 상품이 없는 멘토는 이 요청이 상품을 `DRAFT` 로 만든다 — 개설은 상품이 있어야 하므로
 * (없으면 404 `LIVE_MENTORING_NOT_FOUND`) 첫 오픈 전에 한 번은 저장을 거쳐야 한다.
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
 * POST /mentor/live-mentoring/openings — 최초 개설과 재개설 공통.
 *
 * 검토 제출(`POST /submit`)이 사라지면서 개설 경로가 이 하나로 합쳐졌다. `DRAFT`
 * 상품이면 서버가 `APPROVED` 로 전이시키며 첫 개설을 만들고, `APPROVED` 상품이면
 * 새 개설을 만든다. 승인 이후에는 `PUT /settings` 가 잠기므로 제목·타입·진행시간을
 * 한 요청에 담아 보낸다. 활성 개설이 있으면 서버가 409 `LIVE_MENTORING_LOCKED` 로 막는다.
 *
 * 예약 가능 일정은 개설에 담기지 않는다 — 슬롯(`PUT /slots`)으로 따로 등록한다.
 * 다만 개설 유무가 고객용 슬롯 노출 조건이라 슬롯 캐시도 함께 무효화한다.
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
 *
 * 슬롯 캐시는 건드리지 않는다 — 종료는 더 이상 슬롯을 지우지 않는다.
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
 *
 * 요청 바디는 서버 요청 DTO와 같은 6개 키뿐이다(`liveMentoringTemplateUpdateSchema`).
 * 조회 응답에만 있는 값(`intro` 등)은 `toTemplateUpdatePayload` 가 걸러낸다.
 * 응답은 저장 후의 상세 페이지 전체라 조회와 같은 스키마로 파싱한다.
 */
export const useUpdateLiveMentoringTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (template: LiveMentoringTemplateUpdate) => {
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
