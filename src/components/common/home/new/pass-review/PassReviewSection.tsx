const PassReviewSection = () => {
  return (
    <section>
      <h1 className="text-1.125-bold lg:text-1.5-semibold text-neutral-0">
        렛츠커리어인들은 어디서 커리어를 시작했을까?
      </h1>
      <p className="text-0.875-light lg:text-1-light text-neutral-30">
        기업 로고를 클릭해 합격 후기를 확인해보세요!
      </p>
      <div className="mt-6 flex flex-nowrap gap-x-4 overflow-x-auto">
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
