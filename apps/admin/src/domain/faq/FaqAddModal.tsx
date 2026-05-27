import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import { usePostFaq } from '@/api/faq';
import BaseModal from '@/common/modal/BaseModal';
import { ProgramTypeUpperCase } from '@/schema';

const FIXED_CATEGORIES = ['진행 방식', '신청/환불', '페이백', '기타'];
const DIRECT_INPUT = '직접입력';

interface FaqAddModalProps {
  isOpen: boolean;
  programType: ProgramTypeUpperCase;
  customCategories: string[];
  onClose: () => void;
}

function FaqAddModal({
  isOpen,
  programType,
  customCategories,
  onClose,
}: FaqAddModalProps) {
  const [category, setCategory] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const { mutateAsync: postFaq, isPending } = usePostFaq();

  const resolvedCategory = category === DIRECT_INPUT ? directInput : category;
  const isSaveEnabled =
    resolvedCategory.trim() !== '' &&
    question.trim() !== '' &&
    answer.trim() !== '';

  const handleClose = () => {
    setCategory('');
    setDirectInput('');
    setQuestion('');
    setAnswer('');
    onClose();
  };

  const handleSave = async () => {
    if (!isSaveEnabled) return;
    await postFaq({
      programType,
      question,
      answer,
      category: resolvedCategory.trim(),
    });
    handleClose();
  };

  const categoryOptions = [
    ...FIXED_CATEGORIES,
    ...customCategories.filter((c) => !FIXED_CATEGORIES.includes(c)),
    DIRECT_INPUT,
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[1000px] p-6"
    >
      <h2 className="mb-6 text-lg font-semibold">FAQ 추가</h2>

      <div className="flex flex-col gap-5">
        <FormControl fullWidth size="small">
          <InputLabel>유형</InputLabel>
          <Select
            label="유형"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="" disabled>
              유형을 선택해주세요.
            </MenuItem>
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

      <div className="mt-[52px] flex gap-2">
        <Button fullWidth size="large" variant="outlined" onClick={handleClose}>
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

export default FaqAddModal;
