import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAdminRefundMutation } from '@/api/adminRefund';
import { oneTimeFormQueryKeys } from '@/api/one-time-form/oneTimeFormQueries';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import { formatWon } from '../utils/applicationDisplay';
import RefundApplicationDialog, {
  type RefundInput,
} from './RefundApplicationDialog';

interface ApplicationRefundButtonProps {
  formId: number;
  applicationId: number;
  applicantName: string;
  paidAmount: number;
  isCanceled: boolean;
}

/**
 * 전액 환불(계약 A11). 금액을 보내지 않아 서버가 실결제액을 환불하고, 0원 결제도 같은 요청으로 취소된다.
 * 결제가 없는 무료 신청에는 그리지 않는다(호출하는 쪽이 판단).
 */
const ApplicationRefundButton = ({
  formId,
  applicationId,
  applicantName,
  paidAmount,
  isCanceled,
}: ApplicationRefundButtonProps) => {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refund = useAdminRefundMutation({
    onSuccess: (refundedAmount) => {
      queryClient.invalidateQueries({
        queryKey: oneTimeFormQueryKeys.application(applicationId),
      });
      queryClient.invalidateQueries({
        queryKey: oneTimeFormQueryKeys.applications(formId),
      });
      setIsOpen(false);
      snackbar(`${formatWon(refundedAmount)}을 환불했습니다.`);
    },
    onError: setErrorMessage,
  });

  const open = () => {
    setErrorMessage(null);
    setIsOpen(true);
  };

  const submit = ({ managerName, reason }: RefundInput) => {
    setErrorMessage(null);
    refund.mutate({
      applicationId,
      body: { managerName, reason, sendNotification: false },
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        disabled={isCanceled}
        onClick={open}
      >
        전액 환불
      </Button>
      {isCanceled && (
        <span className="text-xsmall14 text-neutral-40">
          이미 취소·환불된 신청입니다.
        </span>
      )}
      {isOpen && (
        <RefundApplicationDialog
          applicantName={applicantName}
          paidAmount={paidAmount}
          isSubmitting={refund.isPending}
          errorMessage={errorMessage}
          onSubmit={submit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ApplicationRefundButton;
