// 나의 패스 이용 > VOD 탭. 이용 기간을 위에 보여주고, 이용 중이면 seminar-vod 공개 목록을 카드 그리드로 노출,
// 클릭 시 외부 상세로 이동. 시작 전이면 목록을 조회하지 않는다. 챌린지에서 산 이용권도 같은 이용권으로 인정한다.
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import MoreButton from '@/domain/mypage/ui/button/MoreButton';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import type { VodPassPeriod } from '../../utils/vodPassPeriod';
import { useUsageVods } from './useUsageVods';
import VodPassPeriodCard from './VodPassPeriodCard';

const VodList = () => {
  const { data: vods = [], isLoading, isError } = useUsageVods();
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');
  const visibleCount = isDesktop ? 12 : 8;

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
  if (vods.length === 0) {
    return (
      <div className="flex h-52 w-full items-center justify-center rounded-sm md:h-60">
        <p className="text-xsmall14 text-neutral-40">
          현재 시청 가능한 VOD가 없습니다.
        </p>
      </div>
    );
  }

  const list = showMore ? vods : vods.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-4 md:gap-[18px]">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-x-4 md:gap-y-5">
        {list.map((vod) => (
          <a
            key={vod.id}
            href={vod.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full cursor-pointer flex-col gap-3"
          >
            <img
              className="bg-neutral-80 md:rounded-xs aspect-[540/421] h-auto w-full rounded-sm object-cover"
              src={vod.thumbnailUrl}
              alt=""
              loading="lazy"
            />
            <h3 className="text-xsmall14 md:text-xsmall16 text-neutral-0 line-clamp-2 font-semibold">
              {vod.title}
            </h3>
          </a>
        ))}
      </div>
      {vods.length > visibleCount && !showMore && (
        <MoreButton className="w-full" onClick={() => setShowMore(true)}>
          더보기
        </MoreButton>
      )}
    </section>
  );
};

const UsageVodTab = ({ period }: { period: VodPassPeriod }) => (
  <div className="flex flex-col gap-4 md:gap-[18px]">
    <VodPassPeriodCard period={period} />
    {period.isActive ? (
      <VodList />
    ) : (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        이용 시작일부터 시청할 수 있어요.
      </p>
    )}
  </div>
);

export default UsageVodTab;
