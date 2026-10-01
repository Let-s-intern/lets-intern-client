'use client';

import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type {
  NormalizedCalendarEvent,
  PassCalendarEventType,
  PassParticipationStatus,
} from '../../../types';

type Day = ReturnType<typeof dayjs>;

/** 캘린더 유형 라벨 (프로그램 종류 아님 — 어드민 캘린더 유형) */
const TYPE_LABEL: Record<PassCalendarEventType, string> = {
  CHALLENGE: '챌린지',
  SEMINAR: '세미나',
  MILESTONE: '기타 일정',
};

const STATUS_LABEL: Record<PassParticipationStatus, string> = {
  BEFORE: '참여 전',
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
}

/** U-1 캘린더 우측 패널 — 선택일의 프로그램/일정 목록 (내부 스크롤) */
export default function DayProgramList({ date, events }: Props) {
  const router = useRouter();

  return (
    <div className="border-neutral-80 rounded-xs flex min-h-[60vh] w-full flex-col md:min-h-0 md:w-[312px] md:border">
      <div className="border-neutral-80 flex items-center justify-between px-0 py-2 md:border-b md:px-4 md:pb-3 md:pt-4">
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
        <ul className="custom-scrollbar flex max-h-[60vh] flex-col overflow-y-auto px-0 md:h-[480px] md:px-4">
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
            // 챌린지는 상세(programId) 있을 때, 마일스톤은 url 있을 때만 상세(>) 노출
            const showChevron =
              (ev.type === 'CHALLENGE' && detailHref != null) ||
              (ev.type === 'MILESTONE' && !!ev.url);
            // 세미나 참여 버튼: 시작 10분 전 ~ 종료 시각 사이에만 활성화
            const now = dayjs();
            const seminarOpen =
              ev.type === 'SEMINAR' &&
              !now.isBefore(dayjs(ev.startDate).subtract(10, 'minute')) &&
              (!ev.endDate || !now.isAfter(dayjs(ev.endDate)));

            const onChevron = () => {
              if (ev.type === 'CHALLENGE' && detailHref)
                router.push(detailHref);
              else if (ev.type === 'MILESTONE' && ev.url)
                window.open(ev.url, '_blank', 'noopener,noreferrer');
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
                    {ev.type === 'SEMINAR' || ev.type === 'MILESTONE' ? (
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
                {ev.type === 'SEMINAR' && (
                  <SolidButton
                    size="sm"
                    disabled={!seminarOpen}
                    onClick={() =>
                      ev.url &&
                      window.open(ev.url, '_blank', 'noopener,noreferrer')
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
