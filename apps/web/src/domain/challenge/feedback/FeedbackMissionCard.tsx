'use client';

import clsx from 'clsx';
import { useState } from 'react';

function formatDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year.slice(2)}.${month}.${day}`;
}

export interface StatusBadge {
  label: string;
  variant: 'neutral' | 'active' | 'muted' | 'error';
}

export interface FeedbackMissionCardConfig {
  thumbnail: string;
  title: string;
  description?: string;
  badge: StatusBadge;
  challengeType: string;
  missionNumber: number;
  startDay?: string;
  endDay?: string;
  feedbackStartDay: string;
  feedbackEndDay: string;
  reservationDateTime?: string | null;
}

interface FeedbackMissionCardProps {
  config: FeedbackMissionCardConfig;
  buttonLabel?: string; // 우상단 미션 버튼
  onClick?: () => void; // 미션 버튼 클릭 핸들러
  accordionLabel?: string; // 보라색 바 닫힌 텍스트 / 모바일 두 번째 버튼 (있으면 렌더링)
  openLabel?: string; // 보라색 바 열린 텍스트
  onAccordionMobileClick?: () => void; // 모바일 두 번째 버튼 클릭 (상세 페이지 이동)
  children?: React.ReactNode;
  notice?: React.ReactNode; // 카드 하단 안내 박스
}

const cardInfoTextCls =
  'text-xxsmall12 text-neutral-40 font-normal tracking-[-0.3px]';

const btnCls =
  'rounded-xxs text-xsmall14 border-primary text-primary border px-3 py-1.5 font-normal transition-colors items-center gap-1 hover:bg-primary-5';

const DateField = ({
  label,
  start,
  end,
  value,
  highlighted,
  className,
}: {
  label: string;
  start?: string;
  end?: string;
  value?: string | null;
  highlighted?: boolean;
  className?: string;
}) => (
  <span
    className={clsx(
      'flex gap-1.5 tracking-[-0.4px] md:tracking-[-0.3px]',
      cardInfoTextCls,
      className,
    )}
  >
    <span className={highlighted ? 'text-neutral-0' : 'text-neutral-40'}>
      {label}
    </span>
    <span className={highlighted ? 'text-primary-dark' : 'text-neutral-40'}>
      {value ??
        (start && end ? `${formatDay(start)} ~ ${formatDay(end)}` : null)}
    </span>
  </span>
);

const FeedbackMissionCard = ({
  config,
  buttonLabel,
  onClick,
  accordionLabel,
  openLabel,
  onAccordionMobileClick,
  children,
  notice,
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
    feedbackStartDay,
    feedbackEndDay,
    reservationDateTime,
  } = config;

  const hasAccordion = !!accordionLabel && !!openLabel;

  const reservationDateProps = reservationDateTime
    ? { label: '예약일시', value: reservationDateTime, highlighted: true }
    : startDay && endDay
      ? { label: '예약기간', start: startDay, end: endDay, highlighted: true }
      : null;

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
                    badge.variant === 'muted' &&
                      'border-neutral-95 bg-neutral-95 text-neutral-40',
                    badge.variant === 'error' &&
                      'bg-system-error/10 text-system-error border-[#FEEDEB]',
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
                  label="피드백 진행일정"
                  start={feedbackStartDay}
                  end={feedbackEndDay}
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

            {reservationDateProps && (
              <DateField {...reservationDateProps} className="hidden md:flex" />
            )}

            {/* 모바일 날짜 */}
            <div className="flex flex-col gap-1 md:hidden">
              <DateField
                label="진행일정"
                highlighted
                start={feedbackStartDay}
                end={feedbackEndDay}
              />
              {reservationDateProps && <DateField {...reservationDateProps} />}
            </div>
          </div>
        </div>

        {/* 데스크톱 미션 버튼 - 항상 navigate */}
        {buttonLabel && (
          <button
            type="button"
            onClick={onClick}
            className={clsx(btnCls, 'hidden shrink-0 md:flex')}
          >
            {buttonLabel}
          </button>
        )}
      </div>

      {/* 모바일 버튼 영역 */}
      {(buttonLabel || accordionLabel) && (
        <div className="mt-5 flex flex-col gap-2 md:hidden">
          {buttonLabel && (
            <button
              type="button"
              onClick={onClick}
              className={clsx(btnCls, 'flex w-full justify-center')}
            >
              {buttonLabel}
            </button>
          )}
          {accordionLabel && (
            <button
              type="button"
              onClick={onAccordionMobileClick}
              className={clsx(btnCls, 'flex w-full justify-center')}
            >
              {accordionLabel}
            </button>
          )}
        </div>
      )}

      {/* 아코디언 콘텐츠 */}
      {hasAccordion && (
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

      {/* 보라색 아코디언 토글 바 */}
      {hasAccordion && (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={clsx(
            'hidden items-center justify-end gap-1 p-4 md:flex',
            isOpen ? 'bg-white' : 'bg-primary-5',
          )}
        >
          <span className="text-xsmall14 text-primary font-medium">
            {isOpen ? openLabel : accordionLabel}
          </span>
          <img
            src="/icons/Chevron_Down.svg"
            alt=""
            className={clsx('transition-transform', isOpen && 'rotate-180')}
          />
        </button>
      )}

      {notice && <div className="px-4 pb-4 pt-2">{notice}</div>}
    </div>
  );
};

export default FeedbackMissionCard;
