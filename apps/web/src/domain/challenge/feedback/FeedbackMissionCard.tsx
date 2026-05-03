'use client';

import clsx from 'clsx';
import { useState } from 'react';

export interface FeedbackMissionCardConfig {
  thumbnail: string;
  title: string;
  description?: string;
  statusLabel?: string;
  categoryLabel?: string;
  startDay?: string; // 'YYYY-MM-DD'
  endDay?: string; // 'YYYY-MM-DD'
  buttonLabel: string;
}

function formatDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year.slice(2)}.${month}.${day}`;
}

interface FeedbackMissionCardProps {
  config: FeedbackMissionCardConfig;
  children?: React.ReactNode;
  onMobileClick?: () => void;
}

const FeedbackMissionCard = ({
  config,
  children,
  onMobileClick,
}: FeedbackMissionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    thumbnail,
    title,
    description,
    statusLabel,
    categoryLabel,
    startDay,
    endDay,
    buttonLabel,
  } = config;

  const dateText =
    startDay && endDay
      ? `진행기간 ${formatDay(startDay)} ~ ${formatDay(endDay)}`
      : undefined;

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
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-2">
              {/* 뱃지 영역 */}
              <div className="flex w-full flex-wrap items-center gap-2">
                {statusLabel && (
                  <span className="rounded-xxs text-xxsmall12 border-1 border-netural-80 text-primary border px-2 py-1 font-normal">
                    {statusLabel}
                  </span>
                )}
                {categoryLabel && (
                  <span className="text-xxsmall12 text-neutral-40 font-normal">
                    {categoryLabel}
                  </span>
                )}
                {dateText && (
                  <>
                    <div className="bg-neutral-80 hidden h-4 w-px md:block" />
                    <p className="text-xxsmall12 text-neutral-40 hidden font-normal md:inline">
                      {dateText}
                    </p>
                  </>
                )}
              </div>

              {/* 제목 + 설명 */}
              <div className="flex flex-col gap-1">
                <h3 className="text-xsmall16 text-neutral-0 line-clamp-2 font-semibold">
                  {title}
                </h3>
                {description && (
                  <p className="text-xsmall14 text-neutral-20 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>

              {dateText && (
                <p className="text-xxsmall12 text-neutral-40 line-clamp-1 font-normal md:hidden">
                  {dateText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 토글 버튼 - 데스크톱 전용 */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-xxs text-xsmall14 border-primary text-primary hover:bg-primary-5 hidden shrink-0 items-center gap-1 border px-3 py-1.5 font-normal transition-colors md:flex"
        >
          <img
            src="/icons/Chevron_Down.svg"
            alt=""
            className={clsx(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180',
            )}
          />
          <span>{isOpen ? `${buttonLabel} 닫기` : `${buttonLabel} 하기`}</span>
        </button>
      </div>

      {/* 모바일 버튼 - 카드 하단 고정 */}
      <button
        type="button"
        onClick={onMobileClick}
        className="rounded-xxs text-xsmall14 border-primary text-primary hover:bg-primary/5 mt-5 flex w-full items-center justify-center gap-1 border px-3 py-1.5 font-normal transition-colors md:hidden"
      >
        <span>{`${buttonLabel} 하기`}</span>
      </button>

      {/* 아코디언 - 데스크톱 전용, 카드 내부 */}
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
    </div>
  );
};

export default FeedbackMissionCard;
