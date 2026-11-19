'use client';

import { useJourneyHrefMap } from '@/domain/career-journey/useJourneyHref';
import { twMerge } from '@/lib/twMerge';
import {
  Briefcase,
  Building2,
  ChevronRight,
  FileCheck2,
  Layers,
  LucideIcon,
  MessagesSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CONCERNS, ConcernAction } from './concernData';
import styles from './ConcernSection.module.css';

interface ConcernTheme {
  icon: LucideIcon;
  /** 라벨·아이콘 글자색 */
  text: string;
  /** 선택된 카드 테두리 */
  border: string;
  /** 진행 바 */
  bar: string;
  /** 패널 배경 */
  panel: string;
  /** 말꼬리. 패널 배경과 같은 색 */
  tail: string;
  /** 패널 오른쪽 아래 장식 이미지 (시안 1119) */
  illustration?: { src: string; className: string };
}

const THEME: Record<string, ConcernTheme> = {
  experience: {
    icon: Layers,
    text: 'text-[#F2683F]',
    border: 'border-[#F58A6A]',
    bar: 'bg-[#F58A6A]',
    panel: 'bg-[#FFEAE4]',
    tail: 'border-b-[#FFEAE4]',
    illustration: {
      src: '/images/home/concern/experience-box.png',
      className: 'right-10 bottom-6 w-[230px] blur-[2px]',
    },
  },
  document: {
    icon: FileCheck2,
    text: 'text-primary',
    border: 'border-primary',
    bar: 'bg-primary',
    panel: 'bg-[#F3F4FF]',
    tail: 'border-b-[#F3F4FF]',
    illustration: {
      src: '/images/home/concern/document-clipboard.png',
      className: 'right-0 bottom-0 w-[230px]',
    },
  },
  'large-corp': {
    icon: Building2,
    text: 'text-[#1DB36B]',
    border: 'border-[#1DB36B]',
    bar: 'bg-[#1DB36B]',
    panel: 'bg-[#E9F8EF]',
    tail: 'border-b-[#E9F8EF]',
    illustration: {
      src: '/images/home/concern/large-corp-folder.png',
      className: 'right-6 bottom-0 w-[220px]',
    },
  },
  interview: {
    icon: MessagesSquare,
    text: 'text-[#13B5EA]',
    border: 'border-[#13B5EA]',
    bar: 'bg-[#13B5EA]',
    panel: 'bg-[#E9F7FD]',
    tail: 'border-b-[#E9F7FD]',
    illustration: {
      src: '/images/home/concern/interview-badge.png',
      className: 'right-16 -top-4 w-[210px]',
    },
  },
  job: {
    icon: Briefcase,
    text: 'text-neutral-20',
    border: 'border-neutral-20',
    bar: 'bg-neutral-20',
    panel: 'bg-[#F2F2F4]',
    tail: 'border-b-[#F2F2F4]',
  },
};

const ActionCard = ({
  action,
  href,
}: {
  action: ConcernAction;
  href: string;
}) => (
  <li className="relative z-10 flex flex-col rounded-[16px] border border-white/80 bg-white/70 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm md:p-6">
    <h4 className="text-small18 font-bold text-neutral-0">{action.title}</h4>
    <p className="mt-3 text-xsmall14 text-neutral-20">{action.quote}</p>
    <p className="mt-1 text-xxsmall12 text-neutral-40">{action.meta}</p>
    <Link
      href={href}
      className="concern_cta mt-4 flex items-center justify-between rounded-xs border border-neutral-90 bg-white px-4 py-3 text-xsmall14 font-semibold text-[#2B2F8F] md:text-xsmall16"
      data-url={href}
      data-text={action.cta}
    >
      {action.cta}
      <ChevronRight size={20} />
    </Link>
  </li>
);

/** 자동 넘김 간격. ConcernSection.module.css 의 진행 바 시간과 맞춘다 */
const AUTO_ROTATE_MS = 4000;

const ConcernSection = () => {
  const [selectedId, setSelectedId] = useState(CONCERNS[0].id);
  // 직무 특화에서 고른 직무 칩
  const [chipIndex, setChipIndex] = useState(0);
  // 사용자가 탭을 한 번이라도 누르면 자동 넘김을 멈춘다
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // 카드 이동처: 어드민이 지정한 바로 갈 상품이 있으면 상세, 없으면 카테고리 랜딩
  const hrefMap = useJourneyHrefMap();
  const selectedIndex = CONCERNS.findIndex((c) => c.id === selectedId);
  const selected = CONCERNS[selectedIndex];
  const theme = THEME[selected.id];

  const actions = selected.chips
    ? [
        selected.actions[chipIndex] ?? selected.actions[0],
        ...(selected.fixedAction ? [selected.fixedAction] : []),
      ]
    : selected.actions;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setTimeout(() => {
      setSelectedId(CONCERNS[(selectedIndex + 1) % CONCERNS.length].id);
    }, AUTO_ROTATE_MS);
    return () => clearTimeout(timer);
  }, [isAutoPlaying, selectedIndex]);

  const handleSelect = (id: string) => {
    setIsAutoPlaying(false);
    setSelectedId(id);
  };

  const handleChip = (index: number) => {
    setIsAutoPlaying(false);
    setChipIndex(index);
  };

  return (
    // 제목은 쓰지 않는다 (검색과 고민 선택을 히어로 문구 하나로 안내). 검색창 바로 아래에 붙인다
    <section
      aria-label="취업 준비 고민 선택"
      className="mt-2 flex w-full max-w-[1120px] flex-col px-5 md:mt-4 xl:px-0"
    >
      <div
        role="tablist"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0"
      >
        {CONCERNS.map((concern) => {
          const { icon: Icon, text, border, bar } = THEME[concern.id];
          const isSelected = concern.id === selectedId;
          return (
            <button
              key={concern.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelect(concern.id)}
              className={twMerge(
                'concern_tab relative flex min-h-[168px] min-w-[160px] flex-col overflow-hidden rounded-[14px] border-2 border-neutral-90 bg-white p-4 text-left transition-colors md:min-h-[200px] md:min-w-0 md:p-5',
                isSelected && border,
              )}
              data-text={concern.label}
            >
              <span
                className={twMerge(
                  'flex items-center gap-1.5 text-xsmall14 font-medium',
                  text,
                )}
              >
                <Icon size={16} />
                {concern.label}
              </span>
              <span className="mt-5 whitespace-pre-line text-xsmall16 font-bold leading-snug text-neutral-0 md:text-small18">
                {concern.headline}
              </span>
              <span className="mt-auto pt-6 text-xxsmall12 text-neutral-30 md:text-xsmall14">
                {concern.keywords}
              </span>
              {isSelected && isAutoPlaying && (
                <span
                  aria-hidden
                  key={selectedId}
                  className={`absolute inset-x-0 bottom-0 h-1 ${bar} ${styles.progress}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className={twMerge(
          'relative mt-4 rounded-[20px] p-5 transition-colors md:mt-6 md:p-10',
          theme.panel,
        )}
      >
        {/* 선택된 고민 카드를 가리키는 말꼬리. 데스크톱 5열 그리드 기준 */}
        <span
          aria-hidden
          className={twMerge(
            'absolute -top-[14px] hidden h-0 w-0 -translate-x-1/2 border-x-[14px] border-b-[16px] border-x-transparent md:block',
            theme.tail,
          )}
          style={{ left: `${(selectedIndex * 2 + 1) * 10}%` }}
        />
        {/* 장식 이미지는 패널 밖으로 넘치지 않게 따로 자른다 */}
        {theme.illustration && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[20px] md:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={selectedId}
              src={theme.illustration.src}
              alt=""
              className={`absolute ${theme.illustration.className} ${styles.panelIn}`}
            />
          </div>
        )}
        <div
          key={selectedId}
          className={`relative z-10 flex flex-col gap-1 md:flex-row md:items-end md:justify-between ${styles.panelIn}`}
        >
          <div>
            <span
              className={twMerge('text-xsmall14 font-semibold', theme.text)}
            >
              {selected.label}
            </span>
            <h3 className="mt-1 text-small18 font-bold text-neutral-0 md:text-small20">
              {selected.panelTitle}
            </h3>
          </div>
          <p className="text-xsmall14 text-neutral-30 md:text-xsmall16">
            {selected.panelDescription}
          </p>
        </div>
        {selected.chips && (
          <div className="relative z-10 mt-5 flex gap-2 md:mt-6">
            {selected.actions.map((action, index) => (
              <button
                key={action.slug}
                type="button"
                onClick={() => handleChip(index)}
                className={twMerge(
                  'concern_chip rounded-xs bg-white px-4 py-2 text-xsmall16 font-semibold text-neutral-0 md:text-small18',
                  index === chipIndex && 'bg-[#2B2D36] text-white',
                )}
                data-text={action.title}
              >
                {action.title}
              </button>
            ))}
          </div>
        )}
        <ul
          key={`actions-${selectedId}-${chipIndex}`}
          className={`mt-5 grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-5 ${styles.panelIn}`}
        >
          {actions.map((action) => (
            <ActionCard
              key={action.slug}
              action={action}
              href={action.href ?? hrefMap[action.slug]}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ConcernSection;
