import { BenefitFormValues } from '@/api/all-in-one-pass/useBenefits';
import { AllInOnePassBenefit } from '@/api/all-in-one-pass/allInOnePassSchema';
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
  /** null 이면 모달 닫힘 */
  benefit: AllInOnePassBenefit | null;
  isEdit: boolean;
  existingTypes: string[];
  onSubmit: (values: BenefitFormValues) => void;
  onClose: () => void;
  isLoading?: boolean;
}

/** A-7 자료집 추가/수정 모달 (유형: 등록된 것 선택 또는 직접입력) */
export default function MaterialFormModal({
  benefit,
  isEdit,
  existingTypes,
  onSubmit,
  onClose,
  isLoading,
}: Props) {
  const open = benefit !== null;

  const [type, setType] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [link, setLink] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const typeOptions = Array.from(new Set(existingTypes.filter(Boolean)));

  useEffect(() => {
    if (!benefit) return;
    const current = benefit.type ?? '';
    const isKnown = typeOptions.includes(current);
    setType(current ? (isKnown ? current : DIRECT_INPUT) : '');
    setDirectInput(isKnown ? '' : current);
    setTitle(benefit.title ?? '');
    setIntroduction(benefit.introduction ?? '');
    setLink(benefit.link ?? '');
    setThumbnail(benefit.thumbnail ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefit]);

  const resolvedType = type === DIRECT_INPUT ? directInput.trim() : type;
  const isDuplicateDirect =
    type === DIRECT_INPUT && typeOptions.includes(directInput.trim());
  const canSave =
    title.trim() !== '' && resolvedType !== '' && !isDuplicateDirect;

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit({
      title: title.trim(),
      type: resolvedType,
      introduction: introduction.trim(),
      link: link.trim(),
      thumbnail,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? '자료집 수정' : '자료집 추가'}</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <div className="flex gap-4">
          <ThumbnailUpload
            value={thumbnail}
            onChange={setThumbnail}
            className="aspect-[4/3] w-40"
          />
          <div className="flex flex-1 flex-col gap-4">
            <TextField
              select
              label="유형"
              value={type}
              onChange={(e) => setType(e.target.value)}
              size="small"
              fullWidth
            >
              {typeOptions.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
              <MenuItem value={DIRECT_INPUT} sx={{ color: '#6963f6' }}>
                {DIRECT_INPUT}
              </MenuItem>
            </TextField>

            {type === DIRECT_INPUT && (
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
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          size="small"
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="링크"
          placeholder="자료 보기 링크를 입력해주세요."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          size="small"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSave || isLoading}
        >
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
