'use client';

// 올인원패스 플랜 선택 바텀시트 → 주문 스토어 채우고 /payment-input 이동.

import BaseButton from '@/common/button/BaseButton';
import { OptionFormRadioControlLabel } from '@/common/ControlLabel';
import OptionDropdown from '@/common/dropdown/OptionDropdown';
import PriceView from '@/common/price/PriceView';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import {
  getPlanFinalAmount,
  useGetMembershipApplicationForm,
} from '@/domain/all-in-one-pass/api/purchase';
import useMembershipOrderStore from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import { generateOrderId } from '@/lib/order';
import { RadioGroup } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  membershipId: number;
  isOpen: boolean;
  onClose: () => void;
}

const MembershipPlanBottomSheet = ({
  membershipId,
  isOpen,
  onClose,
}: Props) => {
  const router = useRouter();
  const setOrder = useMembershipOrderStore((s) => s.setOrder);
  const { data: form } = useGetMembershipApplicationForm(membershipId);
  const plans = form?.planList ?? [];

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId == null && plans.length) {
      setSelectedId(plans[0].membershipPlanId);
    }
  }, [plans, selectedId]);

  const selected = useMemo(
    () => plans.find((p) => p.membershipPlanId === selectedId) ?? null,
    [plans, selectedId],
  );
  const finalAmount = selected ? getPlanFinalAmount(selected) : 0;

  const handleApply = () => {
    if (!selected || !form) return;
    const price = selected.price ?? 0;
    const discount = selected.discount ?? 0;
    const totalPrice = Math.max(price - discount, 0);
    setOrder({
      membershipId,
      membershipPlanId: selected.membershipPlanId,
      passTitle: form.title ?? '올인원패스',
      thumbnail: form.thumbnail ?? null,
      price,
      discount,
      couponCode: null,
      couponPrice: 0,
      totalPrice,
      contactEmail: form.contactEmail ?? form.email ?? '',
      email: form.email ?? '',
      name: form.name ?? '',
      phone: form.phoneNumber ?? '',
      orderId: generateOrderId(),
      isFree: totalPrice === 0,
      beginning: form.beginning ?? null,
      deadline: form.deadline ?? null,
    });
    router.push(`/all-in-one-pass/${membershipId}/payment-input`);
  };

  return (
    <BaseBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className="mx-auto max-w-[1000px]"
    >
      <div className="mb-4 mt-3">
        <span className="required-star text-xsmall14 font-semibold">
          플랜 선택 (필수)
        </span>
      </div>
      <OptionDropdown label="올인원패스 플랜" wrapperClassName="w-full">
        <RadioGroup
          value={selectedId != null ? String(selectedId) : ''}
          onChange={(_, v) => setSelectedId(Number(v))}
        >
          {plans.map((plan, i) => (
            <OptionFormRadioControlLabel
              key={plan.membershipPlanId}
              value={String(plan.membershipPlanId)}
              label={
                <>
                  <b className="font-bold">{plan.title}</b>
                  <br />
                  <span className="text-neutral-10">
                    {plan.description ?? ''}
                  </span>
                </>
              }
              wrapperClassName={clsx(
                'py-3 pl-2 pr-3',
                i < plans.length - 1 && 'border-neutral-80 border-b',
              )}
              right={<PriceView price={plan.price} discount={plan.discount} />}
            />
          ))}
        </RadioGroup>
      </OptionDropdown>

      <span className="text-xsmall14 mt-6 block font-semibold">
        총 결제 금액
      </span>
      <hr className="my-3" />
      <span className="text-small18 text-neutral-10 block text-right font-bold">
        {finalAmount.toLocaleString()}원
      </span>

      <section className="mt-6 flex items-center gap-3">
        <BaseButton className="flex-1" variant="outlined" onClick={onClose}>
          이전 단계로
        </BaseButton>
        <BaseButton className="flex-1" onClick={handleApply}>
          신청하기
        </BaseButton>
      </section>
    </BaseBottomSheet>
  );
};

export default MembershipPlanBottomSheet;
