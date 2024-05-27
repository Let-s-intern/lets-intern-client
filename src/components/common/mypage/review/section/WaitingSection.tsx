import ApplicationCard from '../../ui/card/ApplicationCard';
import Button from '../../ui/button/Button';

const WaitingSection = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">후기 작성하고 00 받아가세요!</h1>
      <div className="flex gap-4">
        {/* {applicationList.map((application) => ( */}
        <ApplicationCard
          hasReviewButton
          reviewButton={{ text: '후기 작성하기' }}
        />
        {/* ))} */}
      </div>
      <Button className="hidden md:flex">더보기</Button>
    </section>
  );
};

export default WaitingSection;
