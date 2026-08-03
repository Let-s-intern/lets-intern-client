import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/** 어드민 주도 전액 환불. 유저가 규정대로 받은 환불은 여기 들어오지 않는다. */
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

export interface AdminRefundRequest {
  /** 실행 담당자. 어드민 계정을 공유해 쓰고 있어 이 값이 유일한 담당자 정보다. */
  managerName: string;
  reason: string;
  sendNotification: boolean;
}

/**
 * 전액 환불 실행.
 *
 * 금액을 보내지 않는다. 어드민 환불은 언제나 전액이라 서버가 결제 금액을 그대로 쓰고,
 * 클라이언트가 금액을 보내지 않으니 조작할 여지도 없다.
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
        body,
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
