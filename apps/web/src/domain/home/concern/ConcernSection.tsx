'use client';

import { useJourneyHrefMap } from '@/domain/career-journey/useJourneyHref';
import { twMerge } from '@/lib/twMerge';
import {
  Briefcase,
  Building2,
  ChevronRight,
  FileText,
  Layers,
  LucideIcon,
  MessagesSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CONCERNS, ConcernAction } from './concernData';
import styles from './ConcernSection.module.css';

const TAB_STYLE: Record<string, { icon: LucideIcon; color: string }> = {
  experience: { icon: Layers, color: 'text-[#FF6B35]' },
  document: { icon: FileText, color: 'text-primary' },
  'large-corp': { icon: Building2, color: 'text-secondary' },
  interview: { icon: MessagesSquare, color: 'text-system-positive-blue' },
  job: { icon: Briefcase, color: 'text-neutral-20' },
};

const ActionLink = ({
  href,
  action,
}: {
  href: string;
  action: ConcernAction;
}) => (
  <Link
    href={href}
    className="concern_cta mt-4 flex items-center justify-between rounded-xs bg-white px-3 py-2.5 text-xsmall14 font-semibold text-primary shadow-01 md:px-4 md:text-xsmall16"
    data-url={href}
    data-text={action.cta}
  >
    {action.cta}
    <ChevronRight size={20} />
  </Link>
);

const ActionCard = ({
  action,
  href,
}: {
  action: ConcernAction;
  href: string;
}) => (
  <li className="flex flex-1 flex-col rounded-sm bg-white/70 p-4 md:p-5">
    <h4 className="text-small18 font-bold text-neutral-0">{action.title}</h4>
    <p className="mt-2 text-xsmall14 text-neutral-20">{action.quote}</p>
    <p className="mt-1 text-xxsmall12 text-neutral-45">{action.meta}</p>
    <div className="mt-auto">
      <ActionLink href={href} action={action} />
    </div>
  </li>
);

/** 자동 넘김 간격. ConcernSection.module.css 의 진행 바 시간과 맞춘다 */
const AUTO_ROTATE_MS = 4000;

const ConcernSection = () => {
  const [selectedId, setSelectedId] = useState(CONCERNS[0].id);
  // 사용자가 탭을 한 번이라도 누르면 자동 넘김을 멈춘다
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // 카드 이동처: 어드민이 지정한 바로 갈 상품이 있으면 상세, 없으면 카테고리 랜딩
  const hrefMap = useJourneyHrefMap();
  const selectedIndex = CONCERNS.findIndex((c) => c.id === selectedId);
  const selected = CONCERNS[selectedIndex];

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

  return (
    <section className="mt-16 flex w-full max-w-[1120px] flex-col px-5 md:mt-28 xl:px-0">
      <div className="text-center">
        <h2 className="text-medium24 font-bold text-neutral-0 md:text-xlarge28">
          취업 준비, 지금 <span className="text-primary">어디서</span> 막혔나요?
        </h2>
        <p className="mt-2 text-xsmall14 text-neutral-30 md:text-xsmall16">
          고민을 선택하면 지금 필요한 프로그램을 바로 찾아드릴게요.
        </p>
      </div>

      <div
        role="tablist"
        className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:mt-10 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0"
      >
        {CONCERNS.map((concern) => {
          const { icon: Icon, color } = TAB_STYLE[concern.id];
          const isSelected = concern.id === selectedId;
          return (
            <button
              key={concern.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelect(concern.id)}
              className={twMerge(
                'concern_tab relative flex min-w-[148px] flex-col overflow-hidden rounded-md border border-neutral-80 bg-white p-4 text-left transition-colors md:min-w-0 md:p-5',
                isSelected && 'border-2 border-primary',
              )}
              data-text={concern.label}
            >
              <span
                className={twMerge(
                  'flex items-center gap-1 text-xxsmall12 font-medium',
                  color,
                )}
              >
                <Icon size={14} />
                {concern.label}
              </span>
              <span className="mt-3 whitespace-pre-line text-xsmall16 font-bold text-neutral-0 md:text-small18">
                {concern.headline}
              </span>
              <span className="mt-auto pt-6 text-xxsmall12 text-neutral-40">
                {concern.keywords}
              </span>
              {isSelected && isAutoPlaying && (
                <span
                  aria-hidden
                  key={selectedId}
                  className={`absolute inset-x-0 bottom-0 h-1 bg-primary ${styles.progress}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="relative mt-4 rounded-md border border-primary-15 bg-primary-5 p-5 md:mt-6 md:p-8"
      >
        {/* 선택된 고민 카드를 가리키는 말꼬리. 데스크톱 5열 그리드 기준 */}
        <span
          aria-hidden
          className="absolute -top-[9px] hidden h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-primary-15 bg-primary-5 md:block"
          style={{ left: `${(selectedIndex * 2 + 1) * 10}%` }}
        />
        <div
          key={selectedId}
          className={`flex flex-col gap-1 md:flex-row md:items-end md:justify-between ${styles.panelIn}`}
        >
          <div>
            <span className="text-xxsmall12 font-medium text-primary">
              {selected.label}
            </span>
            <h3 className="mt-1 text-small18 font-bold text-neutral-0 md:text-small20">
              {selected.panelTitle}
            </h3>
          </div>
          <p className="text-xsmall14 text-neutral-40">
            {selected.panelDescription}
          </p>
        </div>
        <ul
          key={`actions-${selectedId}`}
          className={`mt-5 flex flex-col gap-3 md:flex-row md:gap-4 ${styles.panelIn}`}
        >
          {selected.actions.map((action) => (
            <ActionCard
              key={action.slug}
              action={action}
              href={hrefMap[action.slug]}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ConcernSection;
