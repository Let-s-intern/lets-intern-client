import {
  PassExternalLink,
  PassLandingBenefitExtra,
  PassLandingManualBenefit,
  PassPlan,
} from '@/domain/all-in-one-pass/types';
import {
  BENEFIT_ICON_OPTIONS,
  DEFAULT_BENEFIT_ICON_KEY,
  getAdditionalBenefitSlots,
  getCoreBenefits,
  getFirstAvailableIconKey,
} from '@/domain/all-in-one-pass/util/landingOptions';
import { Button, IconButton, MenuItem, TextField } from '@mui/material';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

interface Props {
  plans: PassPlan[];
  externalLinks: PassExternalLink[];
  benefitExtras: Record<string, PassLandingBenefitExtra>;
  manualBenefits: PassLandingManualBenefit[];
  onBenefitExtrasChange: (
    extras: Record<string, PassLandingBenefitExtra>,
  ) => void;
  onManualBenefitsChange: (benefits: PassLandingManualBenefit[]) => void;
}

const createEmptyManualBenefit = (
  iconKey: string,
): PassLandingManualBenefit => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  iconKey,
});

const IconSelect = ({
  value,
  onChange,
  disabled,
  usedIconKeys,
}: {
  value: string;
  onChange: (iconKey: string) => void;
  disabled?: boolean;
  usedIconKeys?: Set<string>;
}) => {
  // 이미 다른 카드가 쓰는 아이콘은 숨기되, 이 행의 현재 선택값은 유지
  const options = BENEFIT_ICON_OPTIONS.filter(
    (opt) => opt.key === value || !usedIconKeys?.has(opt.key),
  );
  return (
    <TextField
      select
      label="아이콘"
      value={value || DEFAULT_BENEFIT_ICON_KEY}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      className="w-18 shrink-0"
      disabled={disabled}
    >
      {options.map((opt) => (
        <MenuItem key={opt.key} value={opt.key}>
          <img src={opt.src} alt="" className="h-5 w-5" />
        </MenuItem>
      ))}
    </TextField>
  );
};

/** 혜택 한 행: 아이콘 + 혜택명 + 설명 + 우측 버튼. onChange 없는 필드는 읽기전용. */
const BenefitRow = ({
  iconKey,
  onIconChange,
  name,
  nameLabel,
  onNameChange,
  nameMaxLength,
  description,
  descriptionLabel = '혜택 설명 (최대 20자)',
  onDescriptionChange,
  descriptionMaxLength,
  action,
  usedIconKeys,
}: {
  iconKey: string;
  onIconChange?: (iconKey: string) => void;
  usedIconKeys?: Set<string>;
  name: string;
  nameLabel: string;
  onNameChange?: (name: string) => void;
  nameMaxLength?: number;
  description: string;
  descriptionLabel?: string;
  onDescriptionChange?: (description: string) => void;
  descriptionMaxLength?: number;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <IconSelect
      value={iconKey}
      onChange={onIconChange ?? (() => {})}
      disabled={!onIconChange}
      usedIconKeys={usedIconKeys}
    />
    <TextField
      label={nameLabel}
      value={name}
      onChange={onNameChange && ((e) => onNameChange(e.target.value))}
      size="small"
      className="w-56 shrink-0"
      disabled={!onNameChange}
      slotProps={
        nameMaxLength ? { htmlInput: { maxLength: nameMaxLength } } : undefined
      }
    />
    <TextField
      label={descriptionLabel}
      value={description}
      onChange={
        onDescriptionChange && ((e) => onDescriptionChange(e.target.value))
      }
      size="small"
      fullWidth
      disabled={!onDescriptionChange}
      slotProps={
        descriptionMaxLength
          ? { htmlInput: { maxLength: descriptionMaxLength } }
          : undefined
      }
    />
    {action}
  </div>
);

export default function LandingBenefitEditor({
  plans,
  externalLinks,
  benefitExtras,
  manualBenefits,
  onBenefitExtrasChange,
  onManualBenefitsChange,
}: Props) {
  const coreBenefits = getCoreBenefits(plans);
  // 자동 포함 혜택이 차지한 뒤 남는 슬롯. 외부링크(상단부터) → 수동 순으로 채움.
  const additionalSlots = getAdditionalBenefitSlots(plans);
  const visibleLinks = externalLinks.slice(0, additionalSlots);
  const manualSlots = Math.max(additionalSlots - visibleLinks.length, 0);
  const visibleManual = manualBenefits.slice(0, manualSlots);
  const isFull = visibleLinks.length + visibleManual.length >= additionalSlots;

  // 현재 화면에 노출되는 카드가 쓰는 아이콘(자동+외부링크+수동) — 드롭다운에서 제외
  const usedIconKeys = new Set<string>([
    ...coreBenefits.map((b) => b.iconKey),
    ...visibleLinks.map(
      (link) => benefitExtras[link.id]?.iconKey ?? DEFAULT_BENEFIT_ICON_KEY,
    ),
    ...visibleManual.map((b) => b.iconKey),
  ]);

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
    <div className="flex flex-col gap-2">
      {/* 자동 포함 혜택 (플랜 권한 union 기반 · 읽기전용) */}
      {coreBenefits.map((benefit) => (
        <BenefitRow
          key={benefit.name}
          iconKey={benefit.iconKey}
          name={benefit.name}
          nameLabel="혜택명"
          description={benefit.description}
        />
      ))}

      {/* 외부링크 유래 혜택 (이름은 외부링크에서 실시간) */}
      {externalLinks.length > 0 &&
        visibleLinks.map((link) => (
          <BenefitRow
            key={link.id}
            iconKey={
              benefitExtras[link.id]?.iconKey ?? DEFAULT_BENEFIT_ICON_KEY
            }
            onIconChange={(iconKey) => updateExtra(link.id, { iconKey })}
            name={link.name || '(이름 없음)'}
            nameLabel="혜택명 (외부링크)"
            description={benefitExtras[link.id]?.description ?? ''}
            onDescriptionChange={(description) =>
              updateExtra(link.id, { description })
            }
            descriptionMaxLength={20}
            usedIconKeys={usedIconKeys}
          />
        ))}

      {/* 직접 추가 혜택 */}
      {visibleManual.map((benefit) => (
        <BenefitRow
          key={benefit.id}
          iconKey={benefit.iconKey}
          onIconChange={(iconKey) => updateManual(benefit.id, { iconKey })}
          name={benefit.name}
          nameLabel="혜택명(최대 13자)"
          onNameChange={(name) => updateManual(benefit.id, { name })}
          nameMaxLength={13}
          description={benefit.description}
          descriptionLabel="혜택 설명 (최대 20자)"
          onDescriptionChange={(description) =>
            updateManual(benefit.id, { description })
          }
          descriptionMaxLength={20}
          usedIconKeys={usedIconKeys}
          action={
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
          }
        />
      ))}

      {!isFull && (
        <Button
          variant="outlined"
          startIcon={<FaPlus size={12} />}
          onClick={() =>
            onManualBenefitsChange([
              ...manualBenefits,
              createEmptyManualBenefit(getFirstAvailableIconKey(usedIconKeys)),
            ])
          }
          sx={{ borderStyle: 'dashed' }}
        >
          혜택 추가
        </Button>
      )}
    </div>
  );
}
