'use client';

import clsx from 'clsx';
import { useState } from 'react';
import type { PassFaq } from '../types';
import LandingSectionHeader from './LandingSectionHeader';

interface Props {
  faqs: PassFaq[];
}

/** FAQ 섹션(#faq) — 한 번에 하나만 열리는 아코디언. */
export default function FaqSection({ faqs }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-20 bg-white">
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8 px-5 py-12 md:gap-[60px] md:px-0 md:py-[100px]">
        <LandingSectionHeader
          header="FAQ"
          mainHeader="궁금한 점이 있으신가요?"
        />

        <ul className="flex flex-col gap-3">
          {faqs.map((faq) => {
            const open = openId === faq.id;
            return (
              <li
                key={faq.id}
                className="border-neutral-80 overflow-hidden rounded-lg border"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left md:px-[26px] md:py-[22px]"
                >
                  <p className="text-xsmall16 md:text-small20 text-neutral-0 flex items-center gap-2 font-semibold md:gap-4">
                    <span className="text-small20 md:text-medium24 font-bold text-[#4A76FF]">
                      Q
                    </span>
                    {faq.question}
                  </p>
                  <img
                    src="/icons/add-plus.svg"
                    alt=""
                    className={clsx(
                      'h-6 w-6 shrink-0 transition-transform duration-300',
                      open && 'rotate-45',
                    )}
                  />
                </button>
                <div
                  className={clsx(
                    'grid transition-all duration-300',
                    open
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 whitespace-pre-line px-5 pb-5">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
