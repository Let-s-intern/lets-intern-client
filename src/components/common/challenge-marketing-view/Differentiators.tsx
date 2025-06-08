import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';

/* 차별점 1 */
export const MarketingTool = () => {
  return (
    <div className="md:mt[42px] mt-6 flex flex-col gap-2 md:gap-2.5">
      <div className="flex w-full min-w-60 flex-1 flex-col items-center justify-center gap-3 rounded-xs bg-white p-4 md:max-w-[696px] md:flex-row md:gap-6 md:rounded-sm md:p-8">
        <div className="h-fit w-full rounded-[4.5px] bg-neutral-90 md:max-w-[270px] md:rounded-sm">
          <picture>
            <source
              srcSet="/images/marketing-point1-mobile.png"
              media="(orientation: portrait)"
            />
            <Image
              src="/images/marketing-point1-desktop.svg"
              alt="필요한 마케팅 역량(피그마, Google Analytics, Meta)을 보여주는 이미지"
              unoptimized
              width={270}
              height={158}
              className="object-cover"
            />
          </picture>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 md:items-start md:gap-2">
          <div className="rounded-xxs bg-black px-2 py-[0.188rem] text-xxsmall12 font-medium text-white md:text-small18">
            마케터에게 필요한 역량만 쏙쏙!
          </div>
          <div className="text-center text-xsmall16 md:text-left md:text-medium24">
            <span className="font-medium">3회의 마케터 실무 역량 Class</span>
            <br />
            <span className="text-nowrap font-semibold">
              + 스타트업 CMO의 Hidden Track
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-[114px] w-full min-w-60 flex-1 items-center justify-center gap-3 rounded-xs bg-white p-4 md:h-[164px] md:max-w-[696px] md:gap-5 md:rounded-sm md:p-8">
        <img
          className="h-auto w-[88px] md:w-[144px]"
          src="/logo/logo.svg"
          alt=""
        />
        <p className="text-xsmall16 font-semibold md:text-center md:text-medium24">
          <span className="text-neutral-0">
            4000명 이상, 서류 피드백 및 합격 노하우를{' '}
            <br className="hidden md:block" />
            보유한
          </span>{' '}
          <br className="md:hidden" />
          <span className="text-primary">렛츠커리어 합격 데이터까지!</span>
        </p>
      </div>
    </div>
  );
};

/** 차별점 2 */
const professionals = [
  {
    logo: 'naver-webtoon.png',
    profile: 'profile1.png',
    week: '6월 3주차',
    company: '네이버웹툰',
    role: '퍼포먼스 마케터',
  },
  {
    logo: 'cashnote.png',
    profile: 'profile4.png',
    week: '6월 4주차',
    company: '캐시노트',
    role: '그로스 마케터',
  },
  {
    logo: 'class101.png',
    profile: 'profile2.png',
    week: '7월 1주차',
    company: '클래스 101',
    role: '콘텐츠 마케터',
  },
  {
    logo: 'yanolja.png',
    profile: 'profile3.png',
    week: '7월 2주차',
    company: '야놀자',
    role: 'CRM 마케터',
  },
  {
    logo: 'corpuniv.png',
    profile: 'profile5.png',
    week: '7월 3주차',
    company: '대학내일',
    role: 'AE마케터',
  },
];

export const ProfessionalsList = () => {
  return (
    <div className="mt-6 flex max-w-[1000px] flex-wrap justify-center gap-1 md:mt-[50px] md:gap-3">
      {professionals.map((item, index) => (
        <div
          key={index}
          className="w-[104px] overflow-hidden rounded-xxs md:w-[280px] md:rounded-sm"
        >
          <div
            className="relative h-[59px] overflow-hidden bg-neutral-90 md:h-40"
            role="presentation"
          >
            <img
              src={`/images/marketing/${item.logo}`}
              className="absolute left-1 top-1 h-10 w-10 md:left-3 md:top-3 md:h-[66px] md:w-[66px]"
              alt=""
            />
            <img
              className="absolute -bottom-0.5 right-1 h-full w-auto md:right-[20%]"
              src={`/images/marketing/${item.profile}`}
              alt=""
            />
          </div>
          <div className="flex flex-col items-center justify-center bg-white px-2 py-3 md:p-5">
            <div className="mb-0.5 rounded-[2px] bg-black px-1 py-0.5 text-center text-[0.5rem] font-medium text-white md:mb-2 md:rounded-xxs md:px-1.5 md:py-[3px] md:text-xsmall14">
              {item.week}
            </div>
            <div className="text-base font-bold text-neutral-0 md:mb-1 md:text-medium24">
              {item.company}
            </div>
            <div className="text-xxsmall12 text-neutral-0 md:text-small20">
              {item.role}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/** 차별점 3 */

const changes = [
  {
    label: 'Before',
    image: 'before.png',
    description: '캡쳐된 이미지로 경험이 나열된\n평범한 포트폴리오',
    labelClassName: 'bg-neutral-75 text-neutral-40',
    descriptionClassName: 'text-white/75',
  },
  {
    label: 'After',
    image: 'after.png',
    description: '문제와 해결 전략, 성과까지\n핵심 역량이 돋보이는 포트폴리오',
    labelClassName: 'bg-[#4A76FF] text-white',
    descriptionClassName: 'text-white font-semibold',
  },
];

export const PortfolioChange = () => {
  return (
    <div className="mt-6 flex w-full max-w-[1000px] flex-col items-stretch gap-3 md:mt-[42px] md:flex-row">
      {changes.map((item) => (
        <div
          key={item.label}
          className="flex flex-1 flex-col items-center gap-1.5 md:gap-5"
        >
          <div className="w-full overflow-hidden rounded-xs md:rounded-sm">
            <div
              className={twMerge(
                'w-full p-2 text-center text-xsmall14 font-semibold md:text-small20',
                item.labelClassName,
              )}
            >
              {item.label}
            </div>
            <div className="relative aspect-video w-full object-cover md:h-[278px]">
              <Image
                src={`/images/marketing/${item.image}`}
                alt={item.description}
                unoptimized
                fill
                className="absolute object-cover"
                sizes="100vw"
              />
            </div>
          </div>
          <p
            className={twMerge(
              'whitespace-pre-line text-center text-base md:text-small20',
              item.descriptionClassName,
            )}
          >
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};
