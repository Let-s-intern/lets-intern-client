import { useMediaQuery } from '@mui/material';
import type { MyLiveMentoringApplication } from '@/api/live-mentoring/liveMentoringSchema';
import MentoringApplicationCard from '@/domain/live-mentoring/mypage/MentoringApplicationCard';
import { useState } from 'react';
import { MypageApplication } from '../../../../api/application';
import MoreButton from '../../ui/button/MoreButton';
import NewApplicationCard from '../../ui/card/NewApplicationCard';

interface ParticipateSectionProps {
  applicationList: MypageApplication[];
  /** 같은 구간의 1대1 라이브 멘토링. 프로그램과 한 목록으로 보인다(LC-3301). */
  mentoringList: MyLiveMentoringApplication[];
  onMentoringQuestionClick: (applicationId: number) => void;
}

const ParticipateSection = ({
  applicationList,
  mentoringList,
  onMentoringQuestionClick,
}: ParticipateSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');

  const visibleCount = isDesktop ? 3 : 4;
  const totalCount = applicationList.length + mentoringList.length;
  const list = showMore
    ? applicationList
    : applicationList.slice(0, visibleCount);
  const viewMentoringList = showMore
    ? mentoringList
    : mentoringList.slice(0, Math.max(visibleCount - list.length, 0));

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 중</h1>
      {totalCount === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-xsmall14 text-neutral-20 font-normal">
            참여 중인 프로그램이 아직 없어요.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
            {list.map((application) => (
              <NewApplicationCard
                key={application.id}
                application={application}
              />
            ))}
            {viewMentoringList.map((application) => (
              <MentoringApplicationCard
                key={`mentoring-${application.applicationId}`}
                application={application}
                phase="ongoing"
                onQuestionClick={onMentoringQuestionClick}
              />
            ))}
          </div>
          {totalCount > visibleCount && !showMore && (
            <MoreButton
              className="border-neutral-80 text-primary hover:!bg-primary/5 !bg-transparent px-3 py-2 transition-colors md:flex md:p-3"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </MoreButton>
          )}
        </>
      )}
    </section>
  );
};

export default ParticipateSection;
