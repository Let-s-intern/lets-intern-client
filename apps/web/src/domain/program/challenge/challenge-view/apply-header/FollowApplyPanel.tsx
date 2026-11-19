'use client';

import useScrollDirection from '@/hooks/useScrollDirection';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import type { ActiveChallengeType, ChallengeIdSchema } from '@/schema';
import { useRouter } from 'next/navigation';
import { useChallengeApplyPanel } from '../../hooks/useChallengeApplyPanel';
import { useChallengeApplySheetStore } from '../../store/useChallengeApplySheetStore';
import TemplateApplyButton from '../../template-guidebook/TemplateApplyButton';
import PlanSelectCard from './PlanSelectCard';

const CompactSelect = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (key: string) => void;
  disabled?: boolean;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-xxsmall12 font-semibold text-neutral-30">
      {label}
    </span>
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xs border border-neutral-80 bg-white px-3 py-2 text-xsmall14 text-neutral-0 disabled:bg-neutral-95 disabled:text-neutral-50"
    >
      {options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

/**
 * 데스크톱에서 본문을 내려도 오른쪽에 붙어 따라오는 신청 패널 (스마트스토어형).
 * 상단 패널과 같은 스토어·훅을 써서 고른 값이 함께 움직인다. 모바일은 하단 바를 쓴다
 */
const FollowApplyPanel = ({
  challenge,
  challengeId,
  activeChallengeList,
}: {
  challenge: ChallengeIdSchema;
  challengeId: string | undefined;
  activeChallengeList: ActiveChallengeType[] | undefined;
}) => {
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const keepScroll = useChallengeApplySheetStore(
    (state) => state.keepScrollOnNextPage,
  );
  const {
    openApply,
    guidebook,
    showTemplate,
    setTemplateMode,
    setSheetPlan,
    targetOptions,
    startDateOptions,
    applyState,
    passHref,
    planOptions,
    selectedPlan,
    selectedPlanPassPrice,
    priceSummary,
  } = useChallengeApplyPanel({ challenge, challengeId, activeChallengeList });

  // 다른 버전·기수는 다른 페이지라 이동한다. 스크롤 위치는 지킨다
  const goTo = (href: string) => {
    if (!href) return;
    keepScroll();
    router.push(href, { scroll: false });
  };

  const selectedTarget = targetOptions.find((option) => option.selected);
  const selectedStart = startDateOptions.find((option) => option.selected);

  return (
    <aside
      className={twMerge(
        'challenge_follow_panel sticky flex max-h-[calc(100vh-48px)] flex-col gap-4 overflow-y-auto rounded-md border border-neutral-85 bg-white p-5 transition-[top]',
        scrollDirection === 'UP'
          ? 'top-[179px] duration-300'
          : 'top-6 duration-200',
      )}
    >
      <p className="line-clamp-2 text-xsmall16 font-bold text-neutral-0">
        {challenge.title}
      </p>

      {guidebook !== null && (
        <CompactSelect
          label="진행 방식"
          value={showTemplate ? 'TEMPLATE' : 'LIVE'}
          options={[
            { key: 'LIVE', label: '매일 미션으로 완성하기(챌린지)' },
            { key: 'TEMPLATE', label: '가이드 따라 완성하기(가이드북)' },
          ]}
          onChange={(key) => setTemplateMode(key === 'TEMPLATE')}
        />
      )}

      {targetOptions.length > 1 && (
        <CompactSelect
          label="현재 나의 상황"
          value={selectedTarget?.key ?? ''}
          disabled={showTemplate}
          options={targetOptions.map((option) => ({
            key: option.key,
            label: option.label,
          }))}
          onChange={(key) =>
            goTo(targetOptions.find((option) => option.key === key)?.href ?? '')
          }
        />
      )}

      {startDateOptions.length > 0 && (
        <CompactSelect
          label="챌린지 시작일"
          value={selectedStart?.key ?? ''}
          disabled={showTemplate}
          options={startDateOptions.map((option) => ({
            key: option.key,
            label: `${dayjs(option.startDate).format('YYYY.MM.DD (dd)')} 시작`,
          }))}
          onChange={(key) =>
            goTo(
              startDateOptions.find((option) => option.key === key)?.href ?? '',
            )
          }
        />
      )}

      {showTemplate && guidebook ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-t border-neutral-80 pt-3">
            <span className="text-xsmall16 font-semibold text-neutral-10">
              총 결제 금액
            </span>
            <strong className="text-medium22 font-bold text-primary">
              {priceSummary.paymentPrice.toLocaleString()}원
            </strong>
          </div>
          <TemplateApplyButton
            guidebookId={guidebook.id}
            title={guidebook.title}
          />
        </div>
      ) : (
        selectedStart && (
          <PlanSelectCard
            compact
            options={planOptions}
            selectedPlan={selectedPlan}
            onSelect={setSheetPlan}
            applyState={applyState}
            onApply={(plan) => openApply(plan)}
            passHref={passHref}
            passPrice={selectedPlanPassPrice}
          />
        )
      )}
    </aside>
  );
};

export default FollowApplyPanel;
