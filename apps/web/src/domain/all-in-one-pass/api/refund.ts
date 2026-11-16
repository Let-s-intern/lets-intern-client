// 올인원패스(멤버십) 유저 환불 — 규정 자동계산. base·연장 건별, POST는 바디 없음.
// preview가 에러면 환불 불가(만료·검토필요 등)로 본다(retry 안 함).
import {
  UsePaymentDetailQueryKey,
  UsePaymentQueryKey,
} from '@/api/payment/payment';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const BASE = '/membership-application';
const refundPreviewKey = 'membershipRefundPreview';

// ── 환불 모달 조회 (preview) ──────
const quoteSchema = z.object({
  paidAmount: z.number().nullish(),
  elapsedDays: z.number().nullish(),
  totalDays: z.number().nullish(),
  challengeDeduction: z.number().nullish(),
  liveDeduction: z.number().nullish(),
  guidebookDeduction: z.number().nullish(),
  vodDeduction: z.number().nullish(),
  mentoringDeduction: z.number().nullish(),
  remainingAmount: z.number().nullish(),
  penalty: z.number().nullish(),
  refundAmount: z.number().nullish(),
});

const baseRefundPreviewSchema = z.object({
  paidAmount: z.number().nullish(),
  endAt: z.string().nullish(),
  refund: quoteSchema.nullish(),
  fullRefundAmount: z.number().nullish(),
});
export type MembershipRefundPreview = z.infer<typeof baseRefundPreviewSchema>;

const extensionRefundPreviewSchema = z.object({
  paidAmount: z.number().nullish(),
  usedDays: z.number().nullish(),
  periodDeduction: z.number().nullish(),
  penalty: z.number().nullish(),
  refundAmount: z.number().nullish(),
  endAtAfterRefund: z.string().nullish(),
});
export type MembershipExtensionRefundPreview = z.infer<
  typeof extensionRefundPreviewSchema
>;

export const useMembershipRefundPreview = (
  applicationId?: number,
  enabled = true,
) =>
  useQuery({
    queryKey: [refundPreviewKey, 'base', applicationId],
    enabled: Number.isFinite(applicationId) && enabled,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<MembershipRefundPreview> => {
      const res = await axios.get(`${BASE}/${applicationId}/refund-preview`);
      return baseRefundPreviewSchema.parse(res.data.data);
    },
  });

export const useMembershipExtensionRefundPreview = (
  applicationId?: number,
  extensionId?: number,
  enabled = true,
) =>
  useQuery({
    queryKey: [refundPreviewKey, 'extension', applicationId, extensionId],
    enabled:
      Number.isFinite(applicationId) && Number.isFinite(extensionId) && enabled,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<MembershipExtensionRefundPreview> => {
      const res = await axios.get(
        `${BASE}/${applicationId}/extensions/${extensionId}/refund-preview`,
      );
      return extensionRefundPreviewSchema.parse(res.data.data);
    },
  });

// ── 환불 실행 (POST, 바디 없음) ──────
export const useMembershipRefundMutation = (paymentId?: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      extensionId,
    }: {
      applicationId: number;
      extensionId?: number;
    }) =>
      extensionId != null
        ? axios.post(
            `${BASE}/${applicationId}/extensions/${extensionId}/refund`,
          )
        : axios.post(`${BASE}/${applicationId}/refund`),
    onSuccess: () => {
      if (paymentId != null)
        queryClient.invalidateQueries({
          queryKey: [UsePaymentDetailQueryKey, paymentId],
        });
      queryClient.invalidateQueries({ queryKey: [UsePaymentQueryKey] });
    },
  });
};
