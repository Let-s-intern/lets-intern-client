import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface CompleteSectionProps {
  applicationList: ApplicationType[];
}

const CompleteSection = ({ applicationList }: CompleteSectionProps) => {
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
        ) : (
          applicationList
            .slice(0, 3)
            .map((application) => (
              <ApplicationCard
                hasReviewButton
                grayscale
                reviewButton={{ text: '후기 작성하기' }}
                application={application}
              />
            ))
        )}
      </div>
      {applicationList.length > 3 && (
        <Button className="hidden md:flex">더보기</Button>
      )}
    </section>
  );
};

export default CompleteSection;
