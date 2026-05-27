import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { usePatchFaq } from '@/api/faq';
import BaseModal from '@/common/modal/BaseModal';
import { Faq } from '@/schema';

const FIXED_CATEGORIES = ['진행 방식', '신청/환불', '페이백', '기타'];
const DIRECT_INPUT = '직접입력';

interface FaqEditModalProps {
  isOpen: boolean;
  faq: Faq | null;
  customCategories: string[];
  onClose: () => void;
}

function FaqEditModal({
  isOpen,
  faq,
  customCategories,
  onClose,
}: FaqEditModalProps) {
  const [category, setCategory] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const { mutateAsync: patchFaq, isPending } = usePatchFaq();

  useEffect(() => {
    if (!faq) return;
    const cat = faq.category ?? '';
    const isCustom = Boolean(cat) && !FIXED_CATEGORIES.includes(cat);
    setCategory(isCustom ? DIRECT_INPUT : cat);
    setDirectInput(isCustom ? cat : '');
    setQuestion(faq.question ?? '');
    setAnswer(faq.answer ?? '');
  }, [faq]);

  const resolvedCategory = category === DIRECT_INPUT ? directInput : category;

  const hasChanges =
    faq !== null &&
    (resolvedCategory.trim() !== (faq.category ?? '') ||
      question !== (faq.question ?? '') ||
      answer !== (faq.answer ?? ''));

  const isSaveEnabled =
    hasChanges &&
    resolvedCategory.trim() !== '' &&
    question.trim() !== '' &&
    answer.trim() !== '';

  const handleSave = async () => {
    if (!faq || !isSaveEnabled) return;
    await patchFaq({
      ...faq,
      question,
      answer,
      category: resolvedCategory.trim(),
    });
    onClose();
  };

  const categoryOptions = [
    ...FIXED_CATEGORIES,
    ...customCategories.filter((c) => !FIXED_CATEGORIES.includes(c)),
    DIRECT_INPUT,
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] p-6">
      <h2 className="mb-6 text-lg font-semibold">FAQ 수정</h2>

      <div className="flex flex-col gap-5">
        <FormControl fullWidth size="small">
          <InputLabel>유형</InputLabel>
          <Select
            label="유형"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((opt) => (
              <MenuItem
                key={opt}
                value={opt}
                sx={opt === DIRECT_INPUT ? { color: '#6963f6' } : undefined}
              >
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {category === DIRECT_INPUT && (
          <TextField
            fullWidth
            size="small"
            label="직접 입력"
            placeholder="직접 입력해주세요."
            value={directInput}
            onChange={(e) => setDirectInput(e.target.value)}
          />
        )}

        <TextField
          fullWidth
          size="small"
          label="질문"
          placeholder="질문을 입력하세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <TextField
          fullWidth
          size="small"
          label="답변"
          placeholder="답변을 입력하세요"
          multiline
          rows={3}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      <div className="mt-10 flex gap-2">
        <Button fullWidth size="large" variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={!isSaveEnabled || isPending}
          onClick={handleSave}
        >
          저장하기
        </Button>
      </div>
    </BaseModal>
  );
}

export default FaqEditModal;
