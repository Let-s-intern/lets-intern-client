import AboutTitle from '../ui/AboutTitle';

const TITLE = {
  subTitle: '선순환 커뮤니티',
  title: '인턴·취업 성공 후에도 함께해요',
};

const CONTENT = [
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
    <section className="px-5 py-[3.75rem]">
      <AboutTitle {...TITLE} />
      <div className="flex flex-col gap-10">
        {CONTENT.map(({ imgSrc, alt, description }) => (
          <div key={alt} className="flex flex-col gap-5">
            <img className="h-full w-full sm:w-80" src={imgSrc} alt={alt} />
            <p className="text-0.875 px-3.5 text-neutral-40">
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
