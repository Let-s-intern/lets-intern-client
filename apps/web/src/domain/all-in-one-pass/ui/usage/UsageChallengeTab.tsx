// 나의 패스 이용 > 챌린지 탭 (참여 전 / 참여 중 / 참여 완료).
'use client';

import MoreButton from '@/domain/mypage/ui/button/MoreButton';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PassProgramCard, { type PassProgramCardData } from './PassProgramCard';
import { useUsageChallenge } from './useUsageChallenge';

const UsageSection = ({
  title,
  items,
  onCardClick,
}: {
  title: string;
  items: PassProgramCardData[];
  onCardClick: (item: PassProgramCardData) => void;
}) => {
  const [showMore, setShowMore] = useState(false);
  // 데스크탑 2줄(8개) / 모바일 3줄(6개)까지 노출, 초과 시 더보기
  const isDesktop = useMediaQuery('(min-width:768px)');
  const visibleCount = isDesktop ? 8 : 4;

  if (items.length === 0) return null;

  const list = showMore ? items : items.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-4 md:gap-[18px]">
      <h2 className="text-xsmall16 md:text-small18 font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-x-4 md:gap-y-5">
        {list.map((item) => (
          <PassProgramCard
            key={`${item.participation}-${item.programId}`}
            item={item}
            onClick={() => onCardClick(item)}
          />
        ))}
      </div>
      {items.length > visibleCount && !showMore && (
        <MoreButton className="w-full" onClick={() => setShowMore(true)}>
          더보기
        </MoreButton>
      )}
    </section>
  );
};

const UsageChallengeTab = () => {
  const router = useRouter();
  const { before, inProgress, done, isLoading, isError } = useUsageChallenge();

  const handleCardClick = (item: PassProgramCardData) => {
    if (item.participation === 'BEFORE') {
      // TODO(U-3): 참여하기 = 가격 선택 바텀시트. 연결 전까지는 프로그램 상세로 이동.
      router.push(`/program/challenge/${item.programId}`);
      return;
    }
    // 참여 중/완료 → 대시보드 입장
    router.push(`/challenge/${item.applicationId}/${item.programId}`);
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

  const isEmpty =
    before.length === 0 && inProgress.length === 0 && done.length === 0;
  if (isEmpty) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        현재 이용 가능한 챌린지가 없어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <UsageSection
        title="참여 전"
        items={before}
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 중"
        items={inProgress}
        onCardClick={handleCardClick}
      />
      <UsageSection
        title="참여 완료"
        items={done}
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default UsageChallengeTab;
