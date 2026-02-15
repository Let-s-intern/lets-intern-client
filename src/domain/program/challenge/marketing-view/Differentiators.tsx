import { twMerge } from '@/lib/twMerge';
import { ChallengeContent } from '@/types/interface';
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

/* 차별점 2 */
type Lecture = NonNullable<ChallengeContent['lectures']>[number];

type Professional = {
  logo: string;
  profile: string;
  week: string;
  company: string;
  role: string;
};

const ProfessionalCard = ({ item }: { item: Professional }) => {
  return (
    <div className="w-[115px] overflow-hidden rounded-xxs md:w-[280px] md:rounded-sm">
      <div
        className="relative h-[59px] overflow-hidden bg-neutral-90 md:h-40"
        role="presentation"
      >
        <img
          src={item.logo}
          className="absolute left-1 top-1 h-10 w-10 md:left-3 md:top-3 md:h-[66px] md:w-[66px]"
          alt=""
        />
        <img
          className="absolute -bottom-0.5 right-1 h-full w-auto md:right-[20%]"
          src={item.profile}
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
  );
};

const mapLecturesToProfessionals = (
  lectures?: ChallengeContent['lectures'],
): Professional[] => {
  if (!lectures || lectures.length === 0) {
    return [];
  }

  // 강의 정보가 있는 경우, 강의 데이터를 우선 사용한다.
  return lectures.map((lecture: Lecture) => ({
    logo: lecture.companyLogo,
    profile: lecture.mentorImage,
    week: lecture.schedule,
    // UI 구조상 회사명/역할 자리에 들어갈 텍스트가 필요하므로,
    // 강의 주제를 회사명 자리, 멘토명을 역할 자리에 매핑한다.
    company: lecture.topic || lecture.mentorName,
    role: lecture.mentorName,
  }));
};

export const ProfessionalsList = ({
  lectures,
}: {
  lectures?: ChallengeContent['lectures'];
}) => {
  const professionals = mapLecturesToProfessionals(lectures);
  const isThreeColumnLayout = professionals.length >= 5;

  if (professionals.length === 0) {
    return null;
  }

  if (isThreeColumnLayout) {
    // 5개 이상
    const rows: Professional[][] = [];
    for (let i = 0; i < professionals.length; i += 3) {
      rows.push(professionals.slice(i, i + 3));
    }

    return (
      <div className="mt-6 flex max-w-[1000px] flex-col gap-1 md:mt-[50px] md:gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 md:gap-3">
            {row.map((item, index) => (
              <ProfessionalCard key={`${rowIndex}-${index}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // 4개 이하
  return (
    <div className="mt-6 grid max-w-[1000px] grid-cols-2 gap-1 justify-self-center md:mt-[50px] md:gap-3">
      {professionals.map((item, index) => (
        <ProfessionalCard key={index} item={item} />
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
