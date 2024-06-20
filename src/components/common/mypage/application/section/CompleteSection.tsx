import { useState } from 'react';
import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface CompleteSectionProps {
  applicationList: ApplicationType[];
}

const CompleteSection = ({ applicationList }: CompleteSectionProps) => {
  const [viewList, setViewList] = useState<ApplicationType[]>(applicationList.slice(0, 3));
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 완료</h1>
      <div className="flex gap-4 md:flex-col">
        {applicationList.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-20">
            <p className="text-neutral-0 text-opacity-[36%]">
              참여 완료한 내역이 아직 없어요.
            </p>
          </div>
        ) : (viewList
            .map((application) => (
              <ApplicationCard
                hasReviewButton
                grayscale
                reviewType="CREATE"
                application={application}
              />
            ))
        )}
      </div>
      {applicationList.length > 3 && (
        <Button className="hidden md:flex" onClick={() => {
          setViewList(applicationList);
        
        }}>더보기</Button>
      )}
    </section>
  );
};

export default CompleteSection;
