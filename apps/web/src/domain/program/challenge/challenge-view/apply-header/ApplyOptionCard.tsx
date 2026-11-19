'use client';

import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useChallengeApplySheetStore } from '../../store/useChallengeApplySheetStore';

const optionClassName = (
  selected: boolean,
  disabled: boolean,
  className?: string,
) =>
  twMerge(
    'flex flex-1 flex-col items-start rounded-sm border bg-white px-4 py-3 text-left transition-colors',
    selected
      ? 'border-primary text-neutral-0 ring-1 ring-primary'
      : 'border-neutral-85 text-neutral-30 hover:border-neutral-60',
    disabled &&
      'cursor-not-allowed border-neutral-85 bg-neutral-95 text-neutral-60 ring-0 hover:border-neutral-85',
    className,
  );

const OptionButton = ({
  selected,
  onClick,
  disabled = false,
  className,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onClick}
    className={optionClassName(selected, disabled, className)}
  >
    {children}
  </button>
);

/**
 * 다른 페이지(버전·기수)로 가는 선택지. 링크로 두고 미리 받아 둬서 누를 때
 * 로딩 화면 없이 바로 바뀌게 하고, 스크롤 위치도 유지한다 (LC-3632).
 */
const OptionLink = ({
  selected,
  href,
  disabled = false,
  className,
  children,
}: {
  selected: boolean;
  href: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  const keepScroll = useChallengeApplySheetStore(
    (state) => state.keepScrollOnNextPage,
  );
  if (selected || disabled) {
    return (
      <OptionButton
        selected={selected}
        disabled={disabled}
        onClick={() => {}}
        className={className}
      >
        {children}
      </OptionButton>
    );
  }
  return (
    <Link
      href={href}
      prefetch
      scroll={false}
      onClick={keepScroll}
      className={optionClassName(false, false, className)}
    >
      {children}
    </Link>
  );
};

const OptionGroup = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-xsmall14 font-semibold text-neutral-30">{title}</p>
    {children}
  </div>
);

export type ApplyMode = 'LIVE' | 'TEMPLATE';

export interface StartDateOption {
  key: string;
  startDate: string;
  endDate: string;
  deadline: string | null;
  /** 버전 데이터가 없는 챌린지에서 제목 대괄호로 구분하는 태그 */
  tag: string | null;
  selected: boolean;
  href: string;
}

export interface TargetOption {
  key: string;
  label: string;
  selected: boolean;
  href: string;
}

/** 모집 마감까지 3일 이내면 마감 임박 */
const isClosingSoon = (deadline: string | null) => {
  if (!deadline) return false;
  const diff = dayjs(deadline).diff(dayjs(), 'day', true);
  return diff >= 0 && diff <= 3;
};

const formatDateWithDay = (date: string) =>
  dayjs(date).format('YYYY년 M월 D일 (dd)');

interface Props {
  /** 연결된 가이드북이 있을 때만 진행 방식을 고를 수 있다 */
  showModeSelect: boolean;
  mode: ApplyMode;
  onChangeMode: (mode: ApplyMode) => void;
  targetOptions: TargetOption[];
  startDateOptions: StartDateOption[];
}

function ApplyOptionCard({
  showModeSelect,
  mode,
  onChangeMode,
  targetOptions,
  startDateOptions,
}: Props) {
  // 템플릿(가이드북)은 기수·버전과 무관해 참여 대상·시작일을 고를 수 없게 한다
  const isTemplate = mode === 'TEMPLATE';

  return (
    <div className="flex h-full flex-col gap-5 rounded-md bg-primary-5 px-4 py-5 md:px-5">
      {showModeSelect && (
        <OptionGroup title="진행 방식">
          <div className="flex flex-col gap-2.5 md:flex-row md:gap-4">
            <OptionButton
              selected={mode === 'LIVE'}
              onClick={() => onChangeMode('LIVE')}
            >
              <span className="text-xsmall16 font-bold">
                매일 미션으로 완성하기(챌린지)
              </span>
              <span className="mt-1.5 text-xxsmall12 text-neutral-40">
                미션과 피드백으로 꾸준히
              </span>
            </OptionButton>
            <OptionButton
              selected={mode === 'TEMPLATE'}
              onClick={() => onChangeMode('TEMPLATE')}
            >
              <span className="text-xsmall16 font-bold">
                가이드 따라 완성하기(가이드북)
              </span>
              <span className="mt-1.5 text-xxsmall12 text-neutral-40">
                내 속도에 맞춰 혼자서
              </span>
            </OptionButton>
          </div>
        </OptionGroup>
      )}

      {targetOptions.length > 1 && (
        <OptionGroup title="현재 나의 상황">
          <div className="flex flex-col gap-2.5 md:flex-row md:gap-4">
            {targetOptions.map((option) => (
              <OptionLink
                key={option.key}
                selected={option.selected}
                href={option.href}
                disabled={isTemplate}
              >
                <span className="text-xsmall16 font-bold">{option.label}</span>
              </OptionLink>
            ))}
          </div>
        </OptionGroup>
      )}

      {startDateOptions.length > 0 && (
        <OptionGroup title="챌린지 시작일">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
            {startDateOptions.map((option) => (
              <OptionLink
                key={option.key}
                selected={option.selected}
                href={option.href}
                disabled={isTemplate}
                className="px-3.5"
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="text-xxsmall12 text-neutral-40">
                    {option.tag ? `시작일 · ${option.tag}` : '시작일'}
                  </span>
                  {isClosingSoon(option.deadline) && (
                    <span className="shrink-0 rounded-xxs bg-[#FFEFED] px-1.5 py-0.5 text-xxsmall10 font-medium text-system-error">
                      마감 임박
                    </span>
                  )}
                </span>
                <span className="mt-2.5 text-xsmall16 font-bold">
                  {formatDateWithDay(option.startDate)}
                </span>
                <span className="mt-1 text-xxsmall12 text-neutral-40">
                  {dayjs(option.endDate).format('YYYY년 M월 D일')} 종료
                </span>
              </OptionLink>
            ))}
          </div>
        </OptionGroup>
      )}
    </div>
  );
}

export default ApplyOptionCard;
