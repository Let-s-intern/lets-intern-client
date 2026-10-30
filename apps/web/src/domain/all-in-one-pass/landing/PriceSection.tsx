'use client';

import SolidButton from '@/common/button/SolidButton';
import clsx from 'clsx';
import { useState } from 'react';
import type { AllInOnePassPlan } from '../types';
import CompareModal from './CompareModal';
import LandingSectionHeader from './LandingSectionHeader';
import { usePassPricing } from './usePassPricing';

interface Props {
  passTitle: string;
  plans: AllInOnePassPlan[];
  periodDays: number | null;
  /** '패스 전용 특별 혜택' 칩 (외부링크명) */
  specialBenefitTitles: string[];
  ctaText: string;
  ctaDisabled: boolean;
  onStart: () => void;
}

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;

/** 가격 섹션(#price) — 최저가 플랜 기준 패스 카드 + 프로그램 비교 모달. */
export default function PriceSection({
  passTitle,
  plans,
  periodDays,
  specialBenefitTitles,
  ctaText,
  ctaDisabled,
  onStart,
}: Props) {
  const [compareOpen, setCompareOpen] = useState(false);
  // 비교 모달에서 "선택한 구성으로 비교하기" 로 찍힌 개별 구매 합계
  const [comparedTotal, setComparedTotal] = useState(0);

  const { passPrice, contentRows, compareTabs } = usePassPricing(plans);

  return (
    <section id="price" className="scroll-mt-20 bg-[#F4F5F9]">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-5 py-12 md:gap-[60px] md:px-0 md:py-[100px]">
        <LandingSectionHeader
          header="가격"
          mainHeader="취준 비용, 하나씩 더하지 마세요"
          subHeader={`자소서·포폴부터 인적성·면접까지.\n각각 준비하며 드는 비용, ${passTitle}로 줄여보세요.`}
        />
        <div className="flex flex-col overflow-hidden rounded-[22px] bg-white">
          <div className="border-neutral-80 border-b p-5 md:px-[30px] md:py-6">
            <strong className="text-small20 text-neutral-0 font-bold">
              {passTitle}
            </strong>
          </div>

          <div className="border-neutral-80 flex flex-col gap-4 border-b p-5 md:flex-row md:items-start md:justify-between md:gap-5 md:px-[30px] md:py-6">
            <div className="flex flex-col gap-4 md:gap-2.5">
              <p className="text-xsmall14 text-neutral-45">패스 구매 가격</p>
              <p className="text-neutral-0 md:leading[48px] flex items-end gap-0.5 text-[40px] font-bold leading-[40px] md:text-[48px]">
                {passPrice}
                <span className="text-medium24 md:text-xlarge28 leading-6 md:leading-7">
                  원
                </span>
              </p>
              {periodDays != null && (
                <p className="text-xsmall14 text-neutral-45 flex items-center gap-2.5">
                  <span className="text-neutral-45 rounded-xxs bg-[#F3F4F6] px-2 py-1">
                    이용 기간
                  </span>
                  구매일로부터 {periodDays}일
                </p>
              )}
            </div>
            <div className="flex flex-col items-start justify-between gap-4 md:items-end md:gap-2.5 md:self-stretch">
              <div className="flex-fow flex w-full justify-between gap-1 md:flex-col">
                <p className="text-xsmall14 text-neutral-45">
                  선택한 프로그램을 따로 구매하면
                </p>
                <p className="text-xsmall16 text-neutral-45 text-right font-bold line-through">
                  {won(comparedTotal)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="text-xsmall14 w-full rounded-sm border border-[#F36D32] px-3 py-2 font-semibold text-[#F36D32] transition hover:bg-[#4A76FF0f]"
              >
                프로그램 골라 비교하기
              </button>
            </div>
          </div>

          {contentRows.length > 0 && (
            <div className="border-neutral-80 flex flex-col gap-4 border-b p-5 md:px-[30px] md:py-6">
              <p className="text-xsmall14 text-neutral-45">
                패스에 포함된 콘텐츠
              </p>
              <ul className="flex flex-col gap-4">
                {contentRows.map((row) => (
                  <li
                    key={row.label}
                    className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4"
                  >
                    <span className="text-xsmall16 flex items-center gap-2">
                      <img
                        src="/icons/check-circle-bg.svg"
                        alt=""
                        className="mt-0.5 shrink-0 md:mt-0"
                      />
                      {row.extra ? `(추가 구매) ${row.label}` : row.label}
                    </span>
                    {row.note && (
                      <span className="text-xxsmall12 text-neutral-45 pl-[26px] md:shrink-0 md:pl-0 md:text-right">
                        {row.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-neutral-80 flex flex-col gap-4 border-b p-5 md:px-[30px] md:py-6">
            <p className="text-xsmall14 text-neutral-45">멘토링 할인 혜택</p>
            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-4">
              <span className="text-xsmall16 flex items-center gap-2">
                <img
                  src="/icons/check-circle-bg.svg"
                  alt=""
                  className="mt-0.5 shrink-0 md:mt-0"
                />
                1:1 커피챗·멘토링 할인 쿠폰
              </span>
              <span className="text-xxsmall12 text-neutral-45 pl-[26px] md:shrink-0 md:pl-0 md:text-right">
                멘토링 신청 시 적용
              </span>
            </div>
            <p className="text-xxsmall12 text-neutral-45 md:shrink-0 md:text-[13px]">
              멘토링 이용료는 별도이며, 결제 시 쿠폰 할인이 적용됩니다.
            </p>
          </div>

          {specialBenefitTitles.length > 0 && (
            <div className="border-neutral-80 flex flex-col gap-4 border-b p-5 md:px-[30px] md:py-6">
              <p className="text-xsmall14 text-neutral-45">
                패스 전용 특별 혜택
              </p>
              <div className="flex flex-wrap gap-2">
                {specialBenefitTitles.map((title) => (
                  <span
                    key={title}
                    className="text-xsmall14 text-neutral-20 rounded-full bg-[#F3F4F6] px-4 py-2 font-medium"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-5 md:px-[30px] md:py-6">
            <SolidButton
              size="xl"
              onClick={onStart}
              disabled={ctaDisabled}
              className={clsx(
                'text-xsmall16 md:text-small18 w-full rounded-sm font-semibold',
                ctaDisabled
                  ? 'cursor-not-allowed bg-[#F9B68F]'
                  : 'bg-[#F36D32] hover:bg-[#E15D28]',
              )}
            >
              {ctaText} →
            </SolidButton>
          </div>
        </div>
      </div>

      {compareOpen && (
        <CompareModal
          passPrice={passPrice}
          tabs={compareTabs}
          onClose={() => setCompareOpen(false)}
          onCompare={(total) => {
            setComparedTotal(total);
            setCompareOpen(false);
          }}
        />
      )}
    </section>
  );
}
