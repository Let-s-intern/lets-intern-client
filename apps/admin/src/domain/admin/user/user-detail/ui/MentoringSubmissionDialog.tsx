import type { UserLiveMentoringSubmission } from '@/schema';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import MentoringSubmissionCard from './MentoringSubmissionCard';

/** 구매·참여 이력의 1:1 멘토링 행에서 여는 제출 내역 창. */
const MentoringSubmissionDialog = ({
  submission,
  onClose,
}: {
  submission: UserLiveMentoringSubmission;
  onClose: () => void;
}) => (
  <Dialog open onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>
      {submission.productNameSnapshot ?? '1:1 멘토링'} 제출 내역
    </DialogTitle>
    <DialogContent>
      <MentoringSubmissionCard submission={submission} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>닫기</Button>
    </DialogActions>
  </Dialog>
);

export default MentoringSubmissionDialog;
