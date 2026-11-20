'use client';

import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import type { ActiveChallengeType, ChallengeIdSchema } from '@/schema';
import { useChallengeApplyPanel } from '../../hooks/useChallengeApplyPanel';
import TemplateApplyButton from '../../template-guidebook/TemplateApplyButton';
import { getApplyAccentStyle } from './applyAccent';
import PlanSelectCard from './PlanSelectCard';

/**
 * 데스크톱에서 본문을 내려도 오른쪽에 붙어 따라오는 신청 패널 (스마트스토어형).
 * 상단 패널과 같은 스토어·훅을 써서 고른 값이 함께 움직인다. 모바일은 하단 바를 쓴다.
 * 진행 방식·참여 대상·시작일은 고르면 다른 페이지로 이동해 상세 전체가 새로 그려지므로
 * 여기서는 빼고, 상단 신청 영역에서만 고른다. 패널은 플랜(옵션)만 고른다.
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
  const scrollDirection = useScrollDirection();
  const {
    openApply,
    guidebook,
    showTemplate,
    setSheetPlan,
    startDateOptions,
    applyState,
    passHref,
    planOptions,
    selectedPlan,
    selectedPlanPassPrice,
    priceSummary,
  } = useChallengeApplyPanel({ challenge, challengeId, activeChallengeList });

  const selectedStart = startDateOptions.find((option) => option.selected);

  return (
    <aside
      style={getApplyAccentStyle(challenge.challengeType)}
      className={twMerge(
        'challenge_follow_panel sticky flex max-h-[calc(100vh-72px)] flex-col gap-4 overflow-y-auto rounded-md border border-neutral-85 bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-[top]',
        scrollDirection === 'UP'
          ? 'top-[179px] duration-300'
          : 'top-10 duration-200',
      )}
    >
      <p className="line-clamp-2 break-keep text-small18 font-bold leading-snug text-neutral-0">
        {challenge.title}
      </p>

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
