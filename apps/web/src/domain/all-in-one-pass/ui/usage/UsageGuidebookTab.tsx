// 나의 패스 이용 > 가이드북 탭 (열람 가능 / 보유 중).
'use client';

import { useRouter } from 'next/navigation';
import type { PassProgramCardData } from './PassProgramCard';
import UsageSection from './UsageSection';
import { useUsageGuidebook } from './useUsageGuidebook';

const UsageGuidebookTab = () => {
  const router = useRouter();
  const { available, owned, isLoading, isError } = useUsageGuidebook();

  const handleCardClick = (item: PassProgramCardData) => {
    // TODO(BE): 0원 신청 → application 등록 → 다운로드(헤드리스).
    // 신청/다운로드 API 전까지는 상세로 이동(상세에서 신청 가능).
    router.push(`/program/guidebook/${item.programId}`);
  };

  if (isLoading) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        불러오는 중…
      </p>
    );
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
        title="열람 가능"
        items={available}
        emptyText="현재 열람 가능한 가이드북이 없습니다."
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="보유 중"
        items={owned}
        emptyText="보유하신 가이드북이 없습니다."
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default UsageGuidebookTab;
