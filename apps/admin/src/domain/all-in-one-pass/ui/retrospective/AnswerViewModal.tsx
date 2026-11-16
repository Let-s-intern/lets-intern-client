import dayjs from '@/lib/dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { AnswerView } from './responseColumns';

interface Props {
  view: AnswerView | null;
  question?: string;
  passName?: string;
  onClose: () => void;
}

/** 긴 답변 조회 (읽기 전용) */
export default function AnswerViewModal({
  view,
  question,
  passName,
  onClose,
}: Props) {
  return (
    <Dialog open={view !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>응답 상세</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <span className="text-xxsmall12 text-neutral-40">
          {view?.submitterName}
          {passName && ` | ${passName}`} |{' '}
          {view && dayjs(view.submittedAt).format('YYYY.MM.DD HH:mm')}
        </span>
        <div className="flex flex-col gap-2.5">
          <span className="text-xsmall14 font-medium text-primary-80">
            Q. {question ?? '-'}
          </span>
          <div className="rounded-sm bg-neutral-90 p-4">
            <p className="whitespace-pre-wrap text-xsmall16 text-neutral-10">
              {view?.answer}
            </p>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
