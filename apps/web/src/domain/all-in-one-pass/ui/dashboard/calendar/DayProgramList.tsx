import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import { ChevronRight } from 'lucide-react';
import type { PassCalendarEvent } from '../../../types';

type Day = ReturnType<typeof dayjs>;

const TYPE_LABEL: Record<string, string> = {
  CHALLENGE: '챌린지',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  LIVE: '무료 세미나',
  LIVE_MENTORING: '멘토링',
};

interface Props {
  date: Day;
  events: PassCalendarEvent[];
}

/** U-1 캘린더 우측 패널 — 선택일의 프로그램/일정 목록 (내부 스크롤) */
export default function DayProgramList({ date, events }: Props) {
  return (
    <div className="border-neutral-80 rounded-xs flex w-full flex-col border md:w-[312px]">
      <div className="border-neutral-80 flex items-center justify-between border-b px-4 pb-3 pt-4">
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
        <ul className="custom-scrollbar flex max-h-[480px] flex-col overflow-y-auto px-4">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="border-neutral-80 flex flex-col gap-3 border-b px-4 py-5 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                {ev.status && (
                  <span
                    className={
                      ev.status === 'IN_PROGRESS'
                        ? 'bg-primary-10 text-primary text-xxsmall12 rounded-[3px] px-2 py-1 font-medium'
                        : 'border-neutral-80 text-primary text-xxsmall12 rounded-[3px] border px-2 py-1 font-medium'
                    }
                  >
                    {ev.status === 'IN_PROGRESS' ? '참여 중' : '참여 전'}
                  </span>
                )}
                <span className="text-xxsmall12 text-neutral-40">
                  {ev.programType ? TYPE_LABEL[ev.programType] : '일정'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xsmall16 text-neutral-0 truncate font-bold">
                  {ev.title}
                </span>
                <ChevronRight size={20} className="text-neutral-30 shrink-0" />
              </div>
              <div className="flex flex-col gap-1">
                {ev.description && (
                  <p className="text-xxsmall12 text-neutral-30 line-clamp-2 font-normal">
                    {ev.description}
                  </p>
                )}

                <p className="text-xxsmall12 text-neutral-40 flex gap-1 tracking-tight">
                  <span>진행기간</span>
                  <span>
                    {dayjs(ev.startDate).format('YY.MM.DD')}
                    {ev.endDate
                      ? ` ~ ${dayjs(ev.endDate).format('YY.MM.DD')}`
                      : ''}
                  </span>
                </p>
              </div>
              {ev.type === 'CHALLENGE' && (
                <SolidButton size="sm" className="text-xsmall14 w-full">
                  참여하기
                </SolidButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
