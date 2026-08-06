import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';
import { durationPricesLabel, formatPeriod } from '../constants';

/** 확인 모달이 어떤 액션을 대기 중인지. 닫혀 있으면 null. */
export type PendingAction =
  | { type: 'approve'; row: AdminLiveMentoring }
  | { type: 'reject'; row: AdminLiveMentoring }
  | { type: 'close'; row: AdminLiveMentoring; openingId: number }
  | null;

interface ConfirmActionDialogProps {
  action: PendingAction;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 승인·반려·강제 종료 확인 모달.
 *
 * 세 액션 모두 되돌릴 수 없고 멘토·멘티에게 즉시 보이는 결과라 한 단계를 둔다.
 * 특히 승인은 "상세 승인"이 아니라 **곧바로 개설(오픈)** 이라, 그 사실을 문구로 알린다.
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

  const content = {
    approve: (
      <>
        <p>승인하면 이 상품이 곧바로 오픈됩니다.</p>
        <p className="mt-2">
          멘토가 검토 제출 때 저장한 진행시간·기간으로 개설이 함께 만들어지고,
          오늘이 그 기간 안이면 공개 리스트에 즉시 노출됩니다.
        </p>
        {/*
          제출된 진행시간·기간은 관리자 목록 응답(`AdminLiveMentoringVo`)에 없어
          여기서 보여줄 수 없다. 값을 지어내지 않고 없다는 사실을 그대로 알린다.
        */}
        <p className="text-neutral-40 mt-2 text-xs">
          제출된 진행시간·기간은 현재 관리자 API 응답에 포함되지 않아 이
          화면에서 확인할 수 없습니다. 저장된 종료일이 이미 지났다면 승인은
          실패합니다.
        </p>
      </>
    ),
    reject: (
      <>
        <p>이 상품을 반려합니다.</p>
        <p className="mt-2">
          멘토가 설정을 수정한 뒤 다시 검토를 제출할 수 있습니다. 반려 사유는
          현재 서버가 저장하지 않으므로 별도로 안내해주세요.
        </p>
      </>
    ),
    close: (
      <>
        <p>이 개설을 강제로 종료합니다.</p>
        <p className="mt-2">
          종료하면 공개 리스트에서 즉시 내려가고 되돌릴 수 없습니다. 상품 상태는
          승인으로 유지됩니다.
        </p>
        {action.type === 'close' && action.row.currentOpening && (
          <p className="text-neutral-40 mt-2 text-xs">
            {formatPeriod(
              action.row.currentOpening.feedbackStartDate,
              action.row.currentOpening.feedbackEndDate,
            )}
            {' · '}
            {durationPricesLabel(action.row.currentOpening.durationPrices)}
          </p>
        )}
      </>
    ),
  }[action.type];

  const confirmLabel = {
    approve: '승인하고 오픈',
    reject: '반려',
    close: '강제 종료',
  }[action.type];

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
          color={action.type === 'approve' ? 'primary' : 'error'}
        >
          {isPending ? '처리 중...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
