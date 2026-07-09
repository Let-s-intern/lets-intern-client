import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type LiveMentoringSettings,
  type LiveMentoringTemplate,
  liveMentoringSettingsSchema,
  liveMentoringTemplateSchema,
  openStatusListResponseSchema,
  settlementListResponseSchema,
} from './liveMentoringSchema';

const SETTINGS_PATH = '/mentor/live-mentoring/settings';
const TEMPLATE_PATH = '/mentor/live-mentoring/template';
const SETTLEMENT_PATH = '/mentor/live-mentoring/settlement';
const OPEN_STATUS_PATH = '/mentor/live-mentoring/open-status';

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
 * PUT /mentor/live-mentoring/settings — 오픈 설정 저장.
 * 성공 시 설정 캐시를 invalidate. (MSW는 body를 echo)
 */
export const useUpdateLiveMentoringSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: LiveMentoringSettings) => {
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
  });
};

/**
 * GET /mentor/live-mentoring/open-status — 오픈 현황(read-only) 조회.
 * 응답 `openStatusList`만 추출해 반환한다.
 */
export const useLiveMentoringOpenStatusQuery = () => {
  return useQuery({
    queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get(OPEN_STATUS_PATH);
      return openStatusListResponseSchema.parse(res.data.data).openStatusList;
    },
    refetchOnWindowFocus: false,
  });
};
