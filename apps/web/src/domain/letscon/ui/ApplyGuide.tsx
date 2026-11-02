import { ArrowUpRight } from 'lucide-react';
import { LETSCON_SECTION_IDS } from '../data/sections';
import {
  LETSCON_DAY14_SESSIONS,
  LETSCON_DAY15_SESSIONS,
  type LetsconSession,
} from '../data/sessions';
import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';

const DAYS: {
  date: string;
  day: string;
  title: string;
  body: string;
  sessions: LetsconSession[];
}[] = [
  {
    date: '11/14',
    day: '토',
    title: '온라인 참여만 가능',
    body: '생중계로 참여합니다',
    sessions: LETSCON_DAY14_SESSIONS,
  },
  {
    date: '11/15',
    day: '일',
    title: '온라인 · 오프라인 병행',
    body: '둘 중 원하는 방식을 선택할 수 있어요',
    sessions: LETSCON_DAY15_SESSIONS,
  },
];

export function ApplyGuide({ apply }: { apply: LetsconApply }) {
  const isAvailable = apply.status === 'available';

  return (
    <div
      data-reveal
      className="mt-8 rounded-[16px] border border-[#e8e9f3] bg-white p-5 md:mt-7 md:p-7"
    >
      <h3 className="text-xl font-extrabold tracking-[-0.01em] text-[#1c1e2b]">
        참여 방식 안내
      </h3>
      <p className="mt-1 text-xs text-[#7f8290] md:text-[13px]">
        신청 창에서 참여 방식을 선택하실 수 있어요.
      </p>

      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {DAYS.map(({ date, day, title, body, sessions }) => (
          <li key={date} className="rounded-[12px] border border-[#e8e9f3] p-4">
            <p className="text-primary text-lg font-extrabold leading-none">
              {date}
              <span className="ml-1 text-xs font-semibold text-[#7f8290]">
                ({day})
              </span>
            </p>
            <p className="mt-3 text-[15px] font-bold text-[#1c1e2b]">{title}</p>
            <p className="mt-0.5 text-xs text-[#7f8290]">{body}</p>
            <ul className="mt-3 grid gap-1.5 border-t border-dashed border-[#e1e3ee] pt-3">
              {sessions.map(({ id, time, title: sessionTitle, mentor }) => (
                <li key={id} className="text-[13px] leading-5 text-[#1c1e2b]">
                  <span className="text-primary mr-2 whitespace-nowrap font-bold">
                    {time}
                  </span>
                  <span className="inline-block">
                    {sessionTitle} · {mentor}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="bg-primary-5 border-primary-20 mt-3 flex items-start justify-between gap-3 rounded-[12px] border p-4">
        <div>
          <p className="text-[15px] font-bold text-[#1c1e2b]">
            오프라인으로 오시면 특별 혜택이 있어요
          </p>
          <p className="mt-1 text-xs leading-5 text-[#5b5e6d]">
            무료 서류 Live 피드백 · 1:1 멘토링 50% 쿠폰 2장 · 렛츠콘 자료집 ·
            현장 질문 우선{' '}
            <a
              href={`#${LETSCON_SECTION_IDS.offlineBenefit}`}
              className="text-primary whitespace-nowrap font-bold underline underline-offset-2"
            >
              혜택 자세히 보기
            </a>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#ffe566] px-2 py-1 text-[11px] font-bold leading-none text-[#1c1e2b]">
          선착순 60명
        </span>
      </div>

      <div className="mt-5 border-t border-[#ededf3] pt-5">
        <p className="text-base font-bold leading-[1.45] text-[#1c1e2b]">
          참가비 무료 · 오프라인 참여 시 보증금 15,000원
        </p>
        <p className="mt-1.5 text-xs leading-[1.4] tracking-[-0.02em] text-[#7f8290]">
          원하는 세션만 자유롭게 들으셔도 됩니다. 오프라인은 선착순 60명으로,
          노쇼 방지를 위해 보증금을 받습니다. 현장에 참석하시면 전액
          돌려드립니다.
        </p>
      </div>

      <button
        data-lift
        type="button"
        disabled={!isAvailable}
        onClick={apply.openSheet}
        className="bg-primary hover:bg-primary-hover mt-5 flex h-[64px] w-full items-center justify-between rounded-[12px] px-7 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {getApplyButtonLabel(apply.status, '렛츠콘 신청하기')}
        {isAvailable ? <ArrowUpRight aria-hidden className="h-6 w-6" /> : null}
      </button>
    </div>
  );
}
