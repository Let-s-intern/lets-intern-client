import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { formatWon } from '../utils/applicationDisplay';

export interface RefundInput {
  managerName: string;
  reason: string;
}

interface RefundApplicationDialogProps {
  applicantName: string;
  paidAmount: number;
  isSubmitting: boolean;
  /** 서버가 준 실패 사유. 다이얼로그는 닫지 않고 여기에 보여준다 */
  errorMessage: string | null;
  onSubmit: (input: RefundInput) => void;
  onClose: () => void;
}

/** 전액 환불 확인. 열 때마다 마운트해 입력이 남지 않는다 */
const RefundApplicationDialog = ({
  applicantName,
  paidAmount,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose,
}: RefundApplicationDialogProps) => {
  const [managerName, setManagerName] = useState('');
  const [reason, setReason] = useState('');

  const canSubmit =
    !isSubmitting && managerName.trim() !== '' && reason.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ managerName: managerName.trim(), reason: reason.trim() });
  };

  return (
    <Dialog open onClose={isSubmitting ? undefined : onClose} fullWidth>
      <DialogTitle>전액 환불</DialogTitle>
      <DialogContent>
        <dl className="text-xsmall14 mb-4 grid grid-cols-[100px_1fr] gap-y-2">
          <dt className="text-neutral-40">신청자</dt>
          <dd className="text-neutral-0">{applicantName}</dd>
          <dt className="text-neutral-40">환불 금액</dt>
          <dd className="text-neutral-0 font-bold">{formatWon(paidAmount)}</dd>
        </dl>
        <div className="flex flex-col gap-3">
          <TextField
            label="담당자 이름"
            size="small"
            required
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
          />
          <TextField
            label="환불 사유"
            size="small"
            required
            multiline
            minRows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <p className="text-xsmall14 text-neutral-40 mt-3">
          신청자에게 환불 알림을 보내지 않습니다.
        </p>
        {errorMessage && (
          <p role="alert" className="text-xsmall14 text-system-error mt-2">
            {errorMessage}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          취소
        </Button>
        <Button color="error" onClick={handleSubmit} disabled={!canSubmit}>
          {isSubmitting ? '환불 중' : '환불하기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundApplicationDialog;
