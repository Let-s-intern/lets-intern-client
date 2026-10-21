// 패스 기간 연장 모달 — 옵션 카드 선택 → 현재/연장 후 종료일·결제금액 → "연장하기"(결제 연결은 후속).
'use client';

import OutlinedButton from '@/common/button/OutlinedButton';
import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import { useState } from 'react';
import { useGetMembershipApplication } from '../../../api/dashboard';
import type { AllInOnePassOption } from '../../../types';
import ExtensionSheet from './ExtensionSheet';
import { getExtensionCopy } from './extensionStatus';

const finalPrice = (o: AllInOnePassOption) => o.price - (o.discount ?? 0);
const formatDate = (d: string) => dayjs(d).format('YYYY년 M월 D일');

interface Props {
  applicationId: number;
  onClose: () => void;
}

export default function ExtensionModal({ applicationId, onClose }: Props) {
  const { data } = useGetMembershipApplication(applicationId);
  const options = data?.optionList ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(
    options[0]?.membershipOptionId ?? null,
  );
  const selected =
    options.find((o) => o.membershipOptionId === selectedId) ?? null;

  if (!data) return null;

  const price = selected ? finalPrice(selected) : 0;
  const extendedEnd = selected
    ? dayjs(data.endDate).add(selected.extensionDays, 'day')
    : null;
  const copy = getExtensionCopy(data.title, data.endDate);

  const handleConfirm = () => {
    if (!selected) return;
    // TODO: 결제 플로우 연결 — 주문 스토어 세팅 후 /payment-input 이동(POST /extension).
    onClose();
  };

  return (
    <ExtensionSheet
      onClose={onClose}
      className="flex flex-col gap-3 md:min-w-[520px]"
      title={copy.title}
      description={`${copy.line1} ${copy.line2}`}
    >
      <div className="mt-2 flex flex-col gap-1.5">
        <p className="text-xsmall16 text-neutral-0">연장 기간 선택</p>
        <ul className="flex gap-5">
          {options.map((o) => {
            const active = o.membershipOptionId === selectedId;
            return (
              <li key={o.membershipOptionId} className="flex-1">
                <button
                  type="button"
                  onClick={() => setSelectedId(o.membershipOptionId)}
                  className={clsx(
                    'rounded-xxs flex w-full flex-col items-center gap-1 border px-3 py-4 transition-colors',
                    active
                      ? 'border-primary bg-primary-5 text-primary'
                      : 'border-neutral-80 text-neutral-20 bg-white',
                  )}
                >
                  <span className="text-small18 font-bold">
                    {o.extensionDays}일
                  </span>
                  <span
                    className={clsx(
                      'text-xsmall14 font-medium',
                      active ? 'text-primary' : 'text-neutral-40',
                    )}
                  >
                    {finalPrice(o).toLocaleString()}원
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {selected && extendedEnd && (
        <div className="bg-primary-5 mt-2 flex items-start gap-4 rounded-sm p-3">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xsmall14 text-neutral-35 font-normal">
              현재 이용 종료일
            </span>
            <span className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-normal">
              {formatDate(data.endDate)}
            </span>
          </div>
          <img src="/icons/Arrow_Right_LG.svg" alt="" className="p-1" />
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xsmall14 text-neutral-35 font-normal">
              연장 후 종료일
            </span>
            <span className="text-xsmall14 md:text-xsmall16 text-primary font-normal">
              {formatDate(extendedEnd.toISOString())}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xsmall16 text-neutral-0 font-normal">
          결제 금액
        </span>
        <span className="text-xsmall16 text-neutral-0 font-medium">
          {price.toLocaleString()}원
        </span>
      </div>

      <div className="border-neutral-85 -mx-6 flex items-center gap-3 border-t px-6 pt-4">
        <OutlinedButton
          className="border-neutral-80 flex-1 text-neutral-50"
          onClick={onClose}
        >
          닫기
        </OutlinedButton>
        <SolidButton
          className="flex-1"
          disabled={!selected}
          onClick={handleConfirm}
        >
          <span className="md:hidden">연장하기</span>
          <span className="hidden md:inline">
            {price.toLocaleString()}원으로 연장하기
          </span>
        </SolidButton>
      </div>
    </ExtensionSheet>
  );
}
