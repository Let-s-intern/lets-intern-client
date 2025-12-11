import AboutTitle from '../../ui/AboutTitle';
import IntroCard from './IntroCard';
import IntroTitle from './IntroTtile';

const title = {
  subTitle: '렛츠커리어와 함께',
  mainTitle: '커리어의 첫 시작을 함께해요',
};

const content = [
  {
    title: 'VISION',
    description: [
      '렛츠커리어는 취업준비생과 주니어가 주도권을 가지고',
      '커리어를 결정할 수 있기를 바랍니다.',
    ],

    lineWidthClassName: 'w-[3.625rem] xl:w-20',
  },
  {
    title: 'MISSION',
    description: [
      '커리어 단계별 커리큘럼과 독자적인 콘텐츠,',
      '지속 가능한 커리어 네트워크와 커뮤니티를 제공합니다.',
    ],
    lineWidthClassName: 'w-[4.375rem] xl:w-24',
  },
];

const CARD_content = [
  {
    title: 'Reliable',
    subTitle: '신뢰; 믿고 커리어 고민을 함께해요',
    description: [
      '커리어에 필요한 팩트와 경험을 기반으로 ',
      '정보를 제공해, 취업 준비생에게 신뢰를 주는 ',
      '커리어 플랫폼입니다.',
    ],
  },
  {
    title: 'Motivating',
    subTitle: '동기부여; 함께 해내고 싶은 마음이 들게 해요',
    description: [
      '챌린지 형태를 기반으로 취업 준비생이 ',
      '포기하지 않고, 지원과 합격까지 해낼 수 있게 ',
      '동기부여하는 플랫폼입니다.',
    ],
  },
  {
    title: 'Supportive',
    subTitle: '지원; 불안감과 위화감을 조성하지 않아요',
    description: [
      '타 취업 플랫폼처럼 심리적 압박을 주지 않고, ',
      '힘이 되는 톤앤매너로 취업 준비생 ',
      '누구나 함께하는 플랫폼입니다.',
    ],
  },
];

const IntroSection = () => {
  return (
    <section className="flex flex-col px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] md:items-center xl:py-[7.5rem]">
      <AboutTitle {...title} />
      <div className="flex max-w-[62rem] flex-col gap-[3.75rem] md:gap-20 xl:mt-5">
        <div className="flex flex-col gap-[3.75rem] md:flex-row md:justify-center md:gap-10 xl:gap-[6.25rem]">
          {content.map(({ title, lineWidthClassName, description }) => (
            <div key={title} className="md:flex md:flex-col md:items-center">
              <IntroTitle
                title={title}
                lineWidthClassName={lineWidthClassName}
              />
              <p className="text-0.875 xl:text-1 mt-3 flex flex-col text-neutral-30 md:items-center">
                {description.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className="md:flex md:flex-col md:items-center">
          <IntroTitle
            title="CORE VALUE"
            lineWidthClassName="w-[6.375rem] xl:w-32"
          />
          <div className="mt-5 flex flex-col gap-10 sm:mt-8 md:flex-row md:gap-5">
            {CARD_content.map((content) => (
              <IntroCard key={content.title} {...content} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
