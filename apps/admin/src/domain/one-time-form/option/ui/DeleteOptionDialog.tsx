import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export type PendingOptionDelete =
  | { kind: 'group'; groupKey: string; label: string }
  | { kind: 'option'; groupKey: string; optionKey: string; label: string };

interface DeleteOptionDialogProps {
  target: PendingOptionDelete | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** 신청이 있는 폼에서 저장된 그룹·옵션을 지울 때 묻는다 */
const DeleteOptionDialog = ({
  target,
  onCancel,
  onConfirm,
}: DeleteOptionDialogProps) => {
  const isGroup = target?.kind === 'group';
  const label = target?.label.trim();

  return (
    <Dialog open={!!target} onClose={onCancel}>
      <DialogTitle>
        {isGroup ? '옵션 그룹을 삭제할까요?' : '옵션을 삭제할까요?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {label
            ? `"${label}" ${isGroup ? '그룹과 그 안의 옵션을' : '옵션을'} 삭제합니다. `
            : ''}
          이미 받은 신청에는 신청 시점의 이름과 금액이 남습니다. 결제된 적 있는
          옵션은 지워지지 않고 노출만 꺼진 채로 남습니다. 옵션 저장을 눌러야
          반영됩니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>취소</Button>
        <Button color="error" onClick={onConfirm}>
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOptionDialog;
