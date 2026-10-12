import type {
  AllInOnePassPlan,
  PassMentoringCoupon,
  PassProgramType,
} from '../../types';

const PROGRAM_LABEL: Record<PassProgramType, string> = {
  CHALLENGE: '챌린지',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  LIVE: '무료세미나',
};

interface Props {
  plan: AllInOnePassPlan;
  /** 멘토링 쿠폰 (privilege 가 아니라 쿠폰). 쿠폰명 + 사용 가능 횟수로 표기 */
  mentoringCoupons: PassMentoringCoupon[];
}

/** U-1 대시보드 "내 패스 이용권" 카드 — 플랜명 + 이용권 뱃지 */
export default function PassUsageCard({ plan, mentoringCoupons }: Props) {
  const mentoringTotal = mentoringCoupons.reduce((sum, c) => sum + c.count, 0);
  const badges = [
    ...plan.privileges.map(
      (p) => `${PROGRAM_LABEL[p.programType]} ${p.programCount}종`,
    ),
    ...(mentoringTotal > 0 ? [`멘토링 할인쿠폰 ${mentoringTotal}장`] : []),
  ];

  return (
    <div className="border-neutral-80 rounded-xs flex flex-1 flex-col gap-4 border p-3 md:p-4">
      <div className="flex flex-col gap-3">
        <span className="text-xxsmall12 md:text-xsmall16 text-neutral-10">
          내 패스 이용권
        </span>
        <span className="text-medium22 md:text-medium24 text-neutral-0 font-bold">
          {plan.title}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((label) => (
          <span
            key={label}
            className="bg-primary-5 border-neutral-90 text-xxsmall10 md:text-xsmall14 text-neutral-10 rounded-full border px-1.5 py-1 font-medium md:px-4 md:py-2"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
