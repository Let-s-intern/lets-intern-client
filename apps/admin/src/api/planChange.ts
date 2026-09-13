import { ChallengePricePlanEnum, pageInfo } from '@/schema';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * 플랜 변경 로그 한 건. 운영진 변경과 참여자 셀프 변경이 같은 모양으로 쌓인다.
 * 환불 로그와 금액 방향이 반대라 테이블을 따로 둔다 (설계안 "플랜 변경 로그" 절).
 */
export const planChangeLogSchema = z.object({
  planChangeLogId: z.number(),
  applicationId: z.number().nullable().optional(),
  programId: z.number().nullable().optional(),
  programTitle: z.string().nullable().optional(),
  userName: z.string().nullable().optional(),
  userEmail: z.string().nullable().optional(),
  fromPlan: ChallengePricePlanEnum,
  toPlan: ChallengePricePlanEnum,
  /** 시스템이 계산한 차액 (설계안 D10) */
  calculatedAmount: z.number(),
  /** 실제로 기록한 차액. 운영이 고쳤으면 calculatedAmount 와 다르다 */
  additionalAmount: z.number(),
  /** false 면 운영이 따로 받은 돈이다. 시스템이 취소하지 않고 수동 환불 완료를 기록한다 (설계안 D12) */
  hasPaymentKey: z.boolean(),
  /** 참여자 변경이면 USER, 운영진 변경이면 입력한 담당자 이름 */
  changedBy: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  manualRefundedAt: z.string().nullable().optional(),
  manualRefundedBy: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
});
export type PlanChangeLog = z.infer<typeof planChangeLogSchema>;

/** 서버가 상위 플랜만 서열 오름차순으로 내려준다 */
export const planChangeOptionSchema = z.object({
  planType: ChallengePricePlanEnum,
  title: z.string().nullable().optional(),
  salePrice: z.number(),
  calculatedAmount: z.number(),
});
export type PlanChangeOption = z.infer<typeof planChangeOptionSchema>;

export const planChangeInfoSchema = z.object({
  currentPlan: ChallengePricePlanEnum,
  options: z.array(planChangeOptionSchema),
  logs: z.array(planChangeLogSchema),
});
export type PlanChangeInfo = z.infer<typeof planChangeInfoSchema>;

export const planChangeRequestSchema = z.object({
  toPlan: ChallengePricePlanEnum,
  /** null 이면 서버가 계산값을 기록한다. 수납액이 계산값과 같을 때 보낸다 (설계안 D10) */
  additionalAmount: z.number().int().nonnegative().nullable(),
  /** 어드민 계정을 공유해 쓰고 있어 이 값이 유일한 담당자 정보다 */
  managerName: z.string().min(1),
  reason: z.string().min(1),
});
export type PlanChangeRequest = z.infer<typeof planChangeRequestSchema>;

export const planChangeResultSchema = z.object({
  planChangeLogId: z.number(),
  fromPlan: ChallengePricePlanEnum,
  toPlan: ChallengePricePlanEnum,
  calculatedAmount: z.number(),
  additionalAmount: z.number(),
});
export type PlanChangeResult = z.infer<typeof planChangeResultSchema>;

export const planChangeHistorySchema = z.object({
  planChangeLogList: z.array(planChangeLogSchema),
  pageInfo,
});
export type PlanChangeHistory = z.infer<typeof planChangeHistorySchema>;

export const manualRefundRequestSchema = z.object({
  managerName: z.string().min(1),
});
export type ManualRefundRequest = z.infer<typeof manualRefundRequestSchema>;

export const PLAN_CHANGE_KEY = 'adminPlanChange';
export const PLAN_CHANGE_HISTORY_KEY = 'adminPlanChangeHistory';

/**
 * 참여자 표(ChallengeOperationParticipants)의 쿼리 키.
 * 그 화면은 라우트 파라미터 문자열을 키에 넣으므로, 로그의 숫자 programId 도 문자열로 맞춰야 무효화된다.
 */
const participantsQueryKey = (challengeId: string | number) => [
  'admin',
  'challenge',
  String(challengeId),
  'participants',
];

/** 공용 axios 가 서버 문구를 ApiError.message 에 담는다. 뭉갠 문구를 쓰면 운영이 다음 행동을 정할 수 없다 */
const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

/** GET /api/v1/admin/application/{applicationId}/plan-change */
export const usePlanChangeQuery = (applicationId: number, enabled = true) =>
  useQuery({
    queryKey: [PLAN_CHANGE_KEY, applicationId],
    enabled,
    queryFn: async () => {
      const res = await axios.get(
        `/admin/application/${applicationId}/plan-change`,
      );
      return planChangeInfoSchema.parse(res.data.data);
    },
  });

/** PATCH /api/v1/admin/application/{applicationId}/plan */
export const usePlanChangeMutation = ({
  challengeId,
  onSuccess,
  onError,
}: {
  challengeId: string | number;
  onSuccess?: (result: PlanChangeResult) => void;
  onError?: (message: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      body,
    }: {
      applicationId: number;
      body: PlanChangeRequest;
    }) => {
      const res = await axios.patch(
        `/admin/application/${applicationId}/plan`,
        planChangeRequestSchema.parse(body),
      );
      return planChangeResultSchema.parse(res.data.data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: participantsQueryKey(challengeId),
      });
      queryClient.invalidateQueries({ queryKey: [PLAN_CHANGE_HISTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PLAN_CHANGE_KEY] });
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(toErrorMessage(error, '플랜 변경에 실패했습니다.'));
    },
  });
};

export interface PlanChangeHistoryParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  programId?: number;
  keyword?: string;
  pendingManualRefundOnly?: boolean;
}

/** GET /api/v1/admin/plan-change-history */
export const usePlanChangeHistoryQuery = (
  params: PlanChangeHistoryParams,
  enabled = true,
) =>
  useQuery({
    queryKey: [PLAN_CHANGE_HISTORY_KEY, params],
    enabled,
    queryFn: async () => {
      const res = await axios.get('/admin/plan-change-history', { params });
      return planChangeHistorySchema.parse(res.data.data);
    },
  });

/**
 * PATCH /api/v1/admin/plan-change-log/{planChangeLogId}/manual-refund
 *
 * 이력 화면은 행마다 챌린지가 달라 챌린지 id 를 요청 인자로 받는다. 로그 스냅샷에 programId 가 없으면
 * 참여자 쿼리는 건너뛴다.
 */
export const useManualRefundCompleteMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planChangeLogId,
      body,
    }: {
      planChangeLogId: number;
      challengeId?: number | null;
      body: ManualRefundRequest;
    }) => {
      await axios.patch(
        `/admin/plan-change-log/${planChangeLogId}/manual-refund`,
        manualRefundRequestSchema.parse(body),
      );
    },
    onSuccess: (_, { challengeId }) => {
      if (challengeId != null) {
        queryClient.invalidateQueries({
          queryKey: participantsQueryKey(challengeId),
        });
      }
      queryClient.invalidateQueries({ queryKey: [PLAN_CHANGE_HISTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PLAN_CHANGE_KEY] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(toErrorMessage(error, '환불 완료 기록에 실패했습니다.'));
    },
  });
};
