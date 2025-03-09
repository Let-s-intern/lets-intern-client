import { useState } from 'react';
import { MypageApplication } from '../../../../../api/application';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface ParticipateSectionProps {
  applicationList: MypageApplication[];
}

const ParticipateSection = ({ applicationList }: ParticipateSectionProps) => {
  const [showMore, setShowMore] = useState(false);

  const list = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 중</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-neutral-0 text-opacity-[36%]">
            참여 중인 프로그램이 아직 없어요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
          {list.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              showChallengeButton
            />
          ))}
        </div>
      )}
      {applicationList.length > 3 && !showMore && (
        <MoreButton
          className="md:flex"
          onClick={() => {
            setShowMore(true);
          }}
        >
          더보기
        </MoreButton>
      )}
    </section>
  );
};

export default ParticipateSection;
