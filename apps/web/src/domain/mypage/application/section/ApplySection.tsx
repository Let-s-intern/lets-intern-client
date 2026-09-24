import { MypageApplication } from '@/api/application';
import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import MentoringApplicationCard from '@/domain/live-mentoring/mypage/MentoringApplicationCard';
import HybridLink from '@/common/HybridLink';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import NewApplicationCard from '../../ui/card/NewApplicationCard';

interface ApplySectionProps {
  applicationList: MypageApplication[];
  /** 같은 구간의 1대1 라이브 멘토링. 프로그램과 한 목록으로 보인다(LC-3301). */
  mentoringList: MyLiveMentoringApplication[];
  onMentoringQuestionClick: (applicationId: number) => void;
  hasInProgress: boolean;
  hasCompleted: boolean;
}

const ApplySection = ({
  applicationList,
  mentoringList,
  onMentoringQuestionClick,
  hasInProgress,
  hasCompleted,
}: ApplySectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');

  const visibleCount = isDesktop ? 3 : 4;
  const totalCount = applicationList.length + mentoringList.length;
  const viewList = showMore
    ? applicationList
    : applicationList.slice(0, visibleCount);
  const viewMentoringList = showMore
    ? mentoringList
    : mentoringList.slice(0, Math.max(visibleCount - viewList.length, 0));

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 예정</h1>
      {totalCount === 0 ? (
        <div className="flex w-full flex-col items-center gap-5 py-14">
          <p className="text-xsmall14 text-neutral-20 font-normal">
            참여 예정인 프로그램이 없어요
          </p>
          {!hasInProgress && hasCompleted && (
            <HybridLink
              href="/program"
              className="other_program rounded-xxs border-primary text-primary hover:bg-primary/5 flex w-auto items-center justify-center border bg-white px-3 py-1.5 text-sm font-medium transition-colors"
            >
              프로그램 둘러보기
            </HybridLink>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
          {viewList.map((application) => (
            <NewApplicationCard
              key={application.id}
              application={application}
            />
          ))}
          {viewMentoringList.map((application) => (
            <MentoringApplicationCard
              key={`mentoring-${application.applicationId}`}
              application={application}
              phase="upcoming"
              onQuestionClick={onMentoringQuestionClick}
            />
          ))}
        </div>
      )}
      {totalCount > visibleCount && !showMore && (
        <MoreButton className="md:flex" onClick={() => setShowMore(true)}>
          더보기
        </MoreButton>
      )}
    </section>
  );
};

export default ApplySection;
