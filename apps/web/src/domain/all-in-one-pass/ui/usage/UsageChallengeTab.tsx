// 나의 패스 이용 > 챌린지 탭 (참여 전 / 참여 중 / 참여 완료).
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useToast } from '@letscareer/ui';
import { useParams, useRouter } from 'next/navigation';
import PassChallengeApplySheet from './PassChallengeApplySheet';
import type { PassProgramCardData } from './PassProgramCard';
import { usePassChallengeApply } from './usePassChallengeApply';
import UsageSection from './UsageSection';
import { useUsageChallenge } from './useUsageChallenge';

const UsageChallengeTab = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { before, inProgress, done, isLoading, isError } =
    useUsageChallenge(applicationId);
  const challengeApply = usePassChallengeApply();

  const handleCardClick = (item: PassProgramCardData) => {
    if (item.participation === 'BEFORE' || item.applicationId == null) {
      // 모집 예정(아직 신청 불가)은 상세 랜딩으로, 모집 중만 플랜 바텀시트로 신청.
      if (item.programStatusType === 'PREV') {
        router.push(`/program/challenge/${item.programId}`);
        return;
      }
      challengeApply.openSheet(item.programId);
      return;
    }
    // 참여 중/완료 → 시작한 챌린지만 대시보드 입장, 시작 전이면 안내.
    if (item.canEnterDashboard) {
      router.push(`/challenge/${item.applicationId}/${item.programId}`);
    } else {
      toast.toast({
        variant: 'default',
        title: '아직 시작 전인 챌린지예요',
        description: '시작일 이후 대시보드에 입장할 수 있어요.',
      });
    }
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

      <PassChallengeApplySheet controller={challengeApply} />
    </div>
  );
};

export default UsageChallengeTab;
