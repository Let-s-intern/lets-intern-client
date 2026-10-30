import {
  PassBenefitCard,
  PassExternalLink,
  PassPlan,
} from '@/domain/all-in-one-pass/types';
import {
  BENEFIT_ICON_OPTIONS,
  buildDefaultBenefitsSummary,
  DEFAULT_BENEFIT_ICON_KEY,
  getFirstAvailableIconKey,
  MAX_BENEFIT_CARDS,
} from '@/domain/all-in-one-pass/util/landingOptions';
import { Button, IconButton, MenuItem, TextField } from '@mui/material';
import { useEffect, useRef } from 'react';
import { FaPlus, FaRotateLeft, FaTrashCan } from 'react-icons/fa6';

interface Props {
  plans: PassPlan[];
  externalLinks: PassExternalLink[];
  benefits: PassBenefitCard[];
  onChange: (benefits: PassBenefitCard[]) => void;
}

const IconSelect = ({
  value,
  onChange,
  usedIconKeys,
}: {
  value: string;
  onChange: (iconKey: string) => void;
  usedIconKeys: Set<string>;
}) => {
  // 이미 다른 카드가 쓰는 아이콘은 숨기되, 이 행의 현재 선택값은 유지
  const options = BENEFIT_ICON_OPTIONS.filter(
    (opt) => opt.key === value || !usedIconKeys.has(opt.key),
  );
  return (
    <TextField
      select
      label="아이콘"
      value={value || DEFAULT_BENEFIT_ICON_KEY}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      className="w-18 shrink-0"
    >
      {options.map((opt) => (
        <MenuItem key={opt.key} value={opt.key}>
          <img src={opt.src} alt="" className="h-5 w-5" />
        </MenuItem>
      ))}
    </TextField>
  );
};

/**
 * 혜택요약 에디터. benefitsSummary(최대 6칸)를 자유 편집 — 아이콘·이름·설명·추가·삭제.
 * VOD 는 'VOD 옵션 추가결제' 토글(LC-3533)로 웹에서 동적 노출되므로 여기 포함하지 않는다.
 */
export default function LandingBenefitEditor({
  plans,
  externalLinks,
  benefits,
  onChange,
}: Props) {
  // 빈 폼(신규 패스)은 플랜·외부링크 기준 기본값으로 1회 시드
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || benefits.length > 0) return;
    seeded.current = true;
    const defaults = buildDefaultBenefitsSummary(plans, externalLinks);
    if (defaults.length > 0) onChange(defaults);
    // 최초 마운트 1회만 시드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usedIconKeys = new Set(benefits.map((b) => b.iconKey));

  const updateCard = (id: string, partial: Partial<PassBenefitCard>) =>
    onChange(benefits.map((b) => (b.id === id ? { ...b, ...partial } : b)));

  const removeCard = (id: string) =>
    onChange(benefits.filter((b) => b.id !== id));

  const addCard = () =>
    onChange([
      ...benefits,
      {
        id: crypto.randomUUID(),
        iconKey: getFirstAvailableIconKey(usedIconKeys),
        name: '',
        description: '',
      },
    ]);

  const refill = () => {
    if (
      benefits.length > 0 &&
      !window.confirm(
        '현재 입력한 혜택요약을 플랜 권한·외부링크 기준 기본값으로 덮어씁니다. 계속할까요?',
      )
    )
      return;
    onChange(buildDefaultBenefitsSummary(plans, externalLinks));
  };

  const isFull = benefits.length >= MAX_BENEFIT_CARDS;

  return (
    <div className="flex flex-col gap-2">
      {benefits.map((benefit) => (
        <div key={benefit.id} className="flex items-center gap-2">
          <IconSelect
            value={benefit.iconKey}
            onChange={(iconKey) => updateCard(benefit.id, { iconKey })}
            usedIconKeys={usedIconKeys}
          />
          <TextField
            label="혜택명 (최대 13자)"
            value={benefit.name}
            onChange={(e) => updateCard(benefit.id, { name: e.target.value })}
            size="small"
            className="w-56 shrink-0"
            slotProps={{ htmlInput: { maxLength: 13 } }}
          />
          <TextField
            label="혜택 설명 (최대 20자)"
            value={benefit.description}
            onChange={(e) =>
              updateCard(benefit.id, { description: e.target.value })
            }
            size="small"
            fullWidth
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
          <IconButton
            aria-label="혜택 삭제"
            color="error"
            onClick={() => removeCard(benefit.id)}
          >
            <FaTrashCan size={16} />
          </IconButton>
        </div>
      ))}

      <div className="flex gap-2">
        {!isFull && (
          <Button
            variant="outlined"
            startIcon={<FaPlus size={12} />}
            onClick={addCard}
            sx={{ borderStyle: 'dashed' }}
          >
            혜택 추가
          </Button>
        )}
        <Button
          variant="text"
          size="small"
          startIcon={<FaRotateLeft size={12} />}
          onClick={refill}
        >
          플랜·외부링크 기준 다시 채우기
        </Button>
      </div>
    </div>
  );
}
