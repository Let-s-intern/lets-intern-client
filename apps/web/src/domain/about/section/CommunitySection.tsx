import AboutTitle from '../ui/AboutTitle';

const title = {
  subTitle: '선순환 커뮤니티',
  mainTitle: '인턴·신입 취업 성공 후에도 함께해요',
};

const content = [
  {
    imgSrc: '/images/community1.png',
    alt: '렛츠커리어 네트워킹 파티',
    description: [
      '오프라인 네트워킹에서 다양한 직무·산업·회사 사람들과',
      '함께 커리어에 대해 이야기를 나눠요',
    ],
  },
  {
    imgSrc: '/images/community2.png',
    alt: '렛츠커리어 주니어 TIL 챌린지',
    description: [
      '업무회고 TIL(Today I Learned)을 작성해 성장을 기록하고,',
      '다른 주니어들과 일하는 이야기와 업무 노하우를 공유해요',
    ],
  },
];

const CommunitySection = () => {
  return (
    <section className="px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] xl:py-[7.5rem]">
      <AboutTitle {...title} />
      <div className="flex flex-col items-start justify-center gap-10 md:flex-row">
        {content.map(({ imgSrc, alt, description }) => (
          <div
            key={alt}
            className="flex w-full flex-col items-center gap-5 md:max-w-[24rem]"
          >
            <img className="h-auto w-full" src={imgSrc} alt={alt} />
            <p className="text-0.875 xl:text-1 px-3 text-neutral-40 lg:text-center xl:px-0">
              {description.map((desc) => (
                <span key={desc} className="mr-1">
                  {desc}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunitySection;
