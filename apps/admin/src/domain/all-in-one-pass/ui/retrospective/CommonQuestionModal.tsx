import { RetrospectiveCommonQuestion } from '@/domain/all-in-one-pass/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

const MAX_QUESTIONS = 3;

interface Props {
  open: boolean;
  initial: RetrospectiveCommonQuestion[];
  onSubmit: (questions: string[]) => void;
  onClose: () => void;
}

/** A-4 공통 질문 수정 모달 (전 패스 공통 2~3개). 한 번 저장하면 전체 회차에 반영 */
export default function CommonQuestionModal({
  open,
  initial,
  onSubmit,
  onClose,
}: Props) {
  const [questions, setQuestions] = useState<string[]>(['']);

  useEffect(() => {
    if (!open) return;
    setQuestions(initial.length > 0 ? initial.map((q) => q.question) : ['']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const update = (index: number, value: string) =>
    setQuestions((prev) => prev.map((q, i) => (i === index ? value : q)));
  const remove = (index: number) =>
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  const add = () => setQuestions((prev) => [...prev, '']);

  const canSave = questions.some((q) => q.trim() !== '');

  const handleSubmit = () => {
    const cleaned = questions.map((q) => q.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    onSubmit(cleaned);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>공통 질문 수정</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-3">
        <span className="text-xsmall14 text-neutral-40 mb-1">
          모든 회차에 공통으로 노출되는 질문입니다. (최대 {MAX_QUESTIONS}개)
        </span>
        {questions.map((q, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextField
              label={`공통 질문 ${i + 1}`}
              value={q}
              onChange={(e) => update(i, e.target.value)}
              size="small"
              fullWidth
            />
            {questions.length > 1 && (
              <IconButton
                aria-label="삭제"
                size="small"
                onClick={() => remove(i)}
              >
                <FaTrashCan size={14} />
              </IconButton>
            )}
          </div>
        ))}
        {questions.length < MAX_QUESTIONS && (
          <Button
            variant="outlined"
            size="medium"
            className="self-start"
            sx={{ borderStyle: 'dashed' }}
            startIcon={<FaPlus size={12} />}
            onClick={add}
          >
            질문 추가
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSave}>
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
