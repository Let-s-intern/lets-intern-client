// 나의 패스 이용 > 챌린지 탭 (참여 전 / 참여 중 / 참여 완료).
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useParams, useRouter } from 'next/navigation';
import type { PassProgramCardData } from './PassProgramCard';
import UsageSection from './UsageSection';
import { useUsageChallenge } from './useUsageChallenge';

const UsageChallengeTab = () => {
  const router = useRouter();
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { before, inProgress, done, isLoading, isError } =
    useUsageChallenge(applicationId);

  const handleCardClick = (item: PassProgramCardData) => {
    // 참여 전, 또는 applicationId 미확보 시 상세로 이동(상세에서 신청·입장).
    if (item.participation === 'BEFORE' || item.applicationId == null) {
      router.push(`/program/challenge/${item.programId}`);
      return;
    }
    // 참여 중/완료 → 개인 챌린지 대시보드 입장
    router.push(`/challenge/${item.applicationId}/${item.programId}`);
  };

  if (isLoading) {
    return <LoadingContainer className="py-20" />;
  }
  if (isError) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <UsageSection
        title="참여 가능"
        items={before}
        emptyText="현재 참여 가능한 챌린지가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 중"
        items={inProgress}
        emptyText="참여 중인 챌린지가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 완료"
        items={done}
        emptyText="참여 완료한 챌린지가 없습니다."
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default UsageChallengeTab;
