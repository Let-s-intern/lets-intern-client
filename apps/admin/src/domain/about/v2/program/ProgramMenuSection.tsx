import AboutTitle from '../ui/AboutTitle';
import ProgramCard from './ProgramCard';

const title = {
  subTitle: '자신만의 커리어를 설계하고 지속할 수 있는',
  mainTitle: '커리어 단계별 프로그램',
};

const content = [
  {
    title: '인턴/신입 지원 챌린지',
    bgColorClassName: 'bg-[#FF6F0F]',
    description:
      '챌린지 형태로 경험정리, 직무탐색,\n서류완성, 지원까지의 미션을 수행하며\n커리어 시작을 준비할 수 있어요.',
    link: '/program?type=CHALLENGE',
  },
  {
    title: 'LIVE/VOD 클래스',
    bgColorClassName: 'bg-[#3283FF]',
    description:
      '커리어 선배를 통해 지원부터 합격,\n그리고 직무이야기를 들을 수 있어요.',
    link: '/program?type=LIVE&type=VOD',
  },
  {
    title: '서류 피드백 REPORT',
    bgColorClassName: 'bg-secondary',
    description:
      '렛츠커리어의 취업 연구팀으로부터\n이력서/자소서에 대한 객관적인\n피드백을 받을 수 있어요.',
    link: '/report/landing/resume',
  },
];

const ProgramMenuSection = () => {
  return (
    <section className="flex flex-col overflow-hidden bg-neutral-100 px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] md:items-center xl:py-[7.5rem]">
      <AboutTitle {...title} />
      {/* Cards */}
      <div className="flex w-full max-w-[46.25rem] flex-col gap-5 md:flex-row md:justify-center md:gap-3 xl:max-w-[50rem]">
        <ProgramCard {...content[0]}>
          <img
            className="absolute -bottom-4 -right-2 h-auto w-[7.82rem] md:-right-1 md:bottom-0 lg:right-4"
            src="/icons/Union.svg"
            alt=""
          />
        </ProgramCard>
        <ProgramCard {...content[1]}>
          <img
            className="absolute -bottom-10 -right-6 h-auto w-[7.82rem] md:-bottom-2 md:-right-3 md:w-[9rem]"
            src="/icons/Exclude.svg"
            alt=""
          />
        </ProgramCard>
        <ProgramCard {...content[2]}>
          <img
            className="absolute -bottom-12 -right-10 h-auto w-[10.6rem] md:-bottom-10 md:-right-10 md:w-[12rem]"
            src="/icons/Search.svg"
            alt=""
          />
        </ProgramCard>
      </div>
    </section>
  );
};

export default ProgramMenuSection;
