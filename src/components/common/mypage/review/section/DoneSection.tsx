import ApplicationCard from '../../ui/card/ApplicationCard';
import Button from '../../ui/button/Button';

const DoneSection = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">작성된 후기</h1>
      <div className="flex gap-4">
        {/* {applicationList.map((application) => ( */}
        <ApplicationCard
          hasReviewButton
          grayscale
          reviewButton={{ text: '수정하기' }}
        />
        {/* ))} */}
      </div>
      <Button className="hidden md:flex">더보기</Button>
    </section>
  );
};

export default DoneSection;
