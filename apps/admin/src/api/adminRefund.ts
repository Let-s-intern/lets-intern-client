import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/** 어드민 주도 환불. 유저가 규정대로 받은 환불은 여기 들어오지 않는다. */
export const adminRefundStatusSchema = z.enum(['PENDING', 'SUCCESS', 'FAILED']);
export type AdminRefundStatus = z.infer<typeof adminRefundStatusSchema>;

export const adminRefundLogSchema = z.object({
  id: z.number(),
  refundedAt: z.string().nullable().optional(),
  programType: z.string().nullable().optional(),
  programId: z.number().nullable().optional(),
  programTitle: z.string().nullable().optional(),
  userId: z.number().nullable().optional(),
  userName: z.string().nullable().optional(),
  userEmail: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  refundedAmount: z.number().nullable().optional(),
  reason: z.string().nullable().optional(),
  status: adminRefundStatusSchema,
  failureMessage: z.string().nullable().optional(),
  applicationId: z.number().nullable().optional(),
  // 아래는 감사 로그 스냅샷 확장분이다. 하드 삭제하면 원본 행이 사라져
  // 이 로그가 정산 대사의 유일한 근거가 된다.
  /** 정산 대사의 기준값. 토스 콘솔에서 이 값으로 거래를 찾는다. */
  orderId: z.string().nullable().optional(),
  paymentKey: z.string().nullable().optional(),
  /** 환불 전 실결제액. 부분 환불에서 얼마 중 얼마인지 판별한다. */
  originalAmount: z.number().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  couponName: z.string().nullable().optional(),
  couponDiscount: z.number().nullable().optional(),
});
export type AdminRefundLog = z.infer<typeof adminRefundLogSchema>;

export const adminRefundHistorySchema = z.object({
  refundLogList: z.array(adminRefundLogSchema),
  pageInfo: z.object({
    pageNum: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});
export type AdminRefundHistory = z.infer<typeof adminRefundHistorySchema>;

const adminRefundResultSchema = z.object({
  refundedAmount: z.number().nullable().optional(),
  canceledAt: z.string().nullable().optional(),
  paymentKey: z.string().nullable().optional(),
});

export const adminRefundRequestSchema = z.object({
  /** 실행 담당자. 어드민 계정을 공유해 쓰고 있어 이 값이 유일한 담당자 정보다. */
  managerName: z.string().min(1),
  reason: z.string().min(1),
  sendNotification: z.boolean(),
  /**
   * 환불 금액. 보내지 않으면 전체 환불이고 서버가 payment.finalPrice 를 쓴다.
   *
   * 값을 보내면 부분 환불이라 0 초과, 실결제액 미만의 정수여야 한다. 실결제액과 같은
   * 금액은 서버가 거절한다 — 전체 환불로 요청하라는 뜻이다.
   *
   * 0 을 허용하면 토스가 취소 요청을 조용히 무시해 "성공했는데 돈이 안 나간" 상태가 된다.
   * 다만 실결제액이 0원인 결제(100% 할인 쿠폰, 어드민 테스트 참여)는 전체 환불 경로로만
   * 처리되므로 여기를 지나지 않는다.
   */
  refundAmount: z.number().int().positive().optional(),
});
export type AdminRefundRequest = z.infer<typeof adminRefundRequestSchema>;

/**
 * 환불 실행.
 *
 * 금액을 요청 바디로 보내므로 조작 여지가 생겼다. 서버 재검증이 방어의 전부다.
 */
export const useAdminRefundMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (refundedAmount: number) => void;
  onError?: (message: string) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      body,
    }: {
      applicationId: number;
      body: AdminRefundRequest;
    }) => {
      const res = await axios.post(
        `/admin/application/${applicationId}/refund`,
        adminRefundRequestSchema.parse(body),
      );
      return adminRefundResultSchema.parse(res.data.data);
    },
    onSuccess: (data) => {
      // 참여자 목록과 환불 히스토리 양쪽이 바뀐다.
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
      queryClient.invalidateQueries({ queryKey: ['live'] });
      queryClient.invalidateQueries({ queryKey: ['guidebook'] });
      queryClient.invalidateQueries({ queryKey: ['vod'] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_REFUND_HISTORY_KEY] });
      onSuccess?.(data.refundedAmount ?? 0);
    },
    onError: (error) => {
      // 서버 메시지를 그대로 넘긴다. 뭉갠 문구를 쓰면 운영이 다음 행동을 정할 수 없다.
      onError?.(extractErrorMessage(error));
    },
  });
};

export const ADMIN_REFUND_HISTORY_KEY = 'adminRefundHistory';

export interface AdminRefundHistoryParams {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  programType?: string;
  programId?: number;
  managerName?: string;
  keyword?: string;
  status?: AdminRefundStatus;
}

export const useAdminRefundHistoryQuery = (
  params: AdminRefundHistoryParams,
  enabled = true,
) =>
  useQuery({
    queryKey: [ADMIN_REFUND_HISTORY_KEY, params],
    enabled,
    queryFn: async () => {
      const res = await axios.get('/admin/refund-history', { params });
      return adminRefundHistorySchema.parse(res.data.data);
    },
  });

/**
 * 특정 프로그램의 어드민 환불 대상 applicationId 집합.
 *
 * 참여자 목록의 `환불여부` 라벨이 어드민 환불과 유저 환불을 구분하는 데 쓴다.
 * 신청자 API 에 필드를 추가하는 대신 이 조회로 매칭하면 프로그램 타입 네 개의
 * VO 와 프로젝션을 건드리지 않아도 된다.
 */
export const useAdminRefundedApplicationIds = (
  programId: number,
  enabled = true,
) => {
  const { data } = useAdminRefundHistoryQuery(
    { programId, size: 200, status: 'SUCCESS' },
    enabled && !!programId,
  );

  return new Set(
    (data?.refundLogList ?? [])
      .map((log) => log.applicationId)
      .filter((id): id is number => typeof id === 'number'),
  );
};

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  ) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : '환불에 실패했습니다.';
}
