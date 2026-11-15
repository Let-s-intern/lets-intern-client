// 올인원패스(멤버십) 어드민 환불 — 전액/부분 직접입력(규정 없음), refundAmount 생략=전액. base·연장 건별.
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { participantListQueryKey } from './useParticipants';

const BASE = '/admin/membership-application';

export const refundPreviewQueryKey = 'allInOnePassRefundPreview';

// ── 환불 모달 조회 (preview) ──────
const basePreviewSchema = z.object({
  membershipApplicationId: z.number(),
  orderId: z.string().nullish(),
  programTitle: z.string().nullish(),
  couponName: z.string().nullish(),
  couponDiscount: z.number().nullish(),
  paidAmount: z.number().nullish(),
  fullRefundAmount: z.number(),
  maxPartialRefundAmount: z.number().nullish(),
  partialRefundAvailable: z.boolean().nullish(),
});
export type MembershipRefundPreview = z.infer<typeof basePreviewSchema>;

const extensionPreviewSchema = z.object({
  membershipApplicationId: z.number(),
  extensionId: z.number(),
  orderId: z.string().nullish(),
  programTitle: z.string().nullish(),
  paidAmount: z.number().nullish(),
  fullRefundAmount: z.number(),
  maxPartialRefundAmount: z.number().nullish(),
  partialRefundAvailable: z.boolean().nullish(),
  endAtAfterRefund: z.string().nullish(),
});
export type MembershipExtensionRefundPreview = z.infer<
  typeof extensionPreviewSchema
>;

/** 기본 결제 환불 모달 조회 */
export const useMembershipRefundPreviewQuery = (
  applicationId?: number,
  enabled = true,
) =>
  useQuery({
    queryKey: [refundPreviewQueryKey, 'base', applicationId],
    enabled: applicationId != null && enabled,
    queryFn: async () => {
      const res = await axios.get(`${BASE}/${applicationId}/refund-preview`);
      return basePreviewSchema.parse(res.data.data);
    },
  });

/** 연장 결제 환불 모달 조회 */
export const useMembershipExtensionRefundPreviewQuery = (
  applicationId?: number,
  extensionId?: number,
  enabled = true,
) =>
  useQuery({
    queryKey: [refundPreviewQueryKey, 'extension', applicationId, extensionId],
    enabled: applicationId != null && extensionId != null && enabled,
    queryFn: async () => {
      const res = await axios.get(
        `${BASE}/${applicationId}/extensions/${extensionId}/refund-preview`,
      );
      return extensionPreviewSchema.parse(res.data.data);
    },
  });

// ── 환불 실행 (POST) ──────
export interface MembershipRefundBody {
  refundAmount?: number;
  managerName: string;
  reason: string;
  sendNotification: boolean;
}

/** base·연장 공용 환불 실행. extensionId 있으면 연장 경로로 전송. */
export const useMembershipRefundMutation = (passId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      extensionId,
      body,
    }: {
      applicationId: number;
      extensionId?: number;
      body: MembershipRefundBody;
    }) =>
      extensionId != null
        ? axios.post(
            `${BASE}/${applicationId}/extensions/${extensionId}/refund`,
            body,
          )
        : axios.post(`${BASE}/${applicationId}/refund`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [participantListQueryKey, passId],
      });
      queryClient.invalidateQueries({ queryKey: [refundPreviewQueryKey] });
    },
  });
};
