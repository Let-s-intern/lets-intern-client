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

/**
 * 화면이 알고 있는 이용 대상. 서버가 값을 추가해도 파싱이 터지지 않게 문자열로 받는다.
 *
 * 미션 자료 셋(`MISSION_TEMPLATE`·`MISSION_ESSENTIAL_CONTENT`·`MISSION_ADDITIONAL_CONTENT`)은
 * 자료 링크를 실제로 열었을 때 쌓인다. 미션 페이지를 방문한 것(`MISSION`)과 다른 대상이다 —
 * 자료를 열어본 것이 콘텐츠를 이용했다의 더 강한 증거다.
 */
export const ACCESS_LOG_TARGET_TYPES = [
  'CHALLENGE_DASHBOARD',
  'MISSION',
  'MISSION_TEMPLATE',
  'MISSION_ESSENTIAL_CONTENT',
  'MISSION_ADDITIONAL_CONTENT',
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

/**
 * 이용 상태 필터 (PRD 5.5.2).
 *
 * **`NOT_USED` 와 `BEFORE_TRACKING` 을 하나로 묶지 마라.** "기록 없음" 같은 선택지를 만들면
 * 집계 이전 결제가 미이용 목록에 섞이고, 그 목록이 곧 잘못된 전액 환불의 근거가 된다.
 * 화면 판정(usageDisplay)이 행 단위로 가르는 것과 같은 구분을 필터에서도 지킨다.
 *
 * 적재 대상이 아닌 타입(LIVE·REPORT)은 이 값에 없다. 프로그램 타입 필터가 맡는다.
 */
export const ACCESS_LOG_USAGE_STATUSES = [
  'USED',
  'NOT_USED',
  'BEFORE_TRACKING',
] as const;
export type AccessLogUsageStatus = (typeof ACCESS_LOG_USAGE_STATUSES)[number];

export const ACCESS_LOG_SORTS = [
  'LAST_ACCESSED_DESC',
  'PAID_DESC',
  'PAID_ASC',
] as const;
export type AccessLogSort = (typeof ACCESS_LOG_SORTS)[number];

export const ACCESS_LOG_DEFAULT_SORT: AccessLogSort = 'LAST_ACCESSED_DESC';

export interface AccessLogListParams {
  /**
   * 프로그램 단건 지정.
   *
   * 지금 화면에는 입력 칸이 없다(어드민이 ID 를 외워 넣을 수 없어 제목 검색으로 바꿨다).
   * 서버는 계속 받으므로 다른 화면에서 프로그램을 지목해 넘어올 때 쓴다.
   */
  programId?: number;
  programType?: string;
  /** 프로그램 제목 부분 일치. */
  programKeyword?: string;
  /** 이름·이메일 부분 일치. */
  userKeyword?: string;
  /** 결제일 범위. 날짜(`YYYY-MM-DD`)이고 경계를 포함한다. */
  paidFrom?: string;
  paidTo?: string;
  /** 최초 이용일 범위. 이용 기록이 없는 건은 이 조건이 걸리면 빠진다. */
  firstAccessedFrom?: string;
  firstAccessedTo?: string;
  usageStatus?: AccessLogUsageStatus;
  /** 기본 `true`. 취소 건도 분쟁이 이어지므로 기본으로 포함한다. */
  includeCanceled?: boolean;
  sort?: AccessLogSort;
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

/**
 * 신청서 하나 안의 대상별 낱개 내역 (PRD 5.5 단건, 7.3 행 펼침).
 *
 * 목록의 `targetSummary` 가 `미션 3건` 까지만 말해 주는 것을 여기서 회차·제목으로 편다.
 *
 * `targetTitle` 은 서버가 조회 시점에 조인해 내려준다. 로그 테이블에 제목을 복제해 두지
 * 않기 때문이다(PRD 5.4). 조인이 실패하거나 대상이 삭제되면 null 로 온다.
 */
export const accessLogDetailSchema = z.object({
  targetType: z.string().nullable().optional(),
  targetId: z.number().nullable().optional(),
  targetTitle: z.string().nullable().optional(),
  /** 미션 회차. 미션이 아닌 대상이면 null 이다. */
  missionTh: z.number().nullable().optional(),
  firstAccessedAt: z.string().nullable().optional(),
  lastAccessedAt: z.string().nullable().optional(),
  accessCount: z.number().nullable().optional(),
});
export type AccessLogDetail = z.infer<typeof accessLogDetailSchema>;

/**
 * 단건 조회 응답. 목록 행과 같은 요약 필드에 `details` 가 더해진 모양이다.
 *
 * 목록과 마찬가지로 필수 필드를 두지 않는다. 상세가 파싱 오류로 통째로 사라지면
 * 운영은 펼쳐도 아무것도 못 보고, 그것이 `내역 없음` 으로 읽히면 정반대의 결론이 나온다.
 */
export const accessLogApplicationDetailSchema = z.object({
  /**
   * 프로그램 타입. 적재 대상이 아닌 타입(LIVE·REPORT)을 가려내는 데 쓴다.
   *
   * 환불 모달은 목록 행을 거치지 않고 이 응답만으로 판정한다. 이 값이 없으면
   * 기록하지 않는 타입이 `미이용` 으로 보이고, 그 자리에서 곧바로 전액 환불이 실행된다.
   */
  programType: z.string().nullable().optional(),
  firstAccessedAt: z.string().nullable().optional(),
  lastAccessedAt: z.string().nullable().optional(),
  accessCount: z.number().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  daysFromPaymentToFirstAccess: z.number().nullable().optional(),
  trackedFrom: z.string().nullable().optional(),
  details: z.array(accessLogDetailSchema).nullable().optional(),
});
export type AccessLogApplicationDetail = z.infer<
  typeof accessLogApplicationDetailSchema
>;

export const ACCESS_LOG_DETAIL_KEY = 'accessLogDetail';

/**
 * 상세를 신선하다고 보는 시간.
 *
 * 행을 접으면 이 훅이 언마운트되고 다시 펼치면 새로 마운트된다. `staleTime` 이 기본값(0)이면
 * 여닫을 때마다 요청이 나가 운영이 행 몇 개를 훑는 동안 서버를 계속 때린다.
 *
 * 어드민 QueryClient 기본값과 같은 값을 여기에 한 번 더 적는다. 이 화면의 요청 수가
 * provider 설정 변경에 조용히 끌려다니지 않게 하기 위해서다.
 */
const DETAIL_STALE_TIME_MS = 60 * 1000;

/**
 * 신청서 한 건의 대상별 상세 조회.
 *
 * **펼친 행에 대해서만 호출한다.** 목록을 그릴 때 전부 가져오면 한 페이지에 요청이
 * 스무 개 더 붙는다. 호출부는 이 훅을 펼쳤을 때만 마운트하거나 `enabled` 로 끈다.
 */
export const useAccessLogDetailQuery = (
  applicationId: number,
  enabled = true,
) =>
  useQuery({
    queryKey: [ACCESS_LOG_DETAIL_KEY, applicationId],
    enabled,
    staleTime: DETAIL_STALE_TIME_MS,
    queryFn: async () => {
      const res = await axios.get(
        `/admin/access-log/application/${applicationId}`,
      );
      return accessLogApplicationDetailSchema.parse(res.data.data);
    },
  });
