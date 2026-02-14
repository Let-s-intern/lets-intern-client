import { PROGRAMS } from '../data/constants';
import { ProgramRecommendation } from '../types/types';

interface MobileRecommendationCardProps {
  recommendation: ProgramRecommendation;
}

const MobileRecommendationCard = ({
  recommendation,
}: MobileRecommendationCardProps) => {
  const program = PROGRAMS[recommendation.programId];
  const plan =
    program.plans.find((p) => p.id === recommendation.suggestedPlanId) ??
    program.plans[0];

  const isPrimary = recommendation.emphasis === 'primary';

  return (
    <div
      className={`flex w-full flex-col gap-y-3 rounded-lg border-2 p-4 shadow-md ${
        isPrimary
          ? 'border-primary/30 bg-primary-20'
          : 'border-primary/20 bg-primary-10'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-xsmall12 rounded-full px-2.5 py-1 font-bold ${
            isPrimary
              ? 'bg-gradient-to-r from-primary to-primary-80 text-white'
              : 'bg-gradient-to-r from-primary-40 to-primary-30 text-white'
          }`}
        >
          {isPrimary ? '주요 추천' : '보완 추천'}
        </span>
        {program.badge && (
          <span className="text-xsmall12 rounded-full bg-white/80 px-2.5 py-1 font-semibold text-neutral-40">
            {program.badge}
          </span>
        )}
      </div>
      <div className="text-medium18 font-black text-neutral-0">
        {program.title}
      </div>
      <p className="text-small14 font-medium text-neutral-30">
        {program.subtitle}
      </p>
      <div className="text-xsmall13 flex flex-col gap-1.5 font-medium text-neutral-40">
        <span>대상: {program.target}</span>
        <span>기간: {program.duration}</span>
        <span>피드백: {program.feedback}</span>
      </div>
      <div className="text-small14 rounded-md border border-primary/30 bg-white/90 px-3 py-2.5">
        <p className="font-bold text-primary">이 조합으로 진행하세요</p>
        <p className="pt-1 font-medium leading-relaxed text-neutral-20">
          {recommendation.reason}
        </p>
      </div>
      <div className="flex flex-col gap-1.5 rounded-md border border-neutral-85 bg-white px-3 py-2.5">
        <div className="text-xsmall12 font-semibold text-neutral-40">
          추천 플랜
        </div>
        <div className="text-medium16 font-black text-neutral-0">
          {plan.name}
        </div>
        <div className="text-small13 font-medium text-neutral-30">
          {plan.price}
          {plan.note ? ` · ${plan.note}` : ''}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-xsmall12 font-semibold text-neutral-40">
          결과물
        </div>
        <div className="text-small14 font-medium leading-relaxed text-neutral-0">
          {program.deliverable}
        </div>
      </div>
    </div>
  );
};

export default MobileRecommendationCard;
