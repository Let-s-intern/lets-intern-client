import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface DoneSectionProps {
  applicationList: ApplicationType[];
}

const DoneSection = ({ applicationList }: DoneSectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">작성된 후기</h1>
      <div className="flex gap-4 md:flex-col">
        {applicationList.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-20">
            <p className="text-neutral-0 text-opacity-[36%]">
              작성한 후기가 아직 없어요.
            </p>
          </div>
        ) : (
          applicationList.map((application) => (
            <ApplicationCard grayscale application={application} />
          ))
        )}
      </div>
      <Button className="hidden md:flex">더보기</Button>
    </section>
  );
};

export default DoneSection;
