import type { ReactNode } from 'react';
import { getChallengeThemeColor } from '../utils/getChallengeThemeColor';

// Constants
const CONTENT_CARD_BG_COLOR = '#FEEEE5';
const GRADIENT_BG = 'linear-gradient(41deg, #FEEEE5 23.05%, #FFBD96 100%)';
const HrPrimaryColor = getChallengeThemeColor('HR');

// Types
type ContentCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  items: ReactNode[];
};

type PortfolioBoxProps = {
  headerLabel: string;
  headerBgColor: string;
  headerTextColor: string;
  imageUrl: string;
  description: ReactNode;
  descriptionColor: string;
  descriptionFontWeight: string;
};

// Shared Components
const CheckItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-2">
    <img src="/images/hr-check.svg" alt="" aria-hidden="true" />
    <p className="text-xsmall14 md:text-medium22">{children}</p>
  </div>
);

const ContentCard = ({
  imageSrc,
  imageAlt,
  title,
  items,
}: ContentCardProps) => (
  <div
    className="flex flex-1 flex-col justify-between rounded-xl p-5 md:p-5"
    style={{ backgroundColor: CONTENT_CARD_BG_COLOR }}
  >
    <img src={imageSrc} alt={imageAlt} className="mb-9 w-full rounded-md" />
    <div>
      <h3 className="mb-3 text-small20 font-bold text-neutral-0 md:text-medium24">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <CheckItem key={index}>{item}</CheckItem>
        ))}
      </div>
    </div>
  </div>
);

// Step 1
export const Contents = () => {
  const studyItems: ReactNode[] = [
    'HR 산업에 대한 관심과 이해',
    'HR 현업의 워딩 학습',
  ];

  const missionItems: ReactNode[] = [
    <span key="mission">
      카카오 / 코드잇 / LG전자 등의 사전 과제를 <br /> 엿보고, 직업 수행하고
      피드백 받기
    </span>,
  ];

  return (
    <div className="flex w-full max-w-[1020px] flex-col gap-5 md:gap-6">
      <div className="flex w-full flex-col gap-5 md:flex-row">
        <ContentCard
          imageSrc="/images/hr-content-study.png"
          imageAlt="HR 직무 스터디 콘텐츠"
          title="HR 직무 스터디"
          items={studyItems}
        />

        <ContentCard
          imageSrc="/images/hr-content-mission.png"
          imageAlt="스페셜 미션 콘텐츠"
          title="스페셜 미션"
          items={missionItems}
        />
      </div>

      <div className="relative flex items-center rounded-xl bg-neutral-20 p-5 md:px-10 md:py-[30px]">
        <div className="flex-1">
          <h3 className="mb-2 text-small20 font-bold text-neutral-80 md:text-medium24">
            HR 직무 맞춤형 서류 작성
          </h3>
          <p className="text-xsmall14 text-neutral-85 md:text-small20">
            내가 희망하는 HR 세부 직무에 맞는 자기소개서와 포트폴리오를 완성해
            나가요
          </p>
        </div>
        <div className="hidden shrink-0 md:block">
          <img src="/images/hr-content-stair.svg" alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

// Step 2
type LectureData = {
  topic: string;
  mentorImage: string;
  mentorName: string;
  schedule: string;
  companyLogo: string;
};

const InstructorCard = ({ lecture }: { lecture: LectureData }) => (
  <div
    className="relative flex h-[260px] w-full min-w-[320px] flex-col overflow-hidden rounded-xl p-0 lg:w-[340px]"
    style={{ background: GRADIENT_BG }}
  >
    <div className="absolute right-0 top-0 z-0 pr-[19px] pt-8">
      <img
        src={lecture.mentorImage}
        alt={lecture.mentorName}
        className="h-32 w-auto md:h-[154px]"
      />
    </div>

    <div className="relative z-10 pl-4 pt-4 md:mb-[82px]">
      <img
        src={lecture.companyLogo}
        alt="소속로고"
        className="h-10 w-10 rounded-md md:h-12 md:w-12"
        aria-hidden="true"
      />
    </div>

    <div className="relative z-10 mt-auto flex flex-col gap-2 rounded-b-md bg-gradient-to-b from-[rgba(254,238,229,0.0)] to-[#FEEEE5] px-4 pb-4 tracking-tight blur-[0px] backdrop-blur-[1.5px]">
      <div
        className="flex w-fit items-center justify-center rounded-xxs px-[6px] py-[3px]"
        style={{ backgroundColor: HrPrimaryColor }}
      >
        <span className="text-xsmall12 font-medium text-neutral-100 md:text-xsmall14">
          {lecture.schedule}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h4 className="text-xsmall18 font-bold text-neutral-0 md:text-small20">
          {lecture.mentorName}
        </h4>
        <p className="text-xxsmall14 text-neutral-30 md:text-small18">
          {lecture.topic}
        </p>
      </div>
    </div>
  </div>
);

type SeminarProps = {
  lectures?: LectureData[];
};

export const Seminar = ({ lectures }: SeminarProps) => {
  const hasLectures = lectures && lectures.length > 0;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 md:gap-8">
      <div className="mx-auto w-full max-w-[900px]">
        <img
          src="/images/hr-live-seminar.gif"
          alt="HR LIVE 세미나"
          className="w-full rounded-xl"
        />
      </div>

      {hasLectures && (
        <div className="mx-auto grid w-full max-w-[1060px] grid-cols-1 place-items-center justify-center gap-5 md:gap-5 lg:grid-cols-3">
          {lectures!.map((lecture, index) => (
            <InstructorCard key={index} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
};

// Step 3
const PortfolioBox = ({
  headerLabel,
  headerBgColor,
  headerTextColor,
  imageUrl,
  description,
  descriptionColor,
  descriptionFontWeight,
}: PortfolioBoxProps) => {
  return (
    <div className="flex min-w-[320px] flex-1 flex-col">
      <div
        className="flex items-center justify-center rounded-t-sm py-[10px]"
        style={{ backgroundColor: headerBgColor }}
      >
        <span
          className="text-small20 font-semibold"
          style={{ color: headerTextColor }}
        >
          {headerLabel}
        </span>
      </div>

      <div
        className="flex flex-1 flex-col gap-4 overflow-hidden rounded-b-sm"
        style={{ border: `1px solid ${headerBgColor}` }}
      >
        <img src={imageUrl} alt={headerLabel} className="h-auto w-full" />
      </div>

      <p
        className="text-small16 mt-4 text-center font-medium md:text-small20"
        style={{ color: descriptionColor, fontWeight: descriptionFontWeight }}
      >
        {description}
      </p>
    </div>
  );
};

const PORTFOLIO_DATA = [
  {
    headerLabel: 'Before',
    headerBgColor: '#d8d8d8',
    headerTextColor: '#7A7D84',
    imageUrl: '/images/hr-portfolio-before.png',
    description: (
      <>
        캡쳐된 이미지로 경험이 나열된
        <br />
        평범한 포트폴리오
      </>
    ),
    descriptionColor: '#7A7D84',
    descriptionFontWeight: '400',
  },
  {
    headerLabel: 'After',
    headerBgColor: HrPrimaryColor,
    headerTextColor: '#FFFFFF',
    imageUrl: '/images/hr-portfolio-after.png',
    description: (
      <>
        문제와 해결 전략, 성과까지
        <br />
        핵심 역량이 돋보이는 포트폴리오
      </>
    ),
    descriptionColor: '#000000',
    descriptionFontWeight: '600',
  },
] as const;

export const Portfolio = () => {
  return (
    <div className="flex w-full max-w-[1020px] flex-col items-center justify-center gap-5 md:flex-row md:gap-3">
      {PORTFOLIO_DATA.map((data) => (
        <PortfolioBox key={data.headerLabel} {...data} />
      ))}
    </div>
  );
};
