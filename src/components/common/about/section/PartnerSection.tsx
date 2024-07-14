import AboutTitle from '../ui/AboutTitle';

const TITLE = {
  subTitle: '커리어 파트너십',
  title: '이런 파트너들과 함께 해요',
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
    imgSize: 'h-7 w-auto',
    imgSrc: '/images/yonsei.png',
    alt: '연세대학교 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-5 w-auto',
    imgSrc: '/images/root-impact.png',
    alt: '루트임팩트 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-auto w-[3.125rem]',
    imgSrc: '/images/sggsagg.svg',
    alt: '슥삭 로고',
  },
  {
    bgColor: 'bg-[#00A58A]',
    imgSize: 'h-auto w-[3.25rem]',
    imgSrc: '/images/orang.png',
    alt: '성동 오랑 로고',
  },
  {
    bgColor: 'bg-static-100',
    imgSize: 'h-auto w-[3.34rem]',
    imgSrc: '/images/disquiet.png',
    alt: '디스콰이엇 로고',
  },
];

const PartnerSection = () => {
  return (
    <section className="bg-neutral-100 px-5 py-[3.75rem]">
      <AboutTitle subTitle={TITLE.subTitle} title={TITLE.title} />
      <div className="mt-10 grid grid-cols-2 gap-4">
        {logoList.map((logo) => (
          <div
            key={logo.imgSrc}
            className={`flex h-16 w-full items-center justify-center ${logo.bgColor} shadow-03`}
          >
            <img className={logo.imgSize} src={logo.imgSrc} alt={logo.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnerSection;
