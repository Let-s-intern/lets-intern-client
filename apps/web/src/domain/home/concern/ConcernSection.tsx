'use client';

import { useFirstB2CChallenge } from '@/hooks/useFirstB2CChallenge';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType } from '@/schema';
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

/** 모집 중인 챌린지가 없으면 프로그램 목록으로 보낸다 */
const FALLBACK_HREF = '/program';

const ActionLink = ({
  href,
  action,
}: {
  href: string;
  action: ConcernAction;
}) => (
  <Link
    href={href}
    className="concern_cta text-xsmall14 text-primary md:text-xsmall16 rounded-xs shadow-01 mt-4 flex items-center justify-between bg-white px-3 py-2.5 font-semibold md:px-4"
    data-url={href}
    data-text={action.cta}
  >
    {action.cta}
    <ChevronRight size={20} />
  </Link>
);

const ChallengeActionLink = ({
  type,
  action,
}: {
  type: ChallengeType;
  action: ConcernAction;
}) => {
  const challenge = useFirstB2CChallenge(type);
  return <ActionLink href={challenge?.href ?? FALLBACK_HREF} action={action} />;
};

const ActionCard = ({ action }: { action: ConcernAction }) => (
  <li className="flex flex-1 flex-col rounded-sm bg-white/70 p-4 md:p-5">
    <h4 className="text-small18 text-neutral-0 font-bold">{action.title}</h4>
    <p className="text-xsmall14 text-neutral-20 mt-2">{action.quote}</p>
    <p className="text-xxsmall12 text-neutral-45 mt-1">{action.meta}</p>
    <div className="mt-auto">
      {action.challengeType ? (
        <ChallengeActionLink type={action.challengeType} action={action} />
      ) : (
        <ActionLink href={action.href ?? FALLBACK_HREF} action={action} />
      )}
    </div>
  </li>
);

/** 자동 넘김 간격. ConcernSection.module.css 의 진행 바 시간과 맞춘다 */
const AUTO_ROTATE_MS = 4000;

const ConcernSection = () => {
  const [selectedId, setSelectedId] = useState(CONCERNS[0].id);
  // 사용자가 탭을 한 번이라도 누르면 자동 넘김을 멈춘다
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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
        <h2 className="text-medium24 text-neutral-0 md:text-xlarge28 font-bold">
          취업 준비, 지금 <span className="text-primary">어디서</span> 막혔나요?
        </h2>
        <p className="text-xsmall14 text-neutral-30 md:text-xsmall16 mt-2">
          고민을 선택하면 지금 필요한 프로그램을 바로 찾아드릴게요.
        </p>
      </div>

      <div
        role="tablist"
        className="scrollbar-hide -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:mt-10 md:grid md:grid-cols-5 md:gap-3 md:overflow-visible md:px-0"
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
                'concern_tab border-neutral-80 relative flex min-w-[148px] flex-col overflow-hidden rounded-md border bg-white p-4 text-left transition-colors md:min-w-0 md:p-5',
                isSelected && 'border-primary border-2',
              )}
              data-text={concern.label}
            >
              <span
                className={twMerge(
                  'text-xxsmall12 flex items-center gap-1 font-medium',
                  color,
                )}
              >
                <Icon size={14} />
                {concern.label}
              </span>
              <span className="text-xsmall16 text-neutral-0 md:text-small18 mt-3 whitespace-pre-line font-bold">
                {concern.headline}
              </span>
              <span className="text-xxsmall12 text-neutral-40 mt-auto pt-6">
                {concern.keywords}
              </span>
              {isSelected && isAutoPlaying && (
                <span
                  aria-hidden
                  key={selectedId}
                  className={`bg-primary absolute inset-x-0 bottom-0 h-1 ${styles.progress}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="border-primary-15 bg-primary-5 relative mt-4 rounded-md border p-5 md:mt-6 md:p-8"
      >
        {/* 선택된 고민 카드를 가리키는 말꼬리. 데스크톱 5열 그리드 기준 */}
        <span
          aria-hidden
          className="border-primary-15 bg-primary-5 absolute -top-[9px] hidden h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t md:block"
          style={{ left: `${(selectedIndex * 2 + 1) * 10}%` }}
        />
        <div
          key={selectedId}
          className={`flex flex-col gap-1 md:flex-row md:items-end md:justify-between ${styles.panelIn}`}
        >
          <div>
            <span className="text-xxsmall12 text-primary font-medium">
              {selected.label}
            </span>
            <h3 className="text-small18 text-neutral-0 md:text-small20 mt-1 font-bold">
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
            <ActionCard key={action.title} action={action} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ConcernSection;
