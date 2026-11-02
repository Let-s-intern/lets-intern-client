'use client';

import ModalPortal from '@/common/ModalPortal';
import { X } from 'lucide-react';
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
    <label className="flex cursor-pointer items-center gap-3 border-t border-dashed border-[#e1e3ee] py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-primary size-5 shrink-0"
      />
      <span className={checked ? 'text-[#1c1e2b]' : 'text-[#a0a3b1]'}>
        <span
          className={`block text-xs font-bold ${checked ? 'text-primary' : ''}`}
        >
          {session.time}
        </span>
        <span className="block text-sm font-bold leading-[1.35]">
          {session.title}
          <span className="ml-1.5 text-xs font-medium">{session.mentor}</span>
        </span>
      </span>
    </label>
  );
}

function getSubmitLabel(count: number, selection: LetsconSelection) {
  if (count === 0) return '세션을 선택해 주세요';
  return selection.mode === 'offline'
    ? '15,000원 결제하고 신청하기'
    : '무료로 신청하기';
}

function getNote(count: number, selection: LetsconSelection) {
  if (selection.mode === 'offline') {
    return '오프라인 보증금 15,000원은 참석 시 전액 환급됩니다.';
  }
  return count > 0
    ? '온라인 참여는 무료입니다.'
    : '참여할 세션을 하나 이상 선택해 주세요.';
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
        className="fixed inset-0 z-[100] flex items-end justify-center bg-[#12143a]/60 backdrop-blur-[2px] min-[600px]:items-center"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="letscon-apply-title"
          className="flex max-h-[92dvh] w-full max-w-[520px] flex-col break-keep rounded-t-[22px] bg-white px-[22px] pb-[max(20px,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-10px_40px_rgba(0,0,0,0.25)] min-[600px]:max-h-[88dvh] min-[600px]:rounded-[22px]"
        >
          <div
            aria-hidden
            className="mx-auto mb-4 mt-1 h-1 w-10 rounded-full bg-[#e1e3ee] min-[600px]:hidden"
          />
          <header className="mb-1 flex items-center justify-between gap-3">
            <h3
              id="letscon-apply-title"
              className="text-xl font-bold text-[#1c1e2b]"
            >
              렛츠콘 신청
            </h3>
            <button
              type="button"
              aria-label="닫기"
              onClick={closeSheet}
              className="-mr-2 flex size-9 items-center justify-center rounded-full text-[#5b5e6d] hover:bg-[#f4f5fa]"
            >
              <X aria-hidden className="size-5" />
            </button>
          </header>

          {apply.isCompleted ? (
            <div className="py-6">
              <p className="text-lg font-bold text-[#1c1e2b]">
                온라인 신청이 완료됐어요
              </p>
              <p className="mt-2 text-sm leading-[1.6] text-[#5b5e6d]">
                생중계 링크는 행사 당일 안내해 드릴게요. 현장 참여는 마감 전까지
                이 창에서 추가로 신청할 수 있어요.
              </p>
              <button
                type="button"
                onClick={closeSheet}
                className="bg-primary hover:bg-primary-hover mt-6 h-[56px] w-full rounded-[12px] text-base font-semibold text-white"
              >
                확인
              </button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-[13px] leading-[1.5] text-[#5b5e6d]">
                참여할 세션을 선택해 주세요. 11/15 오프라인은 두 세션을 함께
                신청합니다.
              </p>

              <div className="grid min-h-0 gap-2.5 overflow-y-auto overscroll-contain">
                <section className="rounded-[14px] border-[1.5px] border-[#e1e3ee] px-4 pb-1.5 pt-3.5">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold text-[#1c1e2b]">
                      11/14
                      <span className="ml-1 text-xs font-semibold text-[#7f8290]">
                        토요일
                      </span>
                    </h4>
                    <span className="rounded-md bg-[#e6faf6] px-2 py-1 text-[11px] font-bold text-[#1d8a77]">
                      온라인 · 무료 · 세션별 선택
                    </span>
                  </div>
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
                </section>

                <section className="rounded-[14px] border-[1.5px] border-[#e1e3ee] px-4 pb-1.5 pt-3.5">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold text-[#1c1e2b]">
                      11/15
                      <span className="ml-1 text-xs font-semibold text-[#7f8290]">
                        일요일
                      </span>
                    </h4>
                    <fieldset className="flex gap-0.5 rounded-lg bg-[#f4f5fa] p-[3px]">
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
                              className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-md disabled:cursor-not-allowed"
                            />
                            <span className="peer-checked:text-primary peer-focus-visible:ring-primary-40 pointer-events-none block rounded-md px-3 py-1.5 text-xs font-semibold text-[#7f8290] peer-checked:bg-white peer-checked:font-extrabold peer-checked:shadow-[0_1px_4px_rgba(0,0,0,0.08)] peer-focus-visible:ring-2 peer-disabled:text-[#c3c5d1]">
                              {label}
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                  </div>

                  {isOffline ? (
                    <div className="border-t border-dashed border-[#e1e3ee] py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[15px] font-extrabold text-[#1c1e2b]">
                          오프라인 참여
                        </p>
                        <span className="rounded-md bg-[#ffe566] px-2 py-1 text-[11px] font-bold text-[#11142b]">
                          현장 · 선착순 60명
                        </span>
                      </div>
                      <ul className="mt-2 grid gap-1">
                        {LETSCON_DAY15_SESSIONS.map(
                          ({ id, time, title, mentor }) => (
                            <li
                              key={id}
                              className="text-[13px] leading-5 text-[#5b5e6d]"
                            >
                              <span className="text-primary mr-2 whitespace-nowrap text-xs font-bold">
                                {time}
                              </span>
                              {title} · {mentor}
                            </li>
                          ),
                        )}
                      </ul>
                      <p className="text-primary mt-2.5 text-xs font-semibold leading-[1.5]">
                        오프라인 선택 시 두 세션 모두 참여해야 합니다 · 무료
                        서류 Live 피드백 등 특별 혜택 제공
                      </p>
                    </div>
                  ) : (
                    <>
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
                      <p className="pb-2 text-xs text-[#a0a3b1]">
                        {isOfflineAvailable
                          ? '온라인은 원하는 세션만 골라 들을 수 있어요'
                          : '오프라인 신청이 마감되어 온라인으로 신청할 수 있어요'}
                      </p>
                    </>
                  )}
                </section>
              </div>

              <footer
                aria-live="polite"
                className="mt-3 shrink-0 border-t border-[#e1e3ee] pt-3.5"
              >
                {selectedDays.length > 0 ? (
                  <ul
                    aria-label="선택한 세션"
                    className="mb-3 grid gap-1 rounded-[10px] bg-[#f7f8fc] px-3 py-2.5"
                  >
                    {selectedDays.map(({ label, titles }) => (
                      <li
                        key={label}
                        className="flex gap-2.5 text-xs leading-[18px]"
                      >
                        <span className="text-primary shrink-0 font-bold">
                          {label}
                        </span>
                        <span className="text-[#1c1e2b]">
                          {titles.join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] text-[#5b5e6d]">
                    <span className="text-primary font-bold">
                      {count > 0
                        ? `${count}개 세션 선택${isOffline ? ' · 현장' : ''}`
                        : '미선택'}
                    </span>{' '}
                    · 결제 금액
                  </p>
                  <p className="whitespace-nowrap text-[22px] font-extrabold text-[#1c1e2b]">
                    {isOffline ? '15,000' : '0'}
                    <span className="text-sm font-bold">원</span>
                  </p>
                </div>
                <p
                  className={`mb-3 mt-1.5 text-xs leading-[1.5] ${
                    apply.hasSubmitError ? 'text-red-500' : 'text-[#a0a3b1]'
                  }`}
                >
                  {apply.hasSubmitError
                    ? '신청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'
                    : getNote(count, selection)}
                </p>
                <button
                  type="button"
                  disabled={count === 0 || apply.isSubmitting}
                  onClick={() => apply.submit(selection)}
                  className="bg-primary hover:bg-primary-hover h-[56px] w-full rounded-[12px] text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#d7d9e6]"
                >
                  {apply.isSubmitting
                    ? '신청 중...'
                    : getSubmitLabel(count, selection)}
                </button>
              </footer>
            </>
          )}
        </section>
      </div>
    </ModalPortal>
  );
}
