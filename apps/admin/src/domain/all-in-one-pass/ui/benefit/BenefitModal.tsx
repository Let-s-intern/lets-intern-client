import { PassBenefit } from '@/domain/all-in-one-pass/types';
import ThumbnailUpload from '@/domain/all-in-one-pass/ui/ThumbnailUpload';
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
  /** 편집/추가 대상 혜택. null 이면 모달 닫힘 */
  benefit: PassBenefit | null;
  isEdit: boolean;
  /** 이미 등록된 유형 목록(선택지) */
  existingCategories: string[];
  onSave: (benefit: PassBenefit) => void;
  onClose: () => void;
}

/** 1.6 혜택 추가/수정 모달 (유형: 등록된 것 선택 또는 직접입력) */
export default function BenefitModal({
  benefit,
  isEdit,
  existingCategories,
  onSave,
  onClose,
}: Props) {
  const open = benefit !== null;

  const [category, setCategory] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const categoryOptions = Array.from(
    new Set(existingCategories.filter(Boolean)),
  );

  // 모달 열릴 때 대상 혜택 값으로 초기화
  useEffect(() => {
    if (!benefit) return;
    const isKnown = categoryOptions.includes(benefit.category);
    setCategory(
      benefit.category ? (isKnown ? benefit.category : DIRECT_INPUT) : '',
    );
    setDirectInput(isKnown ? '' : (benefit.category ?? ''));
    setThumbnailUrl(benefit.thumbnailUrl);
    setTitle(benefit.title);
    setDescription(benefit.description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefit]);

  const resolvedCategory =
    category === DIRECT_INPUT ? directInput.trim() : category;
  const isDuplicateDirect =
    category === DIRECT_INPUT && categoryOptions.includes(directInput.trim());
  const canSave =
    title.trim() !== '' && resolvedCategory !== '' && !isDuplicateDirect;

  const handleSave = () => {
    if (!benefit) return;
    onSave({
      ...benefit,
      category: resolvedCategory,
      thumbnailUrl,
      title: title.trim(),
      description,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? '혜택 수정' : '혜택 추가'}</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <div className="flex gap-4">
          <ThumbnailUpload value={thumbnailUrl} onChange={setThumbnailUrl} />
          <div className="flex flex-1 flex-col gap-4">
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
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              fullWidth
            />
          </div>
        </div>
        <TextField
          label="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          fullWidth
          multiline
          minRows={2}
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
