'use client';

import { useState } from 'react';

import { captureBenefitModalOpened } from '../analytics';
import {
  PASS_BENEFITS_MODALS,
  PASS_INTRO,
  type PassBenefitId,
} from '../data/passBenefitModals';
import PassBenefitModal from '../ui/PassBenefitModal';
import PassBenefitModalBody from '../ui/PassBenefitModalBody';

/**
 * 개편 시안 6-0 — 패스 소개와 혜택 4카드 (`PASS_INTRO`).
 *
 * 챌린지·가이드북·VOD·멘토링 네 섹션이 여기 모달 4개로 들어왔다. 섹션 파일은 지우지
 * 않았고 데이터도 그대로 쓴다 — 목록을 모달용으로 다시 적으면 상품이 바뀔 때 두 곳이
 * 어긋난다.
 *
 * 열린 모달은 하나뿐이라 상태도 id 하나다. 모달 본문은 열렸을 때만 마운트되므로
 * 썸네일 조회도 그때 시작한다.
 */
export default function PassIntroSection() {
  const [openId, setOpenId] = useState<PassBenefitId | null>(null);
  const openEntry =
    PASS_BENEFITS_MODALS.find((entry) => entry.id === openId) ?? null;

  const handleOpen = (id: PassBenefitId) => {
    setOpenId(id);
    captureBenefitModalOpened({ benefitId: id });
  };

  return (
    <section className="bg-[#EEF0FB] py-16 md:py-24" id={PASS_INTRO.anchorId}>
      <div className="wrap rv">
        <h2 className="text-neutral-0 text-center text-xl font-bold leading-snug md:text-[1.75rem]">
          {PASS_INTRO.leadLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {PASS_INTRO.leadSub}
        </p>

        <p className="text-primary mt-16 text-center text-sm font-bold tracking-[0.2em] md:mt-24">
          {PASS_INTRO.bridge}
        </p>

        <strong className="text-neutral-0 mt-4 block text-center text-3xl font-bold leading-snug md:text-[3rem]">
          {PASS_INTRO.title}
        </strong>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-6 text-center leading-relaxed">
          {PASS_INTRO.bodyLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
          <span className="text-neutral-0 mt-1 block font-bold">
            {PASS_INTRO.bodyStrong}
          </span>
        </p>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-4 md:gap-5">
          {PASS_BENEFITS_MODALS.map((entry) => (
            <div
              className="rounded-xxl flex flex-col bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-7"
              key={entry.id}
            >
              <span
                aria-hidden="true"
                className="bg-primary-10 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              >
                {entry.icon}
              </span>

              <strong className="text-xsmall16 text-neutral-0 mt-5 block font-bold">
                {entry.cardTitle}
              </strong>

              <p className="text-xsmall14 text-neutral-40 mt-3 flex-1 leading-relaxed">
                {entry.cardBody}
              </p>

              <button
                className="text-primary text-xsmall14 mt-6 self-end font-bold"
                onClick={() => handleOpen(entry.id)}
                type="button"
              >
                {PASS_INTRO.cardCtaLabel} →
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center md:mt-14">
          <a
            className="bg-primary inline-flex rounded-full px-10 py-4"
            href={`#${PASS_INTRO.ctaAnchor}`}
          >
            {/*
              글자색은 안쪽 span 이 든다. `styles/base.css` 의
              `.membership-root a { color: inherit }` 이 명시도로 Tailwind 유틸을 이긴다.
            */}
            <span className="text-base font-bold text-white">
              {PASS_INTRO.ctaLabel}
            </span>
          </a>
        </div>
      </div>

      {openEntry && (
        <PassBenefitModal
          badge={openEntry.modal.badge}
          eyebrow={openEntry.modal.eyebrow}
          onClose={() => setOpenId(null)}
          open
          subLines={openEntry.modal.subLines}
          titleLines={openEntry.modal.titleLines}
        >
          <PassBenefitModalBody id={openEntry.id} />
        </PassBenefitModal>
      )}
    </section>
  );
}
