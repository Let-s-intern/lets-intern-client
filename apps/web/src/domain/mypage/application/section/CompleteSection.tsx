import { MypageApplication } from '@/api/application';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import Button from '../../ui/button/Button';
import NewApplicationCard from '../../ui/card/NewApplicationCard';

interface CompleteSectionProps {
  applicationList: MypageApplication[];
}

const CompleteSection = ({ applicationList }: CompleteSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');

  const visibleCount = isDesktop ? 3 : 4;
  const viewList = showMore
    ? applicationList
    : applicationList.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 완료</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-20">
          <p className="text-xsmall14 text-neutral-20 font-normal">
            참여 완료한 프로그램이 아직 없어요.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
            {viewList.map((application) => (
              <NewApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
          {applicationList.length > visibleCount && !showMore && (
            <Button
              className="md:flex"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </Button>
          )}
        </>
      )}
    </section>
  );
};

export default CompleteSection;
