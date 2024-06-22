import Heading from '../../../../admin/ui/heading/Heading';

const AdvantageSection = () => {
  const introList = [
    {
      description: '합격까지 필요한 모든 커리큘럼을 제공합니다.',
      imageSrc: '/images/home/intro1.png',
      imageAlt: '렛츠커리어 소개 1 이미지',
    },
    {
      description: '혼자가 아닌 다함께 챌린지를 끝까지 완주할 수 있습니다.',
      imageSrc: '/images/home/intro2.png',
      imageAlt: '렛츠커리어 소개 2 이미지',
    },
    {
      description: '주니어 네트워크를 통해 모두 함께 성장할 수 있습니다.',
      imageSrc: '/images/home/intro3.png',
      imageAlt: '렛츠커리어 소개 3 이미지',
    },
    {
      description: '선배, 실무자의 이야기를 직접 들을 수 있습니다.',
      imageSrc: '/images/home/intro4.png',
      imageAlt: '렛츠커리어 소개 4 이미지',
    },
  ];

  return (
    <section>
      <Heading>렛츠커리어와 왜 함께해야 할까요?</Heading>
      <div className="mt-6 grid  grid-cols-1 flex-col gap-4 md:grid-cols-2">
        {introList.map((intro, index) => (
          <div key={index} className="w-full">
            <div className="w-full overflow-hidden rounded-xs">
              <img
                src={intro.imageSrc}
                alt={intro.imageAlt}
                className="w-full"
              />
            </div>
            <p className="text-0.875-medium py-2 text-neutral-0">
              {intro.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvantageSection;
