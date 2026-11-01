'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import type { LetsconLiveKind } from '../data/live';
import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';

const OPTIONS: {
  kind: LetsconLiveKind;
  title: string;
  body: string;
  badge?: string;
}[] = [
  {
    kind: 'online',
    title: '온라인으로 편하게 들을게요',
    body: '11/14·15 온라인 참여',
  },
  {
    kind: 'offline',
    title: '15일은 현장에서 함께할게요',
    body: '11/14 온라인 참여 + 11/15 일요일 오프라인 참여',
    badge: '선착순 60명',
  },
];

export function ApplyForm({ apply }: { apply: LetsconApply }) {
  const [selected, setSelected] = useState<LetsconLiveKind>('online');
  const status = apply[selected];
  const isAvailable = status === 'available';

  return (
    <div className="rounded-[16px] border border-[#e8e9f3] bg-white p-5 md:p-6">
      <h3 className="text-xl font-extrabold tracking-[-0.01em] text-[#1c1e2b]">
        15일, 현장에도 참여하시겠어요?
      </h3>
      <p className="mt-1 text-xs text-[#7f8290] md:text-[13px]">
        온라인은 어느 쪽을 선택해도 모두 포함돼요.
      </p>

      <div className="mt-5 flex flex-col gap-3 md:gap-5">
        {OPTIONS.map(({ kind, title, body, badge }) => {
          const checked = selected === kind;
          return (
            <label
              key={kind}
              className={`flex cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-4 ${
                checked
                  ? 'border-primary bg-primary-5'
                  : 'border-[#e8e9f3] bg-white'
              }`}
            >
              <input
                type="radio"
                name="letscon-apply-kind"
                value={kind}
                checked={checked}
                onChange={() => setSelected(kind)}
                className="peer sr-only"
              />
              <span
                className={`peer-focus-visible:ring-primary-40 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[3px] peer-focus-visible:ring-2 ${
                  checked ? 'border-primary' : 'border-[#d4d4d8]'
                }`}
              >
                {checked ? (
                  <span className="bg-primary h-2.5 w-2.5 rounded-full" />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-base font-semibold leading-[1.45] text-[#1c1e2b]">
                    {title}
                  </span>
                  {badge ? (
                    <span className="shrink-0 rounded-full bg-[#ffe566] px-2 py-1 text-[11px] font-bold leading-none text-[#1c1e2b]">
                      {badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs leading-[1.45] tracking-[-0.02em] text-[#7f8290]">
                  {body}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[#ededf3] pt-5">
        <p className="text-base font-bold leading-[1.45] text-[#1c1e2b]">
          참가비 무료 · 오프라인 참여 시 보증금 15,000원
        </p>
        <p className="mt-1.5 text-xs leading-[1.4] tracking-[-0.02em] text-[#7f8290]">
          원하는 세션만 자유롭게 들으셔도 됩니다. 오프라인은 선착순 60명으로,
          <br className="hidden lg:block" /> 노쇼 방지를 위해 보증금을 받습니다.
          현장에 참석하시면 전액 돌려드립니다.
        </p>
      </div>

      <button
        type="button"
        disabled={!isAvailable}
        onClick={() => apply.apply(selected)}
        className="bg-primary hover:bg-primary-hover mt-5 flex h-[64px] w-full items-center justify-between rounded-[12px] px-7 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {getApplyButtonLabel(status, '렛츠콘 신청하기')}
        {isAvailable ? <ArrowUpRight aria-hidden className="h-6 w-6" /> : null}
      </button>
    </div>
  );
}
