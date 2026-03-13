import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { MypageApplication } from '../../../../api/application';
import MoreButton from '../../ui/button/MoreButton';
import NewApplicationCard from '../../ui/card/NewApplicationCard';

interface ParticipateSectionProps {
  applicationList: MypageApplication[];
}

const ParticipateSection = ({ applicationList }: ParticipateSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');

  const visibleCount = isDesktop ? 3 : 4;
  const list = showMore ? applicationList : applicationList.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 중</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-xsmall14 font-normal text-neutral-20">
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
          </div>
          {applicationList.length > visibleCount && !showMore && (
            <MoreButton
              className="border-neutral-80 !bg-transparent px-3 py-2 text-primary transition-colors hover:!bg-primary/5 md:flex md:p-3"
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
