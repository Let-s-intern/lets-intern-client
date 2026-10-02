import { PassFaq } from '@/domain/all-in-one-pass/types';
import { DIRECT_INPUT } from '@/domain/faq/modal/faqFormUtils';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  /** null 이면 모달 닫힘 */
  faq: PassFaq | null;
  isEdit: boolean;
  existingCategories: string[];
  onSave: (faq: PassFaq) => void;
  onClose: () => void;
}

/** 1.7 FAQ 추가/수정 모달 (유형: 등록된 것 선택 또는 직접입력) */
export default function FaqModal({
  faq,
  isEdit,
  existingCategories,
  onSave,
  onClose,
}: Props) {
  const open = faq !== null;

  const [category, setCategory] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const categoryOptions = Array.from(
    new Set(existingCategories.filter(Boolean)),
  );

  useEffect(() => {
    if (!faq) return;
    const isKnown = categoryOptions.includes(faq.category);
    setCategory(faq.category ? (isKnown ? faq.category : DIRECT_INPUT) : '');
    setDirectInput(isKnown ? '' : (faq.category ?? ''));
    setQuestion(faq.question);
    setAnswer(faq.answer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faq]);

  const resolvedCategory =
    category === DIRECT_INPUT ? directInput.trim() : category;
  const isDuplicateDirect =
    category === DIRECT_INPUT && categoryOptions.includes(directInput.trim());
  const canSave =
    question.trim() !== '' &&
    answer.trim() !== '' &&
    resolvedCategory !== '' &&
    !isDuplicateDirect;

  const handleSave = () => {
    if (!faq) return;
    onSave({
      ...faq,
      category: resolvedCategory,
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'FAQ 수정' : 'FAQ 추가'}</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <TextField
          select
          label="유형"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          fullWidth
        >
          {categoryOptions.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
          <MenuItem value={DIRECT_INPUT} sx={{ color: '#6963f6' }}>
            {DIRECT_INPUT}
          </MenuItem>
        </TextField>

        {category === DIRECT_INPUT && (
          <TextField
            label="직접 입력"
            placeholder="새 유형을 입력해주세요."
            value={directInput}
            onChange={(e) => setDirectInput(e.target.value)}
            error={isDuplicateDirect}
            helperText={
              isDuplicateDirect ? '이미 등록된 유형입니다.' : undefined
            }
            size="small"
            fullWidth
          />
        )}

        <TextField
          label="질문"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="답변"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          size="small"
          fullWidth
          multiline
          minRows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!canSave}>
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
