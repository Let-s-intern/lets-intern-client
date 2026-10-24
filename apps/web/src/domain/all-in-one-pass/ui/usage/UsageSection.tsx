// 나의 패스 이용 공통 섹션(제목 + 카드 그리드 + 더보기). 챌린지·가이드북·라이브 탭 공유.
'use client';

import MoreButton from '@/domain/mypage/ui/button/MoreButton';
import { useMediaQuery } from '@mui/material';
import { useState, type ReactNode } from 'react';
import PassProgramCard, { type PassProgramCardData } from './PassProgramCard';

const UsageSection = ({
  title,
  note,
  items,
  emptyText = '해당 프로그램이 존재하지 않습니다.',
  onCardClick,
}: {
  title: string;
  note?: ReactNode;
  items: PassProgramCardData[];
  emptyText?: string;
  onCardClick: (item: PassProgramCardData) => void;
}) => {
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');
  const visibleCount = isDesktop ? 8 : 4;

  const list = showMore ? items : items.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-4 md:gap-[18px]">
      <div className="flex flex-col gap-2">
        <h2 className="text-xsmall16 md:text-small18 font-semibold">{title}</h2>
        {note && (
          <div className="bg-primary-5 rounded-xxs flex items-start gap-1 px-1.5 py-1.5">
            <p className="text-neutral-35 text-[11px] md:text-[13px]">*</p>
            <p className="text-neutral-35 text-[11px] md:text-[13px]">{note}</p>
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex h-52 w-full items-center justify-center rounded-sm md:h-60">
          <p className="text-xsmall14 text-neutral-40">{emptyText}</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
};

export default UsageSection;
