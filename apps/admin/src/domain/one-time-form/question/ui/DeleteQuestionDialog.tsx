import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteQuestionDialogProps {
  open: boolean;
  questionTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** 신청이 있는 폼에서 저장된 질문을 지울 때 묻는다 */
const DeleteQuestionDialog = ({
  open,
  questionTitle,
  onCancel,
  onConfirm,
}: DeleteQuestionDialogProps) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>질문을 삭제할까요?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {questionTitle ? `"${questionTitle}" 질문을 삭제합니다. ` : ''}
        이미 받은 신청의 답은 지워지지 않고 남으며, 신청자 CSV 에서는 이 질문
        열이 제목 끝에 (삭제됨)이 붙은 채로 나옵니다. 삭제한 질문은 되살릴 수
        없습니다. 질문 저장을 눌러야 반영됩니다.
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

export default DeleteQuestionDialog;
