import {
  PassExternalLink,
  PassLandingBenefitExtra,
  PassLandingManualBenefit,
} from '@/domain/all-in-one-pass/types';
import {
  BENEFIT_ICON_OPTIONS,
  DEFAULT_BENEFIT_ICON_KEY,
} from '@/domain/all-in-one-pass/util/landingOptions';
import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

interface Props {
  externalLinks: PassExternalLink[];
  benefitExtras: Record<string, PassLandingBenefitExtra>;
  manualBenefits: PassLandingManualBenefit[];
  onBenefitExtrasChange: (
    extras: Record<string, PassLandingBenefitExtra>,
  ) => void;
  onManualBenefitsChange: (benefits: PassLandingManualBenefit[]) => void;
}

const createEmptyManualBenefit = (): PassLandingManualBenefit => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  iconKey: DEFAULT_BENEFIT_ICON_KEY,
});

const IconSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (iconKey: string) => void;
}) => (
  <TextField
    select
    label="아이콘"
    value={value || DEFAULT_BENEFIT_ICON_KEY}
    onChange={(e) => onChange(e.target.value)}
    size="small"
    className="w-32 shrink-0"
  >
    {BENEFIT_ICON_OPTIONS.map((opt) => (
      <MenuItem key={opt.key} value={opt.key}>
        {opt.label}
      </MenuItem>
    ))}
  </TextField>
);

/**
 * 추가혜택 에디터. 외부링크는 자동으로 행이 생기고(이름은 링크에서 실시간, 저장 안 해도
 * 반영), 설명·아이콘만 입력한다. 외부링크와 무관한 혜택은 "혜택 직접 추가"로 넣는다.
 */
export default function LandingBenefitEditor({
  externalLinks,
  benefitExtras,
  manualBenefits,
  onBenefitExtrasChange,
  onManualBenefitsChange,
}: Props) {
  const updateExtra = (
    linkId: string,
    partial: Partial<PassLandingBenefitExtra>,
  ) => {
    const prev = benefitExtras[linkId] ?? {
      description: '',
      iconKey: DEFAULT_BENEFIT_ICON_KEY,
    };
    onBenefitExtrasChange({
      ...benefitExtras,
      [linkId]: { ...prev, ...partial },
    });
  };

  const updateManual = (
    id: string,
    partial: Partial<PassLandingManualBenefit>,
  ) =>
    onManualBenefitsChange(
      manualBenefits.map((b) => (b.id === id ? { ...b, ...partial } : b)),
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-small18 text-neutral-0 font-semibold">추가 혜택</h3>
        <p className="text-xxsmall12 text-neutral-40">
          외부링크를 입력하면 자동으로 행이 생겨요. 설명·아이콘만 채우면 됩니다.
        </p>
      </div>

      {/* 외부링크 유래 혜택 (이름은 외부링크에서 실시간) */}
      <div className="flex flex-col gap-2">
        {externalLinks.length === 0 ? (
          <p className="text-xsmall14 py-2 text-neutral-50">
            외부링크가 없습니다. 위 &apos;외부 링크&apos; 섹션에서 추가하면
            여기에 자동으로 나타납니다.
          </p>
        ) : (
          externalLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <TextField
                label="혜택명 (외부링크)"
                value={link.name || '(이름 없음)'}
                size="small"
                className="w-56 shrink-0"
                disabled
              />
              <TextField
                label="혜택 설명"
                value={benefitExtras[link.id]?.description ?? ''}
                onChange={(e) =>
                  updateExtra(link.id, { description: e.target.value })
                }
                size="small"
                fullWidth
              />
              <IconSelect
                value={
                  benefitExtras[link.id]?.iconKey ?? DEFAULT_BENEFIT_ICON_KEY
                }
                onChange={(iconKey) => updateExtra(link.id, { iconKey })}
              />
              <Tooltip title="외부 링크 섹션에서 삭제하세요">
                <span>
                  <IconButton aria-label="외부링크 혜택" disabled>
                    <FaTrashCan size={16} />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          ))
        )}
      </div>

      {/* 직접 추가 혜택 */}
      <div className="flex flex-col gap-2">
        {manualBenefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center gap-2">
            <TextField
              label="혜택명"
              value={benefit.name}
              onChange={(e) =>
                updateManual(benefit.id, { name: e.target.value })
              }
              size="small"
              className="w-56 shrink-0"
            />
            <TextField
              label="혜택 설명"
              value={benefit.description}
              onChange={(e) =>
                updateManual(benefit.id, { description: e.target.value })
              }
              size="small"
              fullWidth
            />
            <IconSelect
              value={benefit.iconKey}
              onChange={(iconKey) => updateManual(benefit.id, { iconKey })}
            />
            <IconButton
              aria-label="혜택 삭제"
              color="error"
              onClick={() =>
                onManualBenefitsChange(
                  manualBenefits.filter((b) => b.id !== benefit.id),
                )
              }
            >
              <FaTrashCan size={16} />
            </IconButton>
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={() =>
          onManualBenefitsChange([
            ...manualBenefits,
            createEmptyManualBenefit(),
          ])
        }
        sx={{ borderStyle: 'dashed' }}
      >
        혜택 직접 추가
      </Button>
    </div>
  );
}
