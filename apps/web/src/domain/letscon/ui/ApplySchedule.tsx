import { ChevronRight } from 'lucide-react';
import { LETSCON_SECTION_IDS } from '../data/sections';
import { revealDelay } from '../lib/reveal';

const LINEUP_HREF = `#${LETSCON_SECTION_IDS.lineup}`;
const CARD =
  'block rounded-[16px] border border-[#e8e9f3] bg-white transition-colors hover:border-primary-30';
const TAG =
  'rounded-full border border-primary-20 bg-primary-5 px-3 py-1 text-xs font-semibold text-primary';

const WEEK = [
  { day: '월', date: 9 },
  { day: '화', date: 10 },
  { day: '수', date: 11 },
  { day: '목', date: 12 },
  { day: '금', date: 13 },
  { day: '토', date: 14, className: 'bg-primary-20 font-bold text-primary' },
  { day: '일', date: 15, className: 'bg-primary font-bold text-white' },
];

const DAYS = [
  {
    date: 14,
    day: '토요일',
    tag: '온라인',
    title: '서비스 기획 / HR',
    body: ['11/14(토) 19:00 · 온라인 생중계만 진행'],
  },
  {
    date: 15,
    day: '일요일',
    tag: '온라인 + 오프라인',
    title: '마케팅 / 대기업 면접',
    body: ['11/15(일) 14:30 · 온라인 생중계', '+ 현장 참여 선택 가능'],
  },
];

export function ApplySchedule() {
  return (
    <div data-reveal-group className="flex flex-col gap-4 md:gap-3">
      <a data-reveal data-lift href={LINEUP_HREF} className={`${CARD} p-5`}>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-[#1c1e2b]">2026년 11월</p>
          <span className="bg-primary-5 text-primary rounded-full px-2.5 py-1 text-xs font-semibold">
            렛츠콘 일정
          </span>
        </div>
        <ul className="mt-2 grid grid-cols-7 text-center md:gap-x-3">
          {WEEK.map(({ day, date, className }) => (
            <li key={date}>
              <p className="text-xs leading-[2] text-[#7f8290]">{day}</p>
              <p
                className={`mt-1.5 flex h-[34px] items-center justify-center rounded-[8px] text-sm md:mt-3 ${className ?? 'text-[#3a3d4c]'}`}
              >
                {date}
              </p>
            </li>
          ))}
        </ul>
      </a>

      {DAYS.map(({ date, day, tag, title, body }, index) => (
        <a
          key={date}
          data-reveal
          data-lift
          style={revealDelay(index + 1)}
          href={LINEUP_HREF}
          className={`${CARD} flex-1 p-5 pb-6 md:py-[26px]`}
        >
          <div className="flex items-center justify-between border-b border-[#ededf3] pb-4">
            <p className="flex items-baseline gap-2">
              <span className="text-primary text-[28px] font-extrabold leading-none md:text-[36px]">
                {date}
              </span>
              <span className="text-sm font-semibold text-[#5b5e6d]">
                {day}
              </span>
            </p>
            <span className={TAG}>{tag}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-[#1c1e2b]">{title}</p>
            <ChevronRight
              aria-hidden
              className="h-6 w-6 shrink-0 text-[#3a3d4c]"
              strokeWidth={1.5}
            />
          </div>
          <p className="mt-1.5 text-sm leading-[1.5] text-[#7f8290]">
            {body.map((part) => (
              <span key={part} className="inline-block">
                {part}&nbsp;
              </span>
            ))}
          </p>
        </a>
      ))}
    </div>
  );
}
