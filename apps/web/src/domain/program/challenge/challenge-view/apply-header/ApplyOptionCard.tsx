'use client';

import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { ReactNode } from 'react';

const OptionButton = ({
  selected,
  onClick,
  className,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={twMerge(
      'flex flex-1 flex-col items-start rounded-sm border bg-white px-4 py-3.5 text-left transition-colors',
      selected
        ? 'border-primary text-neutral-0 ring-1 ring-primary'
        : 'border-neutral-85 text-neutral-30 hover:border-neutral-60',
      className,
    )}
  >
    {children}
  </button>
);

const OptionGroup = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2.5">
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
  onSelect: () => void;
}

export interface TargetOption {
  key: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
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
  /** LIGHT 플랜이 있을 때만 진행 방식을 고를 수 있다 */
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
  return (
    <div className="flex flex-col gap-6 rounded-md bg-primary-5 px-4 py-6 md:px-5">
      {showModeSelect && (
        <OptionGroup title="진행 방식 선택">
          <div className="flex flex-col gap-2.5 md:flex-row md:gap-4">
            <OptionButton
              selected={mode === 'LIVE'}
              onClick={() => onChangeMode('LIVE')}
            >
              <span className="text-xsmall16 font-bold">
                렛츠커리어와 실시간으로 함께
              </span>
              <span className="mt-1.5 text-xxsmall12 text-neutral-40">
                매일 미션 · 멘토 피드백 · 가이드북 포함
              </span>
            </OptionButton>
            <OptionButton
              selected={mode === 'TEMPLATE'}
              onClick={() => onChangeMode('TEMPLATE')}
            >
              <span className="text-xsmall16 font-bold">템플릿으로 혼자</span>
              <span className="mt-1.5 text-xxsmall12 text-neutral-40">
                PDF + 템플릿 즉시 다운로드
              </span>
            </OptionButton>
          </div>
        </OptionGroup>
      )}

      {targetOptions.length > 1 && (
        <OptionGroup title="참여 대상">
          <div className="flex flex-col gap-2.5 md:flex-row md:gap-4">
            {targetOptions.map((option) => (
              <OptionButton
                key={option.key}
                selected={option.selected}
                onClick={option.onSelect}
              >
                <span className="text-xsmall16 font-bold">{option.label}</span>
              </OptionButton>
            ))}
          </div>
        </OptionGroup>
      )}

      {startDateOptions.length > 0 && (
        <OptionGroup title="시작일 선택">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
            {startDateOptions.map((option) => (
              <OptionButton
                key={option.key}
                selected={option.selected}
                onClick={option.onSelect}
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
                <span className="mt-2.5 whitespace-nowrap text-xsmall16 font-bold">
                  {formatDateWithDay(option.startDate)}
                </span>
                <span className="mt-1 text-xxsmall12 text-neutral-40">
                  {dayjs(option.endDate).format('YYYY년 M월 D일')} 종료
                </span>
              </OptionButton>
            ))}
          </div>
        </OptionGroup>
      )}
    </div>
  );
}

export default ApplyOptionCard;
