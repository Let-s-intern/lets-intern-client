// 나의 패스 이용 > LIVE 클래스 탭 (참여 전 / 참여 중 / 참여 완료).
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useParams, useRouter } from 'next/navigation';
import type { PassProgramCardData } from './PassProgramCard';
import UsageApplyModals from './UsageApplyModals';
import UsageSection from './UsageSection';
import { usePassProgramApply } from './usePassProgramApply';
import { useUsageLive } from './useUsageLive';

const UsageLiveTab = ({ passTitle }: { passTitle?: string }) => {
  const router = useRouter();
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { before, inProgress, done, isLoading, isError } =
    useUsageLive(applicationId);
  const apply = usePassProgramApply('live');

  // 참여 가능 → 0원 신청 모달, 참여 예정/완료 → 상세 이동
  const handleCardClick = (item: PassProgramCardData) => {
    if (item.participation === 'BEFORE') {
      apply.requestApply(item.programId, item.title);
      return;
    }
    router.push(`/program/live/${item.programId}`);
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
        emptyText="현재 신청 가능한 LIVE 클래스가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 예정"
        note={
          <>
            참여 안내를 포함한 모든 공지는{' '}
            <b className="font-semibold">오픈채팅방</b>을 통해 전달됩니다.{' '}
            <br className="block md:hidden" />
            LIVE 클래스{' '}
            <b className="font-semibold">
              신청 시 전달받은 카카오톡 알림 메세지
            </b>
            를 확인해주세요!
          </>
        }
        items={inProgress}
        emptyText="참여 예정된 LIVE 클래스가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 완료"
        items={done}
        emptyText="참여 완료한 LIVE 클래스가 없습니다."
        onCardClick={handleCardClick}
      />

      <UsageApplyModals
        programType="live"
        passTitle={passTitle}
        apply={apply}
      />
    </div>
  );
};

export default UsageLiveTab;
