import axios from '@/utils/axios';
import { ApiError } from '@letscareer/api';
import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import {
  type CreateOpeningRequest,
  type LiveMentoringSettingsUpdate,
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
const OPENINGS_PATH = '/mentor/live-mentoring/openings';
const SUBMIT_PATH = '/mentor/live-mentoring/submit';
const START_EDIT_PATH = '/mentor/live-mentoring/start-edit';

/** TanStack Query 기본 재시도 횟수. */
const DEFAULT_RETRY_COUNT = 3;

/**
 * 404 판정.
 *
 * 공용 axios 인터셉터(`@letscareer/api`)가 응답 에러를 `ApiError` 로 재포장하면서
 * `error.response` 를 남기지 않으므로, 실서버 404 는 `AxiosError` 가 아니라 `ApiError` 로 온다.
 * 인터셉터를 타지 않는 경로(테스트 목 등)를 위해 두 형태를 모두 본다.
 */
export const isNotFound = (error: unknown) =>
  (error instanceof ApiError && error.status === 404) ||
  (isAxiosError(error) && error.response?.status === 404);

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
 * 백엔드는 title/categories 2개 필드만 받는다 —
 * nickname/profileImage/introduction/careers는 프로필 도메인 참조용이라 수정 요청에 포함하지 않는다.
 * 응답은 전체 설정(프로필 참조 필드 포함)이라 저장 성공 시 곧바로 최신 상태로 갱신할 수 있다.
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
    // 404(LIVE_MENTORING_NOT_FOUND)는 오류가 아니라 "상품을 아직 저장하지 않음"이라
    // 재시도해도 결과가 바뀌지 않는다. 그 외 오류는 기본 3회 재시도를 그대로 쓴다.
    retry: (failureCount, error) =>
      !isNotFound(error) && failureCount < DEFAULT_RETRY_COUNT,
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
 * GET /mentor/live-mentoring/open-status — 개설 이력(read-only) 조회.
 *
 * 응답은 `{liveMentoringId, openings}` 이지만 **`openings` 배열만 반환한다**.
 * 화면이 `data.map` 으로 표를 그리는 형태를 유지하기 위해서다.
 * `liveMentoringId` 가 필요하면 별도 셀렉터를 둔다.
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

/**
 * POST /mentor/live-mentoring/openings — 개설 생성.
 *
 * 전제는 `settings.status === 'APPROVED'` 이고 활성 `OPEN` 개설이 없을 때다.
 * 응답은 생성 건이 아니라 개설 이력 전체(`GET /open-status` 와 같은 형태)다.
 *
 * 성공 시 세 캐시를 모두 invalidate 한다. 개설이 같은 트랜잭션에서 상품의 제목·카테고리를
 * 갱신하고(settings), 활성 개설(`currentOpening`)을 만들기(template) 때문이다.
 */
export const useCreateLiveMentoringOpeningMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateOpeningRequest) => {
      const res = await axios.post(OPENINGS_PATH, request);
      return openingHistoryResponseSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_TEMPLATE_QUERY_KEY,
      });
    },
  });
};

/**
 * POST /mentor/live-mentoring/submit — 관리자 검토 제출 (`DRAFT`·`REJECTED` → `PENDING_REVIEW`).
 *
 * 요청 바디도 응답 본문도 없다 — 컨트롤러가 `SuccessResponse.ok(null)` 을 돌려주므로 파싱하지 않는다.
 * 서버는 상태 전이 외에 **상세 페이지 저장 여부**도 확인해
 * (`LiveMentoringLifecycleServiceImpl.submit` 의 `detailPageRepository.existsByLiveMentoringId`),
 * 상세를 한 번도 저장하지 않았으면 409 `LIVE_MENTORING_INVALID_STATE` 로 막는다.
 */
export const useSubmitLiveMentoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.post(SUBMIT_PATH);
    },
    onSuccess: () => {
      invalidateLiveMentoringStatus(queryClient);
    },
  });
};

/**
 * POST /mentor/live-mentoring/start-edit — 승인본 수정 시작 (`APPROVED` → `DRAFT`).
 *
 * 서버 `LiveMentoring.startEditing()` 이 `APPROVED` 가 아니거나 활성 개설이 있으면
 * 409 `LIVE_MENTORING_INVALID_STATE` 로 막는다. 응답 본문은 없다.
 */
export const useStartEditLiveMentoringMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.post(START_EDIT_PATH);
    },
    onSuccess: () => {
      invalidateLiveMentoringStatus(queryClient);
    },
  });
};

/**
 * 상태 전이 후 다시 읽어야 하는 캐시.
 *
 * 두 응답이 상태를 함께 담고 있어 한쪽만 갱신하면 화면이 어긋난다 —
 * `settings.status` 와 `template.mentoring.status`·`mentoring.editable` 이 같이 바뀐다.
 */
const invalidateLiveMentoringStatus = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
  });
  queryClient.invalidateQueries({
    queryKey: LIVE_MENTORING_TEMPLATE_QUERY_KEY,
  });
};
