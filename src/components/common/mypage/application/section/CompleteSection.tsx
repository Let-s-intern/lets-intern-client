import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/ApplicationCard';

const CompleteSection = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">신청 완료</h1>
      <div className="flex gap-4">
        {/* {applicationList.map((application) => ( */}
        <ApplicationCard
          hasReviewButton
          grayscale
          reviewButton={{ text: '후기 작성하기' }}
        />
        {/* ))} */}
      </div>
      <Button className="hidden md:flex">더보기</Button>
    </section>
  );
};

export default CompleteSection;
