// 나의 패스 이용 > VOD 탭. 유효한(ACTIVE) VOD 이용권이 있으면 seminar-vod 공개 목록을 카드 그리드로 노출,
// 클릭 시 외부 상세로 이동. 없으면 잠금 + 추가구매 안내. 챌린지에서 산 이용권도 같은 이용권으로 인정한다.
'use client';

import { useVodPassListQuery } from '@/api/vodPass';
import LoadingContainer from '@/common/loading/LoadingContainer';
import MoreButton from '@/domain/mypage/ui/button/MoreButton';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import LockedTab from '../LockedTab';
import { useUsageVods } from './useUsageVods';

interface Props {
  membershipId: number;
}

const UsageVodTab = ({ membershipId }: Props) => {
  // 이용권과 VOD 목록은 서로 기다리지 않고 함께 조회한다
  const vodPassQuery = useVodPassListQuery();
  const { data: vods = [], isLoading, isError } = useUsageVods();
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');
  const visibleCount = isDesktop ? 12 : 8;

  if (vodPassQuery.isLoading || isLoading) {
    return <LoadingContainer className="py-20" />;
  }
  if (vodPassQuery.isError) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        VOD 이용권 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }
  const hasActiveVodPass =
    vodPassQuery.data?.passes.some((pass) => pass.status === 'ACTIVE') ?? false;
  if (!hasActiveVodPass) {
    // 단독 VOD 이용권 구매 화면이 없어 같은 패스 랜딩(VOD 옵션 결제)으로 보낸다
    return (
      <LockedTab message="VOD 이용권이 있어야 시청할 수 있어요">
        <Link
          href={`/all-in-one-pass/${membershipId}`}
          className="text-primary text-xsmall14 md:text-xsmall16 font-semibold underline underline-offset-2"
        >
          VOD 이용권 구매하러 가기
        </Link>
      </LockedTab>
    );
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

export default UsageVodTab;
