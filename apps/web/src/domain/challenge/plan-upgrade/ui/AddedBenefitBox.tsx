import CheckIcon from '@/assets/icons/check.svg?react';
import type { ChallengePricePlan } from '@/schema';
import type { ReactNode } from 'react';
import type { PlanUpgradeFeedbackMission } from '../api/planUpgradeSchema';
import {
  formatFeedbackCount,
  formatFeedbackMission,
} from '../utils/planUpgradeText';

interface AddedBenefitBoxProps {
  currentPlanType: ChallengePricePlan;
  currentPlanDescription?: string | null;
  feedbackMissions: PlanUpgradeFeedbackMission[];
}

const BenefitItem = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <li className="flex gap-1.5">
    <CheckIcon aria-hidden="true" className="text-primary h-6 w-6 shrink-0" />
    <div className="flex flex-col gap-1">
      <p className="text-xsmall16 text-neutral-0 font-semibold">{title}</p>
      {children}
    </div>
  </li>
);

/**
 * 고른 플랜으로 올리면 추가되는 혜택.
 *
 * 문구는 기존 데이터로만 만든다 (D19). 현재 플랜 설명 한 줄과 새로 받는 피드백 미션.
 * 새 피드백 미션이 없으면 피드백 항목을 뺀다.
 */
const AddedBenefitBox = ({
  currentPlanType,
  currentPlanDescription,
  feedbackMissions,
}: AddedBenefitBoxProps) => (
  <section className="flex flex-col gap-2">
    <p className="text-xsmall14 text-neutral-40">
      {currentPlanType}에서 추가되는 혜택
    </p>
    <ul className="bg-primary-5 flex flex-col gap-5 rounded-md p-5">
      <BenefitItem title={`${currentPlanType} PLAN의 모든 혜택`}>
        {currentPlanDescription && (
          <p className="text-xsmall14 text-neutral-20 whitespace-pre-line">
            {currentPlanDescription}
          </p>
        )}
      </BenefitItem>
      {feedbackMissions.length > 0 && (
        <BenefitItem title={formatFeedbackCount(feedbackMissions.length)}>
          {feedbackMissions.map((mission) => (
            <p
              key={mission.missionId}
              className="text-xsmall14 text-neutral-20"
            >
              {formatFeedbackMission(mission)}
            </p>
          ))}
        </BenefitItem>
      )}
    </ul>
  </section>
);

export default AddedBenefitBox;
