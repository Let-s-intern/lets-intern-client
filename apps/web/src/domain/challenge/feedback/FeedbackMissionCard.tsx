'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { formatDay } from './live/utils';

export interface StatusBadge {
  label: string;
  variant: 'neutral' | 'active' | 'done';
}

export interface FeedbackMissionCardConfig {
  thumbnail: string;
  title: string;
  description?: string;
  badge: StatusBadge;
  challengeType: string;
  missionNumber: number;
  startDay: string;
  endDay: string;
  reservationStartDay?: string;
  reservationEndDay?: string;
}

interface FeedbackMissionCardProps {
  config: FeedbackMissionCardConfig;
  buttonLabel: string;
  openLabel?: string; // 있으면 토글(아코디언), 없으면 단순 클릭
  onClick?: () => void; // 비토글일 때 데스크탑/모바일 공통 클릭 핸들러
  children?: React.ReactNode;
}

const FeedbackMissionCard = ({
  config,
  buttonLabel,
  openLabel,
  onClick,
  children,
}: FeedbackMissionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    thumbnail,
    title,
    description,
    badge,
    challengeType,
    missionNumber,
    startDay,
    endDay,
    reservationStartDay,
    reservationEndDay,
  } = config;

  const isToggle = openLabel !== undefined;

  const cardInfoTextCls =
    'text-xxsmall12 text-neutral-40 font-normal tracking-[-0.3px]';

  const DateField = ({
    label,
    start,
    end,
    highlighted,
    className,
  }: {
    label: string;
    start: string;
    end: string;
    highlighted?: boolean;
    className?: string;
  }) => (
    <span
      className={clsx(
        'flex gap-1.5 tracking-[-0.36px]',
        cardInfoTextCls,
        className,
      )}
    >
      <span className={highlighted ? 'text-neutral-0' : 'text-neutral-40'}>
        {label}
      </span>
      <span className={highlighted ? 'text-primary-dark' : 'text-neutral-40'}>
        {formatDay(start)} ~ {formatDay(end)}
      </span>
    </span>
  );

  const btnCls =
    'rounded-xxs text-xsmall14 border-primary text-primary border px-3 py-1.5 font-normal transition-colors items-center gap-1 hover:bg-primary-5';

  return (
    <div className="rounded-xs md:border-neutral-85 flex h-full flex-col md:border">
      <div className="flex flex-1 flex-col gap-4 p-0 md:flex-row md:items-start md:justify-start md:gap-12 md:p-4">
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-4">
          {/* 썸네일 */}
          <div className="h-[180px] w-full shrink-0 md:h-[119px] md:w-[158px]">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="rounded-xs h-full w-full object-cover"
              />
            ) : (
              <div className="rounded-xs bg-neutral-80 h-full w-full" />
            )}
          </div>

          {/* 텍스트 영역 */}
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-col gap-2 md:gap-1.5">
              {/* 뱃지 영역 */}
              <div className="flex w-full flex-wrap items-center gap-2">
                <span
                  className={clsx(
                    'rounded-xxs text-xxsmall12 border px-2 py-1 font-normal',
                    badge.variant === 'neutral' &&
                      'border-neutral-80 text-primary',
                    badge.variant === 'active' &&
                      'border-primary-10 bg-primary-10 text-primary',
                    badge.variant === 'done' &&
                      'border-neutral-95 bg-neutral-95 text-neutral-40',
                  )}
                >
                  {badge.label}
                </span>
                <span
                  className={clsx(cardInfoTextCls, 'basis-full md:basis-auto')}
                >
                  {challengeType} 챌린지 • {missionNumber}회차
                </span>
                <div className="bg-neutral-80 hidden h-4 w-px md:block" />
                <DateField
                  label="진행일정"
                  start={startDay}
                  end={endDay}
                  className="hidden md:flex"
                />
              </div>

              {/* 제목 + 설명 */}
              <div className="mb-5 flex flex-col gap-1 md:mb-0">
                <h3 className="text-xsmall16 text-neutral-0 line-clamp-2 font-semibold leading-tight">
                  {title}
                </h3>
                {description && (
                  <p className="text-xsmall14 text-neutral-20 line-clamp-2 hidden leading-tight md:inline">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {reservationStartDay && reservationEndDay && (
              <DateField
                label="예약기간"
                highlighted
                start={reservationStartDay}
                end={reservationEndDay}
                className="hidden md:flex"
              />
            )}

            {/* 모바일 날짜 */}
            <div className="flex flex-col gap-1 md:hidden">
              <DateField
                label="진행일정"
                highlighted
                start={startDay}
                end={endDay}
              />
              {reservationStartDay && reservationEndDay && (
                <DateField
                  label="예약기간"
                  highlighted
                  start={reservationStartDay}
                  end={reservationEndDay}
                />
              )}
            </div>
          </div>
        </div>

        {/* 데스크톱 버튼 */}
        <button
          type="button"
          onClick={isToggle ? () => setIsOpen((prev) => !prev) : onClick}
          className={clsx(btnCls, 'hidden shrink-0 md:flex')}
        >
          {isToggle && (
            <img
              src="/icons/Chevron_Down.svg"
              alt="▿"
              className={clsx('transition-transform', isOpen && 'rotate-180')}
            />
          )}
          {buttonLabel}
        </button>
      </div>

      {/* 모바일 버튼 */}
      <button
        type="button"
        onClick={onClick}
        className={clsx(btnCls, 'mt-5 flex w-full justify-center md:hidden')}
      >
        {buttonLabel}
      </button>

      {/* 아코디언 - 토글일 때만 */}
      {isToggle && (
        <div
          className={clsx(
            'hidden transition-[grid-template-rows] duration-300 ease-in-out md:grid',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackMissionCard;
