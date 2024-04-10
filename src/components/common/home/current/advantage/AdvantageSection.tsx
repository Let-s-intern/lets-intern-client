const AdvantageSection = () => {
  const advantageList = [
    {
      description: '합격까지 필요한 모든 커리큘럼을 제공합니다.',
      imageSrc: '/images/home/advantage1.svg',
      imageAlt: '장점 1 이미지',
    },
    {
      description: '나 혼자가 아닌 함께 하는 챌린지로 완주까지!',
      imageSrc: '/images/home/advantage2.svg',
      imageAlt: '장점 2 이미지',
    },
    {
      description: '오프라인 네트워킹 파티와 온라인 커뮤니티',
      imageSrc: '/images/home/advantage3.svg',
      imageAlt: '장점 3 이미지',
    },
    {
      description: '선배, 실무자의 이야기를 직접 들을 수 있습니다.',
      imageSrc: '/images/home/advantage4.svg',
      imageAlt: '장점 4 이미지',
    },
  ];

  return (
    <section>
      <h1 className="lg:text-md-1.5-semibold text-sm-1.125-bold text-neutral-0">
        렛츠커리어와 왜 함께해야 할까요?
      </h1>
      <div className="mt-6 flex flex-col gap-y-6 xs:flex-row xs:flex-nowrap xs:gap-x-4 xs:gap-y-0 xs:overflow-x-auto">
        {advantageList.map((advantage, index) => (
          <div key={index} className="w-full flex-shrink-0 xs:w-[23rem]">
            <div className="w-full overflow-hidden rounded-xs">
              <img
                src={advantage.imageSrc}
                alt={advantage.imageAlt}
                className="w-full"
              />
            </div>
            <p className="text-0.875-medium mt-3 text-neutral-0">
              {advantage.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvantageSection;
