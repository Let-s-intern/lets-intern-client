'use client';

import SolidButton from '@/common/button/SolidButton';
import {
  CHALLENGE_ITEMS,
  getChallengeThumbnailSrc,
} from '@/domain/membership/data/challengeModalItems';
import { useChallengeThumbnails } from '@/domain/membership/lib/useChallengeThumbnails';
import { useGuidebookThumbnails } from '@/domain/membership/lib/useGuidebookThumbnails';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CHALLENGE_PRICES, GUIDEBOOK_COMPARE_ITEMS } from './compareCatalog';

export type CompareTab = 'challenge' | 'guidebook';

interface CompareProgram {
  key: string;
  title: string;
  thumbnail: string;
  price: number;
}

interface Props {
  passPrice: number;
  /** 비교 노출 탭(최저가 플랜 권한 ∩ [챌린지,가이드북]) */
  tabs: CompareTab[];
  onClose: () => void;
  /** "선택한 구성으로 비교하기" — 개별 합계를 가격 섹션에 찍고 모달을 닫는다 */
  onCompare: (individualTotal: number) => void;
}

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
const TAB_LABEL: Record<CompareTab, string> = {
  challenge: '챌린지',
  guidebook: '가이드북',
};

/** "프로그램 골라 비교하기" 모달 — 개별 구매 합계 vs 패스 가격. 선택은 비교 전용. */
export default function CompareModal({
  passPrice,
  tabs,
  onClose,
  onCompare,
}: Props) {
  const challengeThumbs = useChallengeThumbnails();
  const guidebookThumbs = useGuidebookThumbnails();

  const challengePrograms: CompareProgram[] = CHALLENGE_ITEMS.map((item) => ({
    key: `c-${item.challengeType}`,
    title: item.label,
    thumbnail: getChallengeThumbnailSrc(
      item,
      challengeThumbs[item.challengeType],
    ),
    price: CHALLENGE_PRICES[item.challengeType] ?? 0,
  }));
  const guidebookPrograms: CompareProgram[] = GUIDEBOOK_COMPARE_ITEMS.map(
    (item) => ({
      key: `g-${item.id}`,
      title: item.title,
      thumbnail:
        guidebookThumbs[item.id] ||
        (item.src ? `/images/membership/${item.src}` : ''),
      price: item.price,
    }),
  );
  const programsByTab: Record<CompareTab, CompareProgram[]> = {
    challenge: challengePrograms,
    guidebook: guidebookPrograms,
  };
  const allPrograms = [...challengePrograms, ...guidebookPrograms];

  const [active, setActive] = useState<CompareTab>(tabs[0] ?? 'challenge');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const toggle = (key: string) =>
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const selected = allPrograms.filter((p) => selectedKeys.includes(p.key));
  const individualTotal = selected.reduce((s, p) => s + p.price, 0);
  const diff = individualTotal - passPrice; // >0 = 패스가 저렴, <0 = 개별이 저렴

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-[1024px] flex-col overflow-hidden rounded-[20px] bg-white p-5 md:rounded-[28px] md:p-[30px]">
        {/* 헤더 — 상단 full-width */}
        <div className="border-neutral-80 relative shrink-0 gap-2 border-b pb-3 md:gap-4 md:pb-5">
          <h3 className="text-xsmall16 md:text-medium24 text-neutral-0 font-bold">
            어떤 프로그램을 이용을 고민하고 계신가요?
          </h3>
          <p className="text-xxsmall12 md:text-small18 text-neutral-40 mt-1 md:mt-2">
            필요한 프로그램들을 골라 개별 구매와 패스 가격을 비교해 보세요.
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-neutral-40 hover:text-neutral-20 absolute right-1 top-1 md:right-7 md:top-6"
          >
            <X className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        </div>

        {/* 본문 — 좌(선택·스크롤) / 우(합계). 모바일은 세로: 프로그램 스크롤 + 합계 하단 고정 */}
        <div className="flex min-h-0 flex-1 flex-col pt-3 md:flex-row md:gap-4 md:pt-6">
          {/* 좌: 프로그램 선택 */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-5">
            {/* 탭 */}
            <div className="flex gap-2 md:gap-3">
              {tabs.map((t) => {
                const isActive = t === active;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActive(t)}
                    className={clsx(
                      'text-xxsmall12 md:text-small18 md:rounded-xs rounded-sm border px-3 py-1.5 font-medium transition md:px-5 md:py-2.5',
                      isActive
                        ? 'border-neutral-0 bg-neutral-0 text-white'
                        : 'text-neutral-35 border-neutral-80 hover:border-neutral-60 bg-white',
                    )}
                  >
                    {TAB_LABEL[t]}{' '}
                    <span
                      className={isActive ? 'text-white/60' : 'text-neutral-50'}
                    >
                      {programsByTab[t].length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 카드 그리드 — 모바일·데스크탑 모두 내부 스크롤 */}
            <div className="custom-scrollbar mb-5 grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto pr-1 md:mb-0 md:grid-cols-3 md:gap-3">
              {programsByTab[active].map((p) => {
                const checked = selectedKeys.includes(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => toggle(p.key)}
                    className={clsx(
                      'flex h-full flex-col gap-2.5 rounded-md border p-2.5 text-left transition md:gap-3 md:rounded-lg md:p-4',
                      checked
                        ? 'border-[#4A76FF] bg-[#F4F7FF]'
                        : 'border-neutral-80 hover:border-neutral-70 bg-white',
                    )}
                  >
                    <div className="relative">
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          alt=""
                          loading="lazy"
                          className="rounded-ms w-full"
                        />
                      ) : (
                        <div className="rounded-ms bg-neutral-95 aspect-[4/3] w-full" />
                      )}
                      <span
                        className={clsx(
                          'absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full transition md:right-2.5 md:top-2.5 md:h-5 md:w-5',
                          checked
                            ? 'bg-primary text-white'
                            : 'bg-white/85 shadow-sm',
                        )}
                      >
                        {checked && <Check size={12} strokeWidth={3} />}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-2.5 md:gap-3">
                      <p className="text-xsmall14 md:text-xsmall16 text-neutral-0 line-clamp-2 font-semibold">
                        {p.title}
                      </p>
                      <p className="text-xsmall14 text-neutral-40 text-right font-medium">
                        현재 할인가{' '}
                        <b className="text-neutral-0 font-semibold">
                          {won(p.price)}
                        </b>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우: 합계·비교 */}
          <aside className="-mb-5 -ml-5 flex w-[calc(100%+2.5rem)] shrink-0 flex-col gap-4 bg-[#F8F9FD] px-5 pb-5 pt-4 md:mb-0 md:ml-0 md:w-[308px] md:gap-5 md:overflow-y-auto md:rounded-none md:px-5 md:py-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <p className="text-xsmall16 md:text-small18 text-neutral-0 font-bold">
                선택한 프로그램 {selected.length}개
              </p>

              {/* 선택 목록 — 높이 고정(모바일 3칸 / 데스크탑 5칸), 비어 있어도 유지, 초과 시 스크롤 */}
              <ul className="custom-scrollbar divide-neutral-90 flex h-[84px] flex-col divide-y overflow-y-auto pr-0.5 md:h-[204px]">
                {selected.length === 0 ? (
                  <li className="text-xsmall14 text-neutral-40 py-1.5 md:py-3">
                    프로그램을 선택해 주세요.
                  </li>
                ) : (
                  selected.map((p) => (
                    <li
                      key={p.key}
                      className="flex items-center justify-between py-1.5 md:py-2"
                    >
                      <span className="text-xsmall14 md:text-xsmall16 line-clamp-1 text-[#909CB0]">
                        {p.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(p.key)}
                        aria-label="제거"
                        className="hover:text-neutral-40 shrink-0 text-[#909CB0]"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            {/* 합계·결과 — 모바일은 높이 부족으로 숨김(비교는 버튼으로 가격 섹션에 반영) */}
            <div className="hidden flex-col gap-4 md:flex md:gap-5">
              <div className="border-neutral-80 flex items-center justify-between border-t pt-5">
                <span className="text-xsmall14 md:text-xsmall16 text-[#909CB0]">
                  개별 구매 합계
                </span>
                <span className="text-small18 text-neutral-0 font-bold">
                  {won(individualTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#E5EAF7] pt-5">
                <span className="text-xsmall14 md:text-xsmall16 text-[#909CB0]">
                  패스 구매 가격
                </span>
                <strong className="text-small18 text-primary font-bold">
                  {won(passPrice)}
                </strong>
              </div>

              {/* 결과 안내 — 선택할 때마다 실시간 갱신 */}
              {selected.length > 0 && (
                <div>
                  <div className="rounded-ms mt-5 flex flex-col gap-2 bg-white px-5 pb-4 pt-6">
                    <p className="text-small18 font-semibold text-[#5965EF]">
                      {diff > 0
                        ? `패스 구매가 ${won(diff)} 더 저렴해요`
                        : diff < 0
                          ? `개별 구매가 ${won(-diff)} 더 저렴해요`
                          : '개별 구매와 패스 가격이 같아요'}
                    </p>
                    <p className="text-xsmall14 text-neutral-40">
                      {diff > 0
                        ? '지금 선택한 프로그램들을 이용한다면 패스 구매를 고려해 보세요.'
                        : '지금 선택한 프로그램만 이용한다면 개별 구매를 고려해 보세요.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <SolidButton
              type="button"
              disabled={selected.length === 0}
              onClick={() => onCompare(individualTotal)}
              size="lg"
              className="rounded-ms text-small16 mt-auto bg-[#FF7541] font-semibold text-white transition hover:bg-[#F36D32] disabled:bg-[#FF7541] disabled:opacity-40 md:py-3.5"
            >
              선택한 구성으로 비교하기
            </SolidButton>
            <p className="text-xxsmall12 text-neutral-45 font-light">
              *선택은 가격 비교에만 사용됩니다. 이 화면에서 개별 프로그램 구매나
              신청이 진행되지는 않아요.
            </p>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
