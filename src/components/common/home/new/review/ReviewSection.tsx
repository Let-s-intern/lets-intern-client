const ReviewSection = () => {
  const reviewList = [
    {
      title: '합격까지 필요한 모든 커리큘럼을 제공합니다.',
      description: '기업 로고를 클릭해 합격 후기를 확인해보세요!',
      imageSrc: '/images/home/review1.svg',
      imageAlt: '후기 1 이미지',
    },
    {
      title: '합격까지 필요한 모든 커리큘럼을 제공합니다.',
      description: '기업 로고를 클릭해 합격 후기를 확인해보세요!',
      imageSrc: '/images/home/review2.svg',
      imageAlt: '후기 2 이미지',
    },
    {
      title: '합격까지 필요한 모든 커리큘럼을 제공합니다.',
      description: '기업 로고를 클릭해 합격 후기를 확인해보세요!',
      imageSrc: '/images/home/review3.svg',
      imageAlt: '후기 3 이미지',
    },
    {
      title: '합격까지 필요한 모든 커리큘럼을 제공합니다.',
      description: '기업 로고를 클릭해 합격 후기를 확인해보세요!',
      imageSrc: '/images/home/review4.svg',
      imageAlt: '후기 4 이미지',
    },
  ];

  return (
    <section>
      <h1 className="text-1.125-bold lg:text-1.375-semibold text-neutral-0">
        생생한 참여 후기
      </h1>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-nowrap sm:overflow-x-auto">
        {reviewList.map((review, index) => (
          <div
            key={index}
            className="flex h-[15rem] w-full flex-col justify-end rounded-xs bg-primary-xlight bg-cover px-5 py-7 sm:w-[21rem] sm:flex-shrink-0"
            style={{ backgroundImage: `url(${review.imageSrc})` }}
          >
            <h2 className="text-0.875-medium text-neutral-0">{review.title}</h2>
            <p className="text-0.875-light mt-2 text-neutral-30">
              {review.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
