// 참여자 환불 모달 호스트: 선택 건의 preview(GET) 조회 → RefundModal → base/연장 환불(POST).
import { AdminRefundRequest } from '@/api/adminRefund';
import {
  useMembershipExtensionRefundPreviewQuery,
  useMembershipRefundMutation,
  useMembershipRefundPreviewQuery,
} from '@/api/all-in-one-pass/useMembershipRefund';
import RefundModal, {
  RefundMode,
  RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

export interface RefundingState {
  participant: PassParticipant;
  mode: RefundMode;
}

interface Props {
  passId?: number;
  refunding: RefundingState | null;
  onClose: () => void;
}

const errorMessage = (e: unknown, fallback: string) =>
  (isAxiosError<{ message?: string }>(e) && e.response?.data?.message) ||
  fallback;

export default function MembershipRefundModalHost({
  passId,
  refunding,
  onClose,
}: Props) {
  const { snackbar } = useAdminSnackbar();
  const participant = refunding?.participant ?? null;
  const mode = refunding?.mode ?? 'full';
  const isExtension = participant != null && participant.extendedDays != null;
  const applicationId = participant?.membershipApplicationId;
  const extensionId = isExtension ? participant?.id : undefined;

  const baseQuery = useMembershipRefundPreviewQuery(
    applicationId,
    participant != null && !isExtension,
  );
  const extensionQuery = useMembershipExtensionRefundPreviewQuery(
    applicationId,
    extensionId,
    participant != null && isExtension,
  );
  const preview = isExtension ? extensionQuery.data : baseQuery.data;
  const previewError = isExtension ? extensionQuery.error : baseQuery.error;

  const refundMutation = useMembershipRefundMutation(passId);

  // preview 실패(이미 환불·연장 미정산 등)는 모달을 열지 않고 안내 후 닫는다
  useEffect(() => {
    if (participant && previewError) {
      snackbar(errorMessage(previewError, '환불할 수 없는 상태입니다.'));
      onClose();
    }
  }, [participant, previewError, snackbar, onClose]);

  if (participant == null || applicationId == null || preview == null)
    return null;

  const target: RefundTarget = {
    applicationId,
    name: participant.name,
    email: participant.email,
    phoneNum: participant.phoneNum,
    programTitle: participant.productName,
    orderId: participant.orderId,
    pricePlanType: isExtension ? null : (baseQuery.data?.paymentPlan ?? null),
    couponName: participant.couponName,
    couponDiscount: participant.couponDiscount,
    finalPrice: preview.fullRefundAmount,
  };

  const handleSubmit = (body: AdminRefundRequest) =>
    refundMutation.mutate(
      {
        applicationId,
        extensionId,
        body: {
          managerName: body.managerName ?? '',
          reason: body.reason ?? '',
          sendNotification: body.sendNotification ?? true,
          refundAmount: body.refundAmount,
        },
      },
      {
        onSuccess: () => {
          snackbar('환불을 완료했습니다.');
          onClose();
        },
        onError: (e) => snackbar(errorMessage(e, '환불에 실패했습니다.')),
      },
    );

  return (
    <RefundModal
      target={target}
      mode={mode}
      isSubmitting={refundMutation.isPending}
      hideUsageSummary
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
