import AboutTitle from '../ui/AboutTitle';

const title = {
  subTitle: '커리어 파트너십',
  mainTitle: '이런 파트너들과 함께 해요',
};

const logoList = [
  {
    bgColor: 'bg-[#FF4200]',
    imgSize: 'h-full w-auto',
    imgSrc: '/images/impact-career.png',
    alt: '임팩트닷커리어 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-7 w-auto sm:h-[3.7rem]',
    imgSrc: '/images/yonsei.png',
    alt: '연세대학교 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-5 w-auto sm:h-10',
    imgSrc: '/images/root-impact.png',
    alt: '루트임팩트 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-auto sm:w-24 w-[3.125rem]',
    imgSrc: '/images/sggsagg.svg',
    alt: '슥삭 로고',
  },
  {
    bgColor: 'bg-[#00A58A]',
    imgSize: 'h-auto sm:w-[6.7rem]  w-[3.25rem]',
    imgSrc: '/images/orang.png',
    alt: '성동 오랑 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-auto sm:w-[6.45rem] w-[3.34rem]',
    imgSrc: '/images/disquiet.png',
    alt: '디스콰이엇 로고',
  },
];

interface PartnerCardProps {
  logo: {
    bgColor: string;
    imgSize: string;
    imgSrc: string;
    alt: string;
  };
}

const PartnerSection = () => {
  return (
    <section className="flex flex-col bg-neutral-100 px-5 py-[3.75rem] sm:px-10 sm:py-[6.25rem] md:items-center xl:py-[8.75rem]">
      <AboutTitle {...title} />
      <div className="grid grid-cols-2 gap-4">
        {logoList.map((logo) => (
          <PartnerCard key={logo.imgSrc} logo={logo} />
        ))}
      </div>
    </section>
  );
};

const PartnerCard = ({ logo }: PartnerCardProps) => {
  return (
    <div
      key={logo.imgSrc}
      className={`flex h-16 w-full items-center justify-center sm:h-[8.25rem] md:w-[22rem] ${logo.bgColor} shadow-03`}
    >
      <img className={logo.imgSize} src={logo.imgSrc} alt={logo.alt} />
    </div>
  );
};

export default PartnerSection;
