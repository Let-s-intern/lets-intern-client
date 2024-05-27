import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/ApplicationCard';

interface ApplySectionProps {
  applicationList: {
    id: number;
    status: string;
    programTitle: string;
    programStartDate: string;
    programEndDate: string;
  }[];
}

const ApplySection = ({ applicationList }: ApplySectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">신청 완료</h1>
      <div className="flex gap-4">
        {/* {applicationList.map((application) => ( */}
        <ApplicationCard />
        {/* ))} */}
      </div>
      <Button className="hidden md:flex">더보기</Button>
    </section>
  );
};

export default ApplySection;
