'use client';

import { useVodPassListQuery } from '@/api/vodPass';
import { useGetMyPassPlan } from '../../api/dashboard';

const PROGRAM_LABEL: Record<string, string> = {
  CHALLENGE: '챌린지',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  LIVE: 'LIVE 클래스',
};

// v1: 멘토링 쿠폰은 고정 노출(플랜/API에 없음). 멘토링 정리 시 교체.
const MENTORING_BADGE = '1:1 LIVE 멘토링 50% 할인 쿠폰';
const VOD_PASS_BADGE = `${PROGRAM_LABEL.VOD} 이용권`;

export default function PassUsageCard({
  applicationId,
}: {
  applicationId: number;
}) {
  const { data } = useGetMyPassPlan(applicationId);
  // 챌린지에서 산 이용권도 같은 VOD 이용권이다. 조회 실패면 배지만 빠진다
  const { data: vodPassList } = useVodPassListQuery();
  if (!data) return null;

  const privilegeBadges = data.privilegeList.map(
    (p) => `${PROGRAM_LABEL[p.programType] ?? p.programType} 이용권`,
  );
  const hasActiveVodPass =
    vodPassList?.passes.some((pass) => pass.status === 'ACTIVE') ?? false;
  // 플랜 권한으로 이미 "VOD 이용권" 배지가 있으면 한 번만 보여준다
  const showVodPassBadge =
    hasActiveVodPass && !privilegeBadges.includes(VOD_PASS_BADGE);

  const badges = [
    ...privilegeBadges,
    ...(showVodPassBadge ? [VOD_PASS_BADGE] : []),
    MENTORING_BADGE,
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xs border border-neutral-80 p-3 md:p-4">
      <div className="flex flex-col gap-3">
        <span className="text-xxsmall12 text-neutral-10 md:text-xsmall16">
          내 패스 이용권
        </span>
        <span className="text-medium22 font-bold text-neutral-0 md:text-medium24">
          {data.title}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((label) => (
          <span
            key={label}
            className="rounded-full border border-neutral-90 bg-primary-5 px-1.5 py-1 text-xxsmall10 font-medium text-neutral-10 md:px-4 md:py-2 md:text-xsmall14"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
