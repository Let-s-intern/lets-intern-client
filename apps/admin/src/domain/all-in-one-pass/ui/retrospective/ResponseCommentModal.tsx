import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface Props {
  response: RetrospectiveResponse | null;
  value: string;
  onChange: (value: string) => void;
  hasComment: boolean;
  passName?: string;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/** 제출자 상세: 답변(공통2+회차1) 전체 나열 + 운영자 코멘트 1개 */
export default function ResponseCommentModal({
  response,
  value,
  onChange,
  hasComment,
  passName,
  onSave,
  onDelete,
  onClose,
}: Props) {
  return (
    <Dialog open={response !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>회고 응답 상세</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <span className="text-xxsmall12 text-neutral-40">
          {response?.submitterName}
          {passName && ` | ${passName}`} |{' '}
          {response && dayjs(response.submittedAt).format('YYYY.MM.DD HH:mm')}
        </span>

        <div className="flex flex-col gap-3">
          {response?.answers.map((a) => (
            <div key={a.questionId} className="flex flex-col gap-1.5">
              <span className="text-xsmall14 text-primary-80 font-medium">
                Q. {a.questionLabel}
              </span>
              <div className="bg-neutral-90 rounded-sm p-3">
                <p className="text-xsmall16 text-neutral-10 whitespace-pre-wrap">
                  {a.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <TextField
          label="운영자 피드백"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="운영자 피드백을 입력하세요."
          multiline
          minRows={4}
          size="small"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {hasComment && (
          <Button color="error" onClick={onDelete}>
            삭제
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          닫기
        </Button>
        <Button variant="contained" onClick={onSave} disabled={!value.trim()}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
