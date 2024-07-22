import AboutTitle from '../../ui/AboutTitle';
import ProgramCard from './ProgramCard';

const title = {
  subTitle: '자신만의 커리어를 설계하고 지속할 수 있는',
  mainTitle: '커리어 단계별 프로그램',
};

const content = [
  {
    title: '인턴/신입 지원 챌린지',
    bgColorClassName: 'bg-[#FF6F0F]',
    alt: '인턴/신입 지원 챌린지 이동 아이콘',
    description: [
      '챌린지 형태로 경험정리, 직무탐색,',
      '서류완성, 지원까지의 미션을 수행하며',
      '커리어 시작을 준비할 수 있어요.',
    ],
    link: '/program?type=CHALLENGE',
  },
  {
    title: 'LIVE/VOD 클래스',
    bgColorClassName: 'bg-[#3283FF]',
    alt: 'LIVE/VOD 클래스 이동 아이콘',
    description: [
      '커리어 선배를 통해 지원부터 합격,',
      '그리고 직무이야기를 들을 수 있어요.',
    ],
    link: '/program?type=LIVE',
  },
];

const ProgramMenuSection = () => {
  return (
    <section className="flex flex-col overflow-hidden bg-neutral-100 px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] md:items-center xl:py-[7.5rem]">
      <AboutTitle {...title} />
      {/* Cards */}
      <div className="flex w-full max-w-[46.25rem] flex-col gap-5 md:flex-row md:justify-center md:gap-10 xl:max-w-[50rem]">
        <ProgramCard {...content[0]}>
          <img
            className="absolute -bottom-14 -right-2 h-full w-[7.82rem] md:-bottom-8 md:-right-1 lg:right-4"
            src="/icons/Union.svg"
          />
        </ProgramCard>
        <ProgramCard {...content[1]}>
          <img
            className="absolute -bottom-16 -right-6 h-full w-[7.82rem] md:-bottom-12 md:-right-2 lg:-bottom-10 lg:right-0"
            src="/icons/Exclude.svg"
          />
        </ProgramCard>
      </div>
    </section>
  );
};

export default ProgramMenuSection;
