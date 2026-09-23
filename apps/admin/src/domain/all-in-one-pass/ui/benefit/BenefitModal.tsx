import {
  BenefitCouponSetting,
  PassBenefit,
} from '@/domain/all-in-one-pass/types';
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
import {
  FIXED_BENEFIT_CATEGORIES,
  isBenefitCouponValid,
  isFixedBenefitCategory,
  mentoringCouponTitle,
} from './benefitCategories';
import MentoringCouponFields from './MentoringCouponFields';

interface Props {
  /** 편집/추가 대상 혜택. null 이면 모달 닫힘 */
  benefit: PassBenefit | null;
  isEdit: boolean;
  /** 이미 등록된 유형 목록(선택지) */
  existingCategories: string[];
  onSave: (benefit: PassBenefit) => void;
  onClose: () => void;
}

/**
 * 1.6 혜택 추가/수정 모달.
 * 고정 카테고리(1:1 LIVE 멘토링) 선택 시엔 제목/링크 대신 쿠폰 설정을 받는다
 * (쿠폰 입력 UI 는 MentoringCouponFields 로 분리).
 */
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
  const [link, setLink] = useState('');
  const [coupon, setCoupon] = useState<BenefitCouponSetting | null>(null);

  // 고정 카테고리(1:1 LIVE 멘토링)를 앞에, 그다음 등록된 유형 (중복 제거)
  const categoryOptions = Array.from(
    new Set([
      ...FIXED_BENEFIT_CATEGORIES,
      ...existingCategories.filter(Boolean),
    ]),
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
    setLink(benefit.link);
    setCoupon(benefit.coupon ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefit]);

  const resolvedCategory =
    category === DIRECT_INPUT ? directInput.trim() : category;
  const isMentoring = isFixedBenefitCategory(resolvedCategory);
  const isDuplicateDirect =
    category === DIRECT_INPUT && categoryOptions.includes(directInput.trim());

  const canSave = isMentoring
    ? resolvedCategory !== '' && !!coupon && isBenefitCouponValid(coupon)
    : title.trim() !== '' && resolvedCategory !== '' && !isDuplicateDirect;

  const handleSave = () => {
    if (!benefit) return;
    onSave({
      ...benefit,
      category: resolvedCategory,
      thumbnailUrl,
      title:
        isMentoring && coupon ? mentoringCouponTitle(coupon) : title.trim(),
      link: isMentoring ? '' : link.trim(),
      coupon: isMentoring ? coupon : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? '혜택 수정' : '혜택 추가'}</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
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

            {isMentoring ? (
              <MentoringCouponFields
                key={benefit?.id}
                initial={benefit?.coupon ?? null}
                onChange={setCoupon}
              />
            ) : (
              <TextField
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                fullWidth
              />
            )}
          </div>
        </div>

        {isMentoring ? (
          <ul className="text-xxsmall12 text-neutral-40 list-disc space-y-1 pl-4 pt-6">
            <li>
              쿠폰명은 <b>올인원패스명 + 쿠폰 정보</b>로 자동생성됩니다.
            </li>
            <li>
              올인원패스 개설 후 <b>수정·삭제는 쿠폰 관리</b>에서 진행해주세요.
            </li>
          </ul>
        ) : (
          <TextField
            label="첨부 링크"
            placeholder="https://"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            size="small"
            fullWidth
          />
        )}
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
