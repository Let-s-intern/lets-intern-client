import { useState } from 'react';
import { MypageApplication } from '../../../../../api/application';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface DoneSectionProps {
  applicationList: MypageApplication[];
}

const DoneSection = ({ applicationList }: DoneSectionProps) => {
  const [showMore, setShowMore] = useState(false);

  const viewList = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">작성된 후기</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-20">
          <p className="text-neutral-0 text-opacity-[36%]">
            작성한 후기가 아직 없어요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
          {viewList.map((application) => (
            <ApplicationCard
              key={application.id}
              grayscale
              application={application}
              hasReviewButton
              reviewType="EDIT"
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

export default DoneSection;
