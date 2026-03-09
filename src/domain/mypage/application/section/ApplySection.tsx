import { MypageApplication } from '@/api/application';
import HybridLink from '@/common/HybridLink';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import NewApplicationCard from '../../ui/card/NewApplicationCard';

interface ApplySectionProps {
  applicationList: MypageApplication[];
}

const ApplySection = ({ applicationList }: ApplySectionProps) => {
  const [showMore, setShowMore] = useState(false);

  const viewList = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 예정</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-5 py-14">
          <p className="text-xsmall14 font-normal text-neutral-20">
            참여 예정인 프로그램이 없어요
          </p>
          <HybridLink
            href="/program"
            className="other_program flex w-auto items-center justify-center rounded-xxs border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            프로그램 둘러보기
          </HybridLink>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
          {viewList.map((application) => (
            <NewApplicationCard
              key={application.id}
              application={application}
            />
          ))}
        </div>
      )}
      {applicationList.length > 3 && !showMore && (
        <MoreButton className="md:flex" onClick={() => setShowMore(true)}>
          더보기
        </MoreButton>
      )}
    </section>
  );
};

export default ApplySection;
