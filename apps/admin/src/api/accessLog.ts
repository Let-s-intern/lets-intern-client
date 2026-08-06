import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * 유저 콘텐츠 이용 로그 조회 (LC-3201).
 *
 * 환불 분쟁에서 "결제 후 콘텐츠를 이용했는가"를 사실로 확인하기 위한 조회다.
 * 화면이 환불 가부를 판정하지 않는다 — 사실만 내려주고 판단은 운영의 몫이다.
 *
 * 스키마는 서버 진화에 관대하게 짠다. 목록 화면이 파싱 오류로 통째로 죽는 것보다,
 * 값이 비어 한 행이 `확인 불가` 로 보이는 편이 운영에 훨씬 낫다.
 */

/** 화면이 알고 있는 이용 대상. 서버가 값을 추가해도 파싱이 터지지 않게 문자열로 받는다. */
export const ACCESS_LOG_TARGET_TYPES = [
  'CHALLENGE_DASHBOARD',
  'MISSION',
  'PROGRAM',
] as const;
export type KnownAccessLogTargetType = (typeof ACCESS_LOG_TARGET_TYPES)[number];
export type AccessLogTargetType = KnownAccessLogTargetType | (string & {});

/** 화면이 알고 있는 프로그램 타입. 위와 같은 이유로 enum 으로 조이지 않는다. */
export const ACCESS_LOG_PROGRAM_TYPES = [
  'CHALLENGE',
  'LIVE',
  'VOD',
  'REPORT',
  'GUIDEBOOK',
] as const;
export type KnownAccessLogProgramType =
  (typeof ACCESS_LOG_PROGRAM_TYPES)[number];
export type AccessLogProgramType = KnownAccessLogProgramType | (string & {});

/**
 * 이용 항목 요약 한 줄.
 *
 * `count` 는 접근 횟수가 아니라 구별되는 대상 개수다.
 * 미션 3건은 "미션을 세 번 봤다"가 아니라 "서로 다른 미션 셋을 봤다"는 뜻이다.
 */
export const accessLogTargetSummarySchema = z.object({
  targetType: z.string(),
  count: z.number().nullable().optional(),
});
export type AccessLogTargetSummary = z.infer<
  typeof accessLogTargetSummarySchema
>;

/**
 * 목록의 한 행. 단위는 신청서 하나다.
 *
 * `applicationId` 만 필수다. 행을 식별하는 키라 이 값이 없으면 행 자체가 성립하지 않는다.
 * 나머지는 전부 비어 있을 수 있고, 비면 화면이 `확인 불가` 로 표시한다.
 */
export const accessLogRowSchema = z.object({
  applicationId: z.number(),
  userId: z.number().nullable().optional(),
  userName: z.string().nullable().optional(),
  userEmail: z.string().nullable().optional(),
  programType: z.string().nullable().optional(),
  programId: z.number().nullable().optional(),
  programTitle: z.string().nullable().optional(),
  /** 결제 시각. `trackedFrom` 과 비교해 집계 이전 결제를 가른다. */
  paidAt: z.string().nullable().optional(),
  /** 최초 이용 시각. 없으면 null 이고, 그 이유는 세 가지로 갈린다(usageDisplay). */
  firstAccessedAt: z.string().nullable().optional(),
  lastAccessedAt: z.string().nullable().optional(),
  accessCount: z.number().nullable().optional(),
  /**
   * 결제 후 며칠 만에 처음 이용했는가. 서버가 계산해 내려준다.
   * 화면마다 다시 계산하면 기준(시각 포함 여부·타임존)이 어긋난다.
   */
  daysFromPaymentToFirstAccess: z.number().nullable().optional(),
  targetSummary: z.array(accessLogTargetSummarySchema).nullable().optional(),
});
export type AccessLogRow = z.infer<typeof accessLogRowSchema>;

const pageInfoSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const accessLogListSchema = z.object({
  accessLogList: z.array(accessLogRowSchema),
  pageInfo: pageInfoSchema,
  /**
   * 집계 시작 시각. 응답 최상위에 한 번만 온다.
   *
   * 이 값이 없으면 화면은 "집계 이전"과 "미이용"을 가를 수 없다.
   * 그래서 null 을 미이용으로 떨어뜨리지 않고 `확인 불가` 로 다룬다(usageDisplay).
   */
  trackedFrom: z.string().nullable().optional(),
});
export type AccessLogList = z.infer<typeof accessLogListSchema>;

export const ACCESS_LOG_LIST_KEY = 'accessLogList';

export interface AccessLogListParams {
  programId?: number;
  programType?: string;
  /** 이름·이메일 부분 일치. */
  userKeyword?: string;
  page?: number;
  size?: number;
}

export const useAccessLogListQuery = (
  params: AccessLogListParams,
  enabled = true,
) =>
  useQuery({
    queryKey: [ACCESS_LOG_LIST_KEY, params],
    enabled,
    queryFn: async () => {
      const res = await axios.get('/admin/access-log', { params });
      return accessLogListSchema.parse(res.data.data);
    },
  });
