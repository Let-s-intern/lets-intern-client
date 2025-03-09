import { useState } from 'react';
import { MypageApplication } from '../../../../../api/application';
import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface CompleteSectionProps {
  applicationList: MypageApplication[];
}

const CompleteSection = ({ applicationList }: CompleteSectionProps) => {
  const [showMore, setShowMore] = useState(false);

  const viewList = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 완료</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-20">
          <p className="text-neutral-0 text-opacity-[36%]">
            참여 완료한 프로그램이 아직 없어요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
          {viewList.map((application) => (
            <ApplicationCard
              key={application.id}
              grayscale
              application={application}
              showChallengeButton
            />
          ))}
        </div>
      )}
      {applicationList.length > 3 && !showMore && (
        <Button
          className="md:flex"
          onClick={() => {
            setShowMore(true);
          }}
        >
          더보기
        </Button>
      )}
    </section>
  );
};

export default CompleteSection;
