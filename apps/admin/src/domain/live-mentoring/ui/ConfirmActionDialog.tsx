import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';
import { durationPricesLabel } from '../constants';

/** 확인 모달이 어떤 액션을 대기 중인지. 닫혀 있으면 null. */
export type PendingAction = {
  type: 'close';
  row: AdminLiveMentoring;
  openingId: number;
} | null;

interface ConfirmActionDialogProps {
  action: PendingAction;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 강제 종료 확인 모달.
 *
 * 되돌릴 수 없고 멘토·멘티에게 즉시 보이는 결과라 한 단계를 둔다.
 */
const ConfirmActionDialog = ({
  action,
  isPending,
  onCancel,
  onConfirm,
}: ConfirmActionDialogProps) => {
  if (!action) return null;

  const mentorLabel =
    action.row.mentorNickname ?? `멘토 #${action.row.mentorId}`;
  const productLabel = `${mentorLabel} · ${action.row.title ?? '제목 없음'}`;

  const content = (
    <>
      <p>이 개설을 강제로 종료합니다.</p>
      <p className="mt-2">
        종료하면 공개 리스트에서 즉시 내려가고 되돌릴 수 없습니다. 상품 상태는
        승인으로 유지됩니다.
      </p>
      <p className="mt-2">
        종료하면 등록한 일정이 모두 삭제됩니다. 다시 열 때 일정을 새로 등록해야
        합니다.
      </p>
      {action.row.currentOpening && (
        <p className="text-neutral-40 mt-2 text-xs">
          {durationPricesLabel(action.row.currentOpening.durationPrices)}
        </p>
      )}
    </>
  );

  const confirmLabel = '강제 종료';

  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle className="text-base font-semibold">
        {productLabel}
      </DialogTitle>
      <DialogContent className="text-sm text-neutral-700">
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isPending} color="inherit">
          취소
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          variant="contained"
          color="error"
        >
          {isPending ? '처리 중...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
