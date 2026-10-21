import { PassPermission, PassPlan } from '@/domain/all-in-one-pass/types';
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Check, Pencil } from 'lucide-react';
import { useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

// 숫자 입력 오른쪽 정렬
const numberInputSx = { '& input': { textAlign: 'right' as const } };

const PERMISSION_OPTIONS: { value: PassPermission; label: string }[] = [
  { value: 'CHALLENGE_ALL_IN_ONE', label: '챌린지 올인원' },
  { value: 'GUIDEBOOK_ALL_IN_ONE', label: '가이드북 올인원' },
  { value: 'VOD_ALL_IN_ONE', label: 'VOD 올인원' },
  { value: 'LIVE_CLASS_ALL_IN_ONE', label: 'LIVE 클래스 올인원' },
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
  mentoringCouponAutoIssue: boolean;
  onMentoringChange: (checked: boolean) => void;
  /**
   * 수정 페이지 전용: per-plan 저장/삭제. 넘기면 "편집 모드"로 동작한다
   * (수정 버튼을 눌러야 편집 가능, 저장 버튼으로 그 플랜만 반영).
   * 넘기지 않으면(생성 페이지) 항상 편집 가능하고 삭제는 로컬에서만 제거.
   */
  onSavePlan?: (plan: PassPlan) => Promise<void>;
  onDeletePlan?: (plan: PassPlan) => void;
}

/** 플랜 정보(권한 구성): 다중 플랜 + 포함 권한 + 정가/할인가 */
export default function PlanSection({
  plans,
  onChange,
  mentoringCouponAutoIssue,
  onMentoringChange,
  onSavePlan,
  onDeletePlan,
}: Props) {
  const managed = !!onSavePlan;
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const editable = (id: string) => !managed || editingIds.has(id);

  const startEdit = (id: string) =>
    setEditingIds((prev) => new Set(prev).add(id));
  const stopEdit = (id: string) =>
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

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

  const handleAdd = () => {
    const plan = createEmptyPlan();
    onChange([...plans, plan]);
    if (managed) startEdit(plan.id);
  };

  const handleSave = async (plan: PassPlan) => {
    if (!onSavePlan) return;
    try {
      await onSavePlan(plan);
      stopEdit(plan.id);
    } catch {
      // 실패 시 편집 상태 유지
    }
  };

  const handleDelete = (plan: PassPlan) => {
    if (onDeletePlan) onDeletePlan(plan);
    else onChange(plans.filter((p) => p.id !== plan.id));
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-4 selection:items-start">
        <h2 className="text-small20 text-neutral-0 font-semibold">
          플랜 정보 (권한 구성)
        </h2>
        <div className="bg-primary-10 border-primary-15 rounded-sm border px-4 py-1">
          <FormControlLabel
            className="m-0"
            sx={{ cursor: 'not-allowed' }}
            control={
              <Checkbox
                checked={mentoringCouponAutoIssue}
                onChange={(e) => onMentoringChange(e.target.checked)}
                disabled
              />
            }
            label="1:1 LIVE 멘토링 50% 쿠폰 자동발급 (월단위)"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const canEdit = editable(plan.id);
          return (
            <div
              key={plan.id}
              className="border-neutral-80 flex overflow-hidden rounded-sm border"
            >
              <div className="flex flex-1 flex-col gap-4 p-4">
                <TextField
                  label="플랜명"
                  value={plan.name}
                  onChange={(e) =>
                    updatePlan(plan.id, { name: e.target.value })
                  }
                  size="small"
                  disabled={!canEdit}
                  fullWidth
                />

                <TextField
                  label="플랜 설명"
                  value={plan.description}
                  onChange={(e) =>
                    updatePlan(plan.id, { description: e.target.value })
                  }
                  size="small"
                  disabled={!canEdit}
                  fullWidth
                />

                <fieldset className="border-neutral-60 -mt-1.5 rounded-[4px] border px-2 pb-2">
                  <legend className="text-xxsmall12 text-neutral-40 px-1">
                    포함 권한
                  </legend>
                  <div className="flex flex-wrap gap-x-2 px-1">
                    {PERMISSION_OPTIONS.map((opt) => (
                      <FormControlLabel
                        key={opt.value}
                        control={
                          <Checkbox
                            checked={plan.permissions.includes(opt.value)}
                            onChange={() =>
                              togglePermission(plan.id, opt.value)
                            }
                            disabled={!canEdit}
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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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

              {managed ? (
                <div className="border-neutral-80 divide-neutral-80 flex w-9 shrink-0 flex-col divide-y border-l">
                  <button
                    type="button"
                    aria-label={canEdit ? '플랜 저장' : '플랜 수정'}
                    onClick={() =>
                      canEdit ? handleSave(plan) : startEdit(plan.id)
                    }
                    className="text-neutral-40 hover:bg-neutral-95 hover:text-neutral-0 flex flex-1 items-center justify-center transition-colors"
                  >
                    {canEdit ? <Check size={16} /> : <Pencil size={16} />}
                  </button>
                  <button
                    type="button"
                    aria-label="플랜 삭제"
                    onClick={() => handleDelete(plan)}
                    className="text-neutral-40 flex flex-1 items-center justify-center transition-colors hover:bg-[#d32f2f]/5 hover:text-[#d32f2f]"
                  >
                    <FaTrashCan size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="플랜 삭제"
                  onClick={() => handleDelete(plan)}
                  className="border-neutral-80 text-neutral-40 flex w-9 shrink-0 items-center justify-center border-l transition-colors hover:bg-[#d32f2f]/5 hover:text-[#d32f2f]"
                >
                  <FaTrashCan size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={handleAdd}
        sx={{ borderStyle: 'dashed' }}
      >
        플랜 추가
      </Button>
    </section>
  );
}
