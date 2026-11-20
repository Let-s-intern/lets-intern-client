'use client';

import { twMerge } from '@/lib/twMerge';
import type { ChallengePricePlan } from '@/schema';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ApplyButton, type ApplyButtonState } from './ApplyPriceCard';
import type { PlanOption } from './planOptions';

const won = (value: number) => `${value.toLocaleString()}원`;

const PlanPrice = ({ option }: { option: PlanOption }) => (
  <span className="flex shrink-0 flex-col items-end gap-1">
    {option.discountPercentage > 0 && (
      <span className="text-xxsmall12">
        <span className="font-semibold text-system-error">
          {option.discountPercentage}%
        </span>{' '}
        <span className="text-neutral-50 line-through">
          {won(option.regularPrice)}
        </span>
      </span>
    )}
    <span className="text-xsmall16 font-bold text-neutral-0">
      {won(option.sellingPrice)}
    </span>
    {option.passPrice !== null && (
      <span className="rounded-xxs bg-primary-5 px-2 py-0.5 text-xxsmall12 font-semibold text-primary">
        올인원 패스 회원가 {won(option.passPrice)}
      </span>
    )}
  </span>
);

interface Props {
  options: PlanOption[];
  selectedPlan: ChallengePricePlan | null;
  onSelect: (plan: ChallengePricePlan | null) => void;
  applyState: ApplyButtonState;
  onApply: (plan: ChallengePricePlan) => void;
  /** 열린 올인원 패스 링크. 없으면 패스 안내를 숨긴다 */
  passHref: string | null;
  /** 패스 회원이 참여하는 금액. null 이면 패스 안내를 숨긴다 */
  passPrice: number | null;
  /** 따라오는 패널처럼 좁은 곳에서 쓸 때 */
  compact?: boolean;
}

/**
 * 챌린지 플랜 선택 (스마트스토어형 옵션 선택).
 * 고른 플랜은 결제 시트·하단 바와 같은 스토어 값이다
 */
function PlanSelectCard({
  options,
  selectedPlan,
  onSelect,
  applyState,
  onApply,
  passHref,
  passPrice,
  compact = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.plan === selectedPlan);

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={twMerge(
          'flex flex-col gap-2',
          // 상단 신청 영역은 진행 방식 카드와 같은 옅은 색 면. 따라오는 패널(compact)은 그대로
          !compact &&
            'rounded-md bg-[var(--apply-tint,#F5F6FF)] px-4 py-5 md:px-5',
        )}
      >
        <p className="text-xsmall16 font-bold text-neutral-0">
          프로그램 옵션 선택 (필수)
          <span className="text-system-error">*</span>
        </p>
        <div className="flex flex-col">
          {compact && (
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className={twMerge(
                'challenge_plan_select flex items-center justify-between gap-2 rounded-xs border bg-white px-4 py-3 text-left text-xsmall16',
                isOpen
                  ? 'rounded-b-none border-primary bg-primary-5'
                  : 'border-neutral-80',
              )}
            >
              <span className={selected ? 'text-neutral-0' : 'text-neutral-50'}>
                {selected ? selected.title : '플랜을 선택해 주세요'}
              </span>
              <ChevronDown
                size={20}
                className={twMerge(
                  'shrink-0 transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
          )}
          {(!compact || isOpen) && (
            <ul
              role="radiogroup"
              className={
                compact
                  ? 'flex flex-col rounded-b-xs border border-t-0 border-neutral-80 bg-white'
                  : 'flex flex-col gap-2.5'
              }
            >
              {options.map((option) => {
                const checked = option.plan === selectedPlan;
                return (
                  <li key={option.plan}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      onClick={() => {
                        onSelect(option.plan);
                        setIsOpen(false);
                      }}
                      className={twMerge(
                        'challenge_plan_option flex w-full items-center gap-3 px-4 py-3 text-left',
                        compact
                          ? 'hover:bg-neutral-95'
                          : twMerge(
                              'rounded-xs border bg-white',
                              checked
                                ? 'border-[color:var(--apply-accent,#4D55F5)]'
                                : 'border-transparent hover:border-neutral-70',
                            ),
                      )}
                      data-plan={option.plan}
                    >
                      <span
                        className={twMerge(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                          checked
                            ? 'border-[color:var(--apply-accent,#4D55F5)]'
                            : 'border-neutral-80',
                        )}
                      >
                        {checked && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--apply-accent,#4D55F5)]" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 whitespace-nowrap text-xsmall14 text-neutral-10">
                        {option.title}
                      </span>
                      <PlanPrice option={option} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {compact && selected && (
        <div className="flex items-center justify-between gap-2 text-xsmall14 text-neutral-30">
          <span className="min-w-0 truncate">
            선택한 플랜{' '}
            <strong className="text-neutral-0">{selected.title}</strong>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-semibold text-neutral-0">
            {won(selected.sellingPrice)}
            <button
              type="button"
              aria-label="선택한 플랜 빼기"
              onClick={() => onSelect(null)}
              className="rounded-full p-0.5 text-neutral-40 hover:text-neutral-10"
            >
              <X size={14} />
            </button>
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-neutral-80 pt-3">
        <span className="text-xsmall16 font-semibold text-neutral-10">
          총 결제 금액
        </span>
        <strong
          className={twMerge(
            'font-bold text-primary',
            compact ? 'text-medium22' : 'text-medium24 md:text-xlarge28',
          )}
        >
          {won(selected?.sellingPrice ?? 0)}
        </strong>
      </div>

      {passHref && passPrice !== null && (
        <Link
          href={passHref}
          className="pass_benefit_card flex items-center justify-between gap-3 rounded-xs bg-[var(--apply-tint,#F5F6FF)] px-4 py-3 text-xsmall14"
        >
          <span className="text-neutral-10">
            <span className="whitespace-nowrap">올인원 패스 회원은</span>{' '}
            <span className="whitespace-nowrap">
              <strong className="font-bold text-primary">
                {won(passPrice)}
              </strong>{' '}
              참여
            </span>
          </span>
          <span className="flex shrink-0 items-center font-medium text-primary">
            패스 혜택 보기
            <ChevronRight size={16} />
          </span>
        </Link>
      )}

      <ApplyButton
        state={applyState}
        label="신청하기"
        onClick={() => {
          if (!selected) {
            setIsOpen(true);
            return;
          }
          onApply(selected.plan);
        }}
      />
    </div>
  );
}

export default PlanSelectCard;
