import { PlanChangeRequest, usePlanChangeQuery } from '@/api/planChange';
import { ChallengePricePlan } from '@/schema';
import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import {
  buildPlanChangeConfirmSentence,
  formatPlan,
  getUpgradeOptions,
  PLAN_MISSING_REASON,
} from './utils/planChangeConfirm';

export interface PlanChangeTarget {
  applicationId: number;
  name: string;
  programTitle: string;
}

interface PlanChangeModalProps {
  target: PlanChangeTarget;
  isSubmitting: boolean;
  onSubmit: (body: PlanChangeRequest) => void;
  onClose: () => void;
}

/**
 * 운영진이 참여자 플랜을 올리는 모달. 모양은 RefundModal 과 맞춘다.
 * 차액은 시스템 계산값으로 채우고 운영이 고칠 수 있다. 담당자·사유는 필수다 (설계안 D10).
 */
const PlanChangeModal = ({
  target,
  isSubmitting,
  onSubmit,
  onClose,
}: PlanChangeModalProps) => {
  const { data, isLoading, isError } = usePlanChangeQuery(target.applicationId);
  // MUI Select 는 undefined 를 값으로 쓸 수 없어 미선택을 빈 문자열로 둔다
  const [toPlan, setToPlan] = useState<ChallengePricePlan | ''>('');
  const [amountInput, setAmountInput] = useState('');
  const [managerName, setManagerName] = useState('');
  const [reason, setReason] = useState('');

  // 플랜이 없는 레거시 신청은 표에서 막히지만, 열리더라도 고를 선택지를 주지 않는다
  const options = data?.currentPlan
    ? getUpgradeOptions(data.currentPlan, data.options)
    : [];
  const selected = options.find((option) => option.planType === toPlan);
  const amount = amountInput === '' ? null : Number(amountInput);
  const isAmountEdited =
    selected !== undefined &&
    amount !== null &&
    amount !== selected.calculatedAmount;

  const canSubmit =
    !isSubmitting &&
    selected !== undefined &&
    amount !== null &&
    managerName.trim().length > 0 &&
    reason.trim().length > 0;

  // 대상을 바꾸면 이전 대상 기준으로 고친 금액은 의미가 없어 새 계산값으로 채운다
  const handleSelectPlan = (plan: ChallengePricePlan) => {
    setToPlan(plan);
    const option = options.find((o) => o.planType === plan);
    setAmountInput(option ? String(option.calculatedAmount) : '');
  };

  const handleSubmit = () => {
    if (!canSubmit || !selected || amount === null) return;
    onSubmit({
      toPlan: selected.planType,
      // 계산값과 같으면 null 을 보내 서버 계산값을 기록하게 한다
      additionalAmount: amount === selected.calculatedAmount ? null : amount,
      managerName: managerName.trim(),
      reason: reason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-white p-6">
        <h2 className="text-1.25-bold mb-4">플랜 변경</h2>

        <dl className="mb-5 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
          <dt className="text-neutral-500">참여자</dt>
          <dd>{target.name}</dd>

          <dt className="text-neutral-500">챌린지</dt>
          <dd>{target.programTitle}</dd>

          <dt className="text-neutral-500">현재 플랜</dt>
          <dd>{data?.currentPlan ? formatPlan(data.currentPlan) : '-'}</dd>
        </dl>

        {isLoading ? (
          <p className="mb-3 text-sm text-neutral-500">
            플랜 정보를 불러오는 중입니다.
          </p>
        ) : isError ? (
          <p className="mb-3 text-sm text-red-600">
            플랜 정보를 불러오지 못했습니다.
          </p>
        ) : data?.currentPlan === null ? (
          <p className="mb-3 text-sm text-red-600">{PLAN_MISSING_REASON}</p>
        ) : (
          <>
            <div className="mb-3">
              <span className="mb-1 block text-sm text-neutral-500">
                변경할 플랜
              </span>
              <Select<ChallengePricePlan | ''>
                size="small"
                displayEmpty
                value={toPlan}
                onChange={(e) =>
                  handleSelectPlan(e.target.value as ChallengePricePlan)
                }
                disabled={options.length === 0}
                inputProps={{ 'aria-label': '변경할 플랜' }}
                className="w-full text-sm"
              >
                <MenuItem value="" disabled>
                  {options.length === 0
                    ? '변경할 수 있는 상위 플랜이 없습니다'
                    : '플랜 선택'}
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option.planType} value={option.planType}>
                    {formatPlan(option.planType)} (차액{' '}
                    {option.calculatedAmount.toLocaleString()}원)
                  </MenuItem>
                ))}
              </Select>
            </div>

            <dl className="mb-3 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
              <dt className="text-neutral-500">계산 차액</dt>
              <dd>
                {selected
                  ? `${selected.calculatedAmount.toLocaleString()}원`
                  : '-'}
              </dd>
            </dl>

            <div className="mb-3">
              <span className="mb-1 block text-sm text-neutral-500">
                수납 금액
              </span>
              <div className="flex items-center gap-2">
                <input
                  className="w-40 rounded border border-neutral-300 px-3 py-2 text-right text-sm"
                  inputMode="numeric"
                  aria-label="수납 금액"
                  disabled={!selected}
                  value={amount === null ? '' : amount.toLocaleString()}
                  onChange={(e) =>
                    setAmountInput(e.target.value.replace(/[^0-9]/g, ''))
                  }
                />
                <span className="text-sm">원</span>
              </div>
              {selected && isAmountEdited ? (
                <p className="mt-1 text-sm text-neutral-500">
                  계산값 {selected.calculatedAmount.toLocaleString()}원과
                  다릅니다
                </p>
              ) : null}
            </div>
          </>
        )}

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-neutral-500">
            담당자 이름
          </span>
          <input
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="플랜을 변경하는 담당자 이름"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-neutral-500">사유</span>
          <input
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="예: 9/12 계좌이체 입금 확인"
          />
        </label>

        {data?.currentPlan && selected && amount !== null ? (
          <div className="mb-3 rounded bg-neutral-100 p-3 text-sm">
            {buildPlanChangeConfirmSentence({
              name: target.name,
              fromPlan: data.currentPlan,
              toPlan: selected.planType,
              additionalAmount: amount,
            })}
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded border border-neutral-300 px-4 py-2 text-sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="button"
            className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:bg-neutral-300"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;
