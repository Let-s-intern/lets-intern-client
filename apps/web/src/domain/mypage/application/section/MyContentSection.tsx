import { MypageApplication } from '@/api/application';
import { MypageMagnetListItem } from '@/api/magnet/magnetSchema';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import NewApplicationCard, {
  MypageApplicationCard,
} from '../../ui/card/NewApplicationCard';
import { toLibraryCardConfig } from './LibrarySection';

interface MyContentSectionProps {
  guidebookList: MypageApplication[];
  vodClassList: MypageApplication[];
  libraryMagnetList: MypageMagnetListItem[];
}

// 전체 탭 — 상태 없는 구매·소장형(가이드북·VOD·자료집)을 "내 콘텐츠" 로 묶는다.
const MyContentSection = ({
  guidebookList,
  vodClassList,
  libraryMagnetList,
}: MyContentSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');
  const visibleCount = isDesktop ? 3 : 4;

  const cards = [
    ...guidebookList.map((application) => (
      <NewApplicationCard
        key={`guidebook-${application.id}`}
        application={application}
      />
    )),
    ...vodClassList.map((application) => (
      <NewApplicationCard
        key={`vod-${application.id}`}
        application={application}
      />
    )),
    ...libraryMagnetList.map((magnet) => (
      <MypageApplicationCard
        key={`magnet-${magnet.magnetId}`}
        config={toLibraryCardConfig(magnet)}
      />
    )),
  ];

  const visible = showMore ? cards : cards.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">내 콘텐츠</h1>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
        {visible}
      </div>
      {cards.length > visibleCount && !showMore && (
        <MoreButton
          className="border-neutral-80 text-primary hover:!bg-primary/5 !bg-transparent px-3 py-2 transition-colors md:flex md:p-3"
          onClick={() => setShowMore(true)}
        >
          더보기
        </MoreButton>
      )}
    </section>
  );
};

export default MyContentSection;
