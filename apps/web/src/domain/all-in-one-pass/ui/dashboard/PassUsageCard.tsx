'use client';

import { useGetMyPassPlan } from '../../api/dashboard';

const PROGRAM_LABEL: Record<string, string> = {
  CHALLENGE: '챌린지',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  LIVE: '라이브 클래스',
};

// v1: 멘토링 쿠폰은 고정 노출(플랜/API에 없음). 멘토링 정리 시 교체.
const MENTORING_BADGE = '1:1 LIVE 멘토링 50% 할인 쿠폰';

export default function PassUsageCard({
  applicationId,
}: {
  applicationId: number;
}) {
  const { data } = useGetMyPassPlan(applicationId);
  if (!data) return null;

  const badges = [
    ...data.privilegeList.map(
      (p) => `${PROGRAM_LABEL[p.programType] ?? p.programType} 이용권`,
    ),
    MENTORING_BADGE,
  ];

  return (
    <div className="border-neutral-80 rounded-xs flex flex-1 flex-col gap-4 border p-3 md:p-4">
      <div className="flex flex-col gap-3">
        <span className="text-xxsmall12 md:text-xsmall16 text-neutral-10">
          내 패스 이용권
        </span>
        <span className="text-medium22 md:text-medium24 text-neutral-0 font-bold">
          {data.title}
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
