'use client';

// 선택일의 프로그램/일정 목록 — 상태 뱃지·일시·참여/대시보드 버튼
import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type {
  NormalizedCalendarEvent,
  PassCalendarEventType,
  PassParticipationStatus,
} from '../../../types';

type Day = ReturnType<typeof dayjs>;

/** 캘린더 유형 라벨 (프로그램 종류 아님 — 어드민 캘린더 유형) */
const TYPE_LABEL: Record<PassCalendarEventType, string> = {
  CHALLENGE: '챌린지',
  GUERRILLA: '게릴라세션',
  MILESTONE: '기타 일정',
};

const STATUS_LABEL: Record<PassParticipationStatus, string> = {
  BEFORE: '참여 가능',
  IN_PROGRESS: '참여 중',
  DONE: '참여 완료',
};
const STATUS_BADGE: Record<PassParticipationStatus, string> = {
  IN_PROGRESS: 'bg-primary-10 text-primary',
  BEFORE: 'border-neutral-80 text-primary border',
  DONE: 'bg-neutral-90 text-neutral-40',
};

interface Props {
  date: Day;
  events: NormalizedCalendarEvent[];
  stickyTop?: number;
}

export default function CalendarDayList({ date, events, stickyTop }: Props) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  // 날짜 변경 시 목록을 최상단으로 리셋 (이전 스크롤 위치 유지 방지)
  const dateKey = date.valueOf();
  useEffect(() => {
    if (stickyTop != null) {
      // 모바일: 페이지 스크롤 — 목록 상단이 sticky 헤더 위치에 오도록 (아래로는 안 끌어내림)
      const el = rootRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - stickyTop;
      if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) });
    } else if (ulRef.current) {
      // 데스크탑: 내부 스크롤 리셋
      ulRef.current.scrollTop = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  return (
    <div
      ref={rootRef}
      className="border-neutral-80 rounded-xs flex min-h-[260px] w-full flex-col md:min-h-0 md:w-[312px] md:border"
    >
      <div
        className={clsx(
          'border-neutral-80 flex items-center justify-between px-0 py-2 md:border-b md:px-4 md:pb-3 md:pt-4',
          stickyTop != null && 'sticky z-10 bg-white',
        )}
        style={stickyTop != null ? { top: stickyTop } : undefined}
      >
        <span className="text-small18 text-neutral-0 font-bold">
          {date.format('M월 D일')} 프로그램
        </span>
        <span className="text-small18 text-primary font-medium">
          {events.length}개
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40 py-16 text-center">
          해당 일자에 일정이 없습니다.
        </p>
      ) : (
        <ul
          ref={ulRef}
          className="custom-scrollbar flex flex-col px-0 md:h-[480px] md:overflow-y-auto md:px-4"
        >
          {events.map((ev) => {
            // 챌린지: 참여(challengeApplicationId 있음) 여부로 상세↔대시보드 분기
            const enrolled = ev.challengeApplicationId != null;
            const detailHref =
              ev.programId != null
                ? `/program/challenge/${ev.programId}`
                : undefined;
            const dashboardHref =
              enrolled && ev.programId != null
                ? `/challenge/${ev.challengeApplicationId}/${ev.programId}`
                : undefined;
            const showChevron = ev.type === 'CHALLENGE' && detailHref != null;
            const isJoinEvent =
              ev.type === 'GUERRILLA' || ev.type === 'MILESTONE';
            const now = dayjs();
            const joinOpen =
              isJoinEvent &&
              !now.isBefore(dayjs(ev.startDate).subtract(10, 'minute')) &&
              (!ev.endDate || !now.isAfter(dayjs(ev.endDate)));

            const onChevron = () => {
              if (detailHref) router.push(detailHref);
            };

            return (
              <li
                key={ev.id}
                className="border-neutral-80 flex flex-col gap-3 border-b px-4 py-5 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {ev.status && (
                    <span
                      className={clsx(
                        'text-xxsmall12 rounded-[3px] px-2 py-1 font-medium',
                        STATUS_BADGE[ev.status],
                      )}
                    >
                      {STATUS_LABEL[ev.status]}
                    </span>
                  )}
                  <span className="text-xxsmall12 text-neutral-40">
                    {TYPE_LABEL[ev.type]}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xsmall16 text-neutral-0 truncate font-bold">
                    {ev.title}
                  </span>
                  {showChevron && (
                    <button
                      type="button"
                      aria-label="상세 보기"
                      className="shrink-0"
                      onClick={onChevron}
                    >
                      <ChevronRight size={20} className="text-neutral-30" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {ev.description && (
                    <p className="text-xxsmall12 text-neutral-30 line-clamp-2 font-normal">
                      {ev.description}
                    </p>
                  )}

                  <p className="text-xxsmall12 text-neutral-40 flex gap-1 tracking-tight">
                    {ev.type === 'GUERRILLA' || ev.type === 'MILESTONE' ? (
                      <>
                        <span>일시</span>
                        <span>
                          {dayjs(ev.startDate).format('YY.MM.DD HH:mm')}
                          {ev.endDate &&
                            (dayjs(ev.endDate).isSame(
                              dayjs(ev.startDate),
                              'day',
                            )
                              ? ` ~ ${dayjs(ev.endDate).format('HH:mm')}`
                              : ` ~ ${dayjs(ev.endDate).format('YY.MM.DD HH:mm')}`)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>진행기간</span>
                        <span>
                          {dayjs(ev.startDate).format('YY.MM.DD')}
                          {ev.endDate
                            ? ` ~ ${dayjs(ev.endDate).format('YY.MM.DD')}`
                            : ''}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {ev.type === 'CHALLENGE' && (
                  <SolidButton
                    size="sm"
                    className="text-xsmall14 w-full"
                    onClick={() => {
                      const href = enrolled ? dashboardHref : detailHref;
                      if (href) router.push(href);
                    }}
                  >
                    {enrolled ? '대시보드 입장' : '참여하기'}
                  </SolidButton>
                )}
                {isJoinEvent && ev.url && (
                  <SolidButton
                    size="sm"
                    disabled={!joinOpen}
                    onClick={() =>
                      window.open(ev.url!, '_blank', 'noopener,noreferrer')
                    }
                    className="text-xsmall14 w-full"
                  >
                    참여하기
                  </SolidButton>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
