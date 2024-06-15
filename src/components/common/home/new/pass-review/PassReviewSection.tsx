import Heading from '../ui/Heading';

const PassReviewSection = () => {
  return (
    <section>
      <Heading>렛츠커리어인들은 어디서 커리어를 시작했을까요?</Heading>
      <div className="mt-6 flex flex-nowrap gap-x-1.5 overflow-x-auto md:gap-4 lg:gap-6 ">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[6.25rem] w-[14.5rem] flex-shrink-0 overflow-hidden rounded-xs"
          >
            <div className="h-full w-full bg-neutral-80" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PassReviewSection;
