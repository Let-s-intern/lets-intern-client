import { Link } from 'react-router-dom';

const CONTENT = [
  {
    title: '인턴/신입 지원 챌린지',
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
    <section className="overflow-hidden bg-neutral-100 px-5 py-[3.75rem]">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-1-bold text-neutral-40">
          자신만의 커리어를 설계하고 지속할 수 있는
        </span>
        <h1 className="text-1.25-bold">커리어 단계별 프로그램</h1>
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-5">
        <Link
          to={CONTENT[0].link}
          className="relative h-44 rounded-xl bg-[#FF6F0F] px-6 pt-7"
        >
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-1-bold text-neutral-100">{CONTENT[0].title}</h2>
            <img src="/icons/Caret_Circle_Right.svg" alt={CONTENT[0].alt} />
          </div>
          <p className="text-0.875-medium flex flex-col text-static-100/90">
            {CONTENT[0].description.map((desc) => (
              <span key={desc}>{desc}</span>
            ))}
          </p>
          <img
            className="absolute -bottom-14 -right-2 h-full w-[7.82rem]"
            src="/icons/Union.svg"
          />
        </Link>
        <Link
          to={CONTENT[1].link}
          className="relative h-44 rounded-xl bg-[#3283FF] px-6 pb-[3.25rem] pt-7"
        >
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-1-bold text-neutral-100">{CONTENT[1].title}</h2>
            <img src="/icons/Caret_Circle_Right.svg" alt={CONTENT[1].alt} />
          </div>
          <p className="text-0.875-medium flex flex-col text-static-100/90">
            {CONTENT[1].description.map((desc) => (
              <span key={desc}>{desc}</span>
            ))}
          </p>
          <img
            className="absolute -bottom-16 -right-6 h-full w-[7.82rem]"
            src="/icons/Exclude.svg"
          />
        </Link>
      </div>
    </section>
  );
};

export default ProgramMenuSection;
