import { PassPermission, PassPlan } from '@/domain/all-in-one-pass/types';
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

// 숫자 입력 오른쪽 정렬
const numberInputSx = { '& input': { textAlign: 'right' as const } };

const PERMISSION_OPTIONS: { value: PassPermission; label: string }[] = [
  { value: 'CHALLENGE_ALL_IN_ONE', label: '챌린지 올인원' },
  { value: 'GUIDEBOOK_ALL_IN_ONE', label: '가이드북 올인원' },
  { value: 'VOD_ALL_IN_ONE', label: 'VOD 올인원' },
];

export const createEmptyPlan = (): PassPlan => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  permissions: [],
  regularPrice: null,
  discountPrice: null,
});

interface Props {
  plans: PassPlan[];
  onChange: (plans: PassPlan[]) => void;
}

/** 플랜 정보(권한 구성): 다중 플랜 + 포함 권한 + 정가/할인가 */
export default function PlanSection({ plans, onChange }: Props) {
  const updatePlan = (id: string, partial: Partial<PassPlan>) =>
    onChange(plans.map((p) => (p.id === id ? { ...p, ...partial } : p)));

  const togglePermission = (id: string, perm: PassPermission) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    const permissions = plan.permissions.includes(perm)
      ? plan.permissions.filter((x) => x !== perm)
      : [...plan.permissions, perm];
    updatePlan(id, { permissions });
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-small18 text-neutral-0 font-semibold">
        플랜 정보 (권한 구성)
      </h2>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border-neutral-80 flex overflow-hidden rounded-md border"
          >
            <div className="flex flex-1 flex-col gap-4 p-4">
              <TextField
                label="플랜명"
                value={plan.name}
                onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                size="small"
                fullWidth
              />

              <TextField
                label="플랜 설명"
                value={plan.description}
                onChange={(e) =>
                  updatePlan(plan.id, { description: e.target.value })
                }
                size="small"
                fullWidth
              />

              <fieldset className="border-neutral-60 -mt-1.5 rounded-[4px] border px-2 pb-2">
                <legend className="text-xxsmall12 text-neutral-40 px-1">
                  포함 권한
                </legend>
                <div className="flex flex-wrap gap-x-4 px-1">
                  {PERMISSION_OPTIONS.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      control={
                        <Checkbox
                          checked={plan.permissions.includes(opt.value)}
                          onChange={() => togglePermission(plan.id, opt.value)}
                        />
                      }
                      label={opt.label}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="flex gap-2">
                <TextField
                  label="정가"
                  type="number"
                  value={plan.regularPrice ?? ''}
                  onChange={(e) =>
                    updatePlan(plan.id, {
                      regularPrice:
                        e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  size="small"
                  sx={numberInputSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">원</InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
                <TextField
                  label="할인가"
                  type="number"
                  value={plan.discountPrice ?? ''}
                  onChange={(e) =>
                    updatePlan(plan.id, {
                      discountPrice:
                        e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  size="small"
                  sx={numberInputSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">원</InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />
              </div>
            </div>
            <button
              type="button"
              aria-label="플랜 삭제"
              onClick={() => onChange(plans.filter((p) => p.id !== plan.id))}
              className="border-neutral-80 text-neutral-40 hover:bg-system-error/10 hover:text-system-error flex w-9 shrink-0 items-center justify-center rounded rounded-r-md border-l transition-colors"
            >
              <FaTrashCan size={16} />
            </button>
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={() => onChange([...plans, createEmptyPlan()])}
        sx={{ borderStyle: 'dashed' }}
      >
        플랜 추가
      </Button>
    </section>
  );
}
