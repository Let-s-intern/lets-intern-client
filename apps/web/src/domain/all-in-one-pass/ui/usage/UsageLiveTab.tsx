// 나의 패스 이용 > 라이브 클래스 탭 (참여 전 / 참여 중 / 참여 완료).
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { useRouter } from 'next/navigation';
import type { PassProgramCardData } from './PassProgramCard';
import UsageSection from './UsageSection';
import { useUsageProgramTab } from './useUsageProgramTab';

const UsageLiveTab = () => {
  const router = useRouter();
  const { before, inProgress, done, isLoading, isError } =
    useUsageProgramTab('LIVE');

  const handleCardClick = (item: PassProgramCardData) => {
    if (item.participation === 'BEFORE') {
      // TODO(BE): 신청 — 베이직 0원 headless 신청 / 차액은 결제창. 전까지는 상세로 이동.
      router.push(`/program/live/${item.programId}`);
      return;
    }
    // 참여 중/완료 → 클래스 입장
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
        emptyText="현재 신청 가능한 라이브 클래스가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 예정"
        note={
          <>
            참여 안내를 포함한 모든 공지는{' '}
            <b className="font-semibold">오픈채팅방</b>을 통해 전달됩니다.{' '}
            <br className="block md:hidden" />
            라이브 클래스{' '}
            <b className="font-semibold">
              신청 시 전달받은 카카오톡 알림 메세지
            </b>
            를 확인해주세요!
          </>
        }
        items={inProgress}
        emptyText="참여 예정된 라이브 클래스가 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 완료"
        items={done}
        emptyText="참여 완료한 라이브 클래스가 없습니다."
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default UsageLiveTab;
