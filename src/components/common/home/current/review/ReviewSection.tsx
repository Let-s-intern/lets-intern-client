const ReviewSection = () => {
  return (
    <section>
      <h1 className="text-sm-1.125-bold text-neutral-0">생생한 참여 후기</h1>
      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex h-[15rem] w-full flex-col justify-end rounded-xs bg-primary-xlight px-5 py-7"
          >
            <h2 className="text-xs-0.875-medium text-neutral-0">
              합격까지 필요한 모든 커리큘럼을 제공합니다.
            </h2>
            <p className="text-xs-0.875-light mt-2 text-neutral-30">
              기업 로고를 클릭해 합격 후기를 확인해보세요!
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
