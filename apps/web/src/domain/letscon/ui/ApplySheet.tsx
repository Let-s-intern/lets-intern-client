'use client';

import ModalPortal from '@/common/ModalPortal';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  LETSCON_DAY14_SESSIONS,
  LETSCON_DAY15_SESSIONS,
  type LetsconSession,
} from '../data/sessions';
import type { LetsconApply } from '../hooks/useLetsconApply';
import {
  getSelectedDays,
  getSelectedSessionCount,
  type LetsconDay15Mode,
  type LetsconSelection,
} from '../lib/applySelection';

const toIds = (sessions: LetsconSession[]) => sessions.map(({ id }) => id);

const toggle = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];

const MODES: { mode: LetsconDay15Mode; label: string }[] = [
  { mode: 'offline', label: '오프라인' },
  { mode: 'online', label: '온라인' },
];

function SessionCheckbox({
  session,
  checked,
  onChange,
}: {
  session: LetsconSession;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-[12px] border px-3 py-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4d55f5]/40 ${
        checked
          ? 'border-[#c9ccfb] bg-[#f3f4ff]'
          : 'border-[#e8e9f3] bg-white hover:border-[#c9ccfb]'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-[1.5px] transition-colors ${
          checked
            ? 'border-[#4d55f5] bg-[#4d55f5] text-white'
            : 'border-[#c9cbd8] bg-white text-transparent'
        }`}
      >
        <Check className="size-3.5" strokeWidth={3.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-bold leading-5 ${
            checked ? 'text-[#1c1e2b]' : 'text-[#7f8290]'
          }`}
        >
          {session.title}
        </span>
        <span className="block text-xs leading-[18px] text-[#7f8290]">
          {session.mentor}
        </span>
      </span>
      <span
        className={`shrink-0 text-xs font-bold tabular-nums ${
          checked ? 'text-[#4d55f5]' : 'text-[#a0a3b1]'
        }`}
      >
        {session.time}
      </span>
    </label>
  );
}

function DayHeading({ date, day }: { date: string; day: string }) {
  return (
    <h4 className="flex items-baseline gap-1.5 text-lg font-extrabold leading-6 tracking-[-0.01em] text-[#1c1e2b]">
      {date}
      <span className="text-xs font-semibold tracking-normal text-[#7f8290]">
        {day}
      </span>
    </h4>
  );
}

function getSubmitLabel(count: number, selection: LetsconSelection) {
  if (count === 0) return '세션을 선택해 주세요';
  return selection.mode === 'offline'
    ? '15,000원 결제하고 신청하기'
    : '무료로 신청하기';
}

export function ApplySheet({ apply }: { apply: LetsconApply }) {
  const isOfflineAvailable = apply.offline === 'available';
  const [selection, setSelection] = useState<LetsconSelection>({
    day14: toIds(LETSCON_DAY14_SESSIONS),
    day15: toIds(LETSCON_DAY15_SESSIONS),
    mode: isOfflineAvailable ? 'offline' : 'online',
  });
  const { closeSheet } = apply;

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSheet();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeSheet]);

  const isOffline = selection.mode === 'offline';
  const count = getSelectedSessionCount(selection);
  const selectedDays = getSelectedDays(selection);

  return (
    <ModalPortal>
      <div
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSheet();
        }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0c0e2c]/70 backdrop-blur-[3px] min-[600px]:items-center"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="letscon-apply-title"
          className="flex max-h-[94dvh] w-full max-w-[520px] flex-col overflow-hidden break-keep rounded-t-[24px] bg-[#f7f8fc] shadow-[0_-16px_48px_rgba(12,14,44,0.35)] min-[600px]:max-h-[92dvh] min-[600px]:rounded-[24px] md:max-w-[880px]"
        >
          <header className="relative shrink-0 bg-[radial-gradient(120%_180%_at_0%_0%,#25226b_0%,#141544_55%,#0f1136_100%)] px-[22px] pb-2.5 pt-2 min-[600px]:py-3">
            <div
              aria-hidden
              className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-white/30 min-[600px]:hidden"
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <p
                  aria-hidden
                  className="flex items-end text-[19px] font-black leading-none tracking-[-0.04em] text-white"
                >
                  LETS<span className="text-[#ffe066]">CON</span>
                  <span className="mb-[3px] ml-0.5 size-[5px] rounded-full bg-[#ffe066]" />
                </p>
                <span aria-hidden className="h-3.5 w-px bg-white/30" />
                <h3
                  id="letscon-apply-title"
                  className="text-base font-bold leading-7 text-white"
                >
                  렛츠콘 신청
                </h3>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={closeSheet}
                className="-mr-2 flex size-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
          </header>

          {apply.isCompleted ? (
            <div className="bg-white px-[22px] pb-[max(22px,env(safe-area-inset-bottom))] pt-7">
              <span className="flex size-11 items-center justify-center rounded-full bg-[#ffe066] text-[#141544]">
                <Check aria-hidden className="size-6" strokeWidth={3} />
              </span>
              <p className="mt-4 text-xl font-bold text-[#1c1e2b]">
                온라인 신청이 완료됐어요
              </p>
              <p className="mt-2 text-sm leading-[1.6] text-[#5b5e6d]">
                생중계 링크는 행사 당일 안내해 드릴게요. 현장 참여는 마감 전까지
                이 창에서 추가로 신청할 수 있어요.
              </p>
              <button
                type="button"
                onClick={closeSheet}
                className="mt-6 h-[56px] w-full rounded-[14px] bg-[#4d55f5] text-base font-bold text-white transition-colors hover:bg-[#3f47e0]"
              >
                확인
              </button>
            </div>
          ) : (
            <>
              <div className="grid min-h-0 flex-1 content-start gap-2.5 overflow-y-auto overscroll-contain px-3.5 py-3 md:grid-cols-2 md:gap-3 md:p-4">
                <section className="rounded-[16px] border border-[#e8e9f3] bg-white p-3">
                  <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
                    <DayHeading date="11/14" day="토요일" />
                    <span className="rounded-full bg-[#eef0ff] px-2.5 py-1 text-[11px] font-bold text-[#4d55f5]">
                      온라인 · 무료
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {LETSCON_DAY14_SESSIONS.map((session) => (
                      <SessionCheckbox
                        key={session.id}
                        session={session}
                        checked={selection.day14.includes(session.id)}
                        onChange={() =>
                          setSelection((prev) => ({
                            ...prev,
                            day14: toggle(prev.day14, session.id),
                          }))
                        }
                      />
                    ))}
                  </div>
                </section>

                <section className="rounded-[16px] border border-[#e8e9f3] bg-white p-3">
                  <div className="mb-2.5 px-0.5">
                    <DayHeading date="11/15" day="일요일" />
                  </div>
                  <fieldset className="grid grid-cols-2 gap-1 rounded-[12px] bg-[#eff0f6] p-1">
                    <legend className="sr-only">11월 15일 참여 방식</legend>
                    {MODES.map(({ mode, label }) => {
                      const disabled =
                        mode === 'offline' && !isOfflineAvailable;
                      return (
                        <label key={mode} className="relative">
                          <input
                            type="radio"
                            name="letscon-mode"
                            value={mode}
                            checked={selection.mode === mode}
                            disabled={disabled}
                            onChange={() =>
                              setSelection((prev) => ({ ...prev, mode }))
                            }
                            className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-[9px] disabled:cursor-not-allowed"
                          />
                          <span className="pointer-events-none block rounded-[9px] py-2 text-center text-sm font-semibold text-[#7f8290] transition-colors peer-checked:bg-white peer-checked:font-bold peer-checked:text-[#4d55f5] peer-checked:shadow-[0_1px_6px_rgba(20,21,68,0.12)] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4d55f5]/40 peer-disabled:text-[#c3c5d1]">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>

                  {isOffline ? (
                    <div className="mt-2.5 rounded-[14px] bg-[#141544] p-3.5 text-white">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[15px] font-bold">오프라인 참여</p>
                        <span className="rounded-full bg-[#ffe066] px-2.5 py-1 text-[11px] font-bold text-[#11142b]">
                          현장 · 선착순 60명
                        </span>
                      </div>
                      <ul className="mt-2.5 grid gap-1.5">
                        {LETSCON_DAY15_SESSIONS.map(
                          ({ id, time, title, mentor }) => (
                            <li
                              key={id}
                              className="flex gap-2.5 text-[13px] leading-5"
                            >
                              <span className="shrink-0 text-xs font-bold tabular-nums leading-5 text-[#ffe066]">
                                {time}
                              </span>
                              <span className="text-white/90">
                                {title} · {mentor}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                      <p className="mt-2.5 border-t border-white/15 pt-2.5 text-xs leading-[1.5] text-white/70">
                        두 세션 모두 참여 · 참석 시 보증금 전액 환급 · 무료 서류
                        Live 피드백 등 특별 혜택 제공
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2.5 grid gap-2">
                      {LETSCON_DAY15_SESSIONS.map((session) => (
                        <SessionCheckbox
                          key={session.id}
                          session={session}
                          checked={selection.day15.includes(session.id)}
                          onChange={() =>
                            setSelection((prev) => ({
                              ...prev,
                              day15: toggle(prev.day15, session.id),
                            }))
                          }
                        />
                      ))}
                      <p className="px-0.5 pt-0.5 text-xs text-[#7f8290]">
                        {isOfflineAvailable
                          ? '온라인은 원하는 세션만 골라 들을 수 있어요'
                          : '오프라인 신청이 마감되어 온라인으로 신청할 수 있어요'}
                      </p>
                    </div>
                  )}
                </section>
              </div>

              <footer
                aria-live="polite"
                className="shrink-0 border-t border-[#e8e9f3] bg-white px-[22px] pb-[max(14px,env(safe-area-inset-bottom))] pt-2.5 md:grid md:grid-cols-2 md:items-center md:gap-x-6 md:px-5 md:py-3.5"
              >
                {selectedDays.length > 0 ? (
                  <ul
                    aria-label="선택한 세션"
                    className="mb-1.5 grid gap-0.5 md:mb-0"
                  >
                    {selectedDays.map(({ label, titles }) => (
                      <li
                        key={label}
                        className="flex gap-2.5 text-xs leading-[18px]"
                      >
                        <span className="w-[74px] shrink-0 font-semibold text-[#7f8290]">
                          {label}
                        </span>
                        <span className="font-medium text-[#1c1e2b]">
                          {titles.join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="md:col-start-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] text-[#5b5e6d]">
                      <span className="font-bold text-[#4d55f5]">
                        {count > 0
                          ? `${count}개 세션 선택${isOffline ? ' · 현장' : ''}`
                          : '미선택'}
                      </span>{' '}
                      · 결제 금액
                    </p>
                    <p className="whitespace-nowrap text-[24px] font-extrabold leading-8 tracking-[-0.01em] text-[#1c1e2b]">
                      {isOffline ? '15,000' : '0'}
                      <span className="ml-0.5 text-sm font-bold">원</span>
                    </p>
                  </div>
                  {apply.hasSubmitError || count === 0 ? (
                    <p
                      className={`text-xs leading-[1.5] ${
                        apply.hasSubmitError ? 'text-red-500' : 'text-[#7f8290]'
                      }`}
                    >
                      {apply.hasSubmitError
                        ? '신청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'
                        : '참여할 세션을 하나 이상 선택해 주세요.'}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={count === 0 || apply.isSubmitting}
                    onClick={() => apply.submit(selection)}
                    className="mt-2 h-[52px] w-full rounded-[14px] bg-[#4d55f5] text-base font-bold text-white transition-colors enabled:hover:bg-[#3f47e0] disabled:cursor-not-allowed disabled:bg-[#d7d9e6]"
                  >
                    {apply.isSubmitting
                      ? '신청 중...'
                      : getSubmitLabel(count, selection)}
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </ModalPortal>
  );
}
