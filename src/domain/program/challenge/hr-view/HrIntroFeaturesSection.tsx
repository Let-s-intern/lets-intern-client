import SectionHeader from '@/common/header/SectionHeader';
import React, { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';

const cards = [
  {
    title: <>HR 직무 구조 이해</>,
    description: (
      <>
        HRM·HRD·채용 등 세부 직무를 <br />
        역할과 업무 기준으로 구조화해 <br />
        이해할 수 있어요.
      </>
    ),
    mobileImg: 'hr-point1-desktop.png',
    desktopImg: 'hr-point1-desktop.png',
    alt: 'HR 직무 구조 이해를 보여주는 이미지',
  },
  {
    title: (
      <>
        채용 공고 기반 <br />
        나만의 스토리 정리
      </>
    ),
    description: (
      <>
        채용 공고를 기준으로 <br />
        내 경험을 HR이 원하는 역량 스토리로 <br />
        재정리해요.
      </>
    ),
    mobileImg: 'hr-point2-desktop.png',
    desktopImg: 'hr-point2-desktop.png',
    alt: '채용 공고 기반 나만의 스토리 정리를 보여주는 이미지',
  },
  {
    title: (
      <>
        자기소개서 & 포트폴리오 <br />
        결과물 완성
      </>
    ),
    description: (
      <>
        미션과 피드백을 통해 <br />
        지원에 바로 활용 가능한 결과물을 <br />
        완성해요.
      </>
    ),
    mobileImg: 'hr-point3-desktop.png',
    desktopImg: 'hr-point3-desktop.png',
    alt: '서류 작성하고 1차 면접 합격 메일을 받은 이미지',
  },
];

const Card = ({
  title,
  description,
  index,
  desktopImg,
  mobileImg,
  alt,
}: {
  title: ReactNode;
  description: ReactNode;
  index: number;
  desktopImg: string;
  mobileImg: string;
  alt: string;
}) => {
  return (
    <div
      className="relative flex w-full min-w-60 flex-1 flex-col items-center justify-center overflow-hidden rounded-md px-[34px] py-[34.5px]"
      style={{
        background: 'linear-gradient(180deg, #FEF4EF 0%, #FEE6D8 100%)',
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <picture className="mb-[34px] flex items-end justify-center">
          <source
            srcSet={`/images/${mobileImg}`}
            media="(orientation: portrait)"
          />
          <img
            className="object-cover object-center"
            src={`/images/${desktopImg}`}
            alt={alt}
            aria-hidden="true"
          />
        </picture>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center">
        <div className="flex w-fit items-center justify-center rounded-md bg-[#FF5E00] px-[14px] py-[6px] text-xsmall16 font-semibold text-white md:text-small18">
          Point {index}
        </div>

        <div className="mt-[18px] text-center text-small18 font-bold text-neutral-0 md:text-medium24">
          {title}
        </div>

        <div className="min-h-[97px] flex-1" />

        <div
          className="text-center text-xsmall16 text-neutral-0 md:text-small18"
          style={{ letterSpacing: '-0.022px' }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const HrIntroFeaturesSection: React.FC = () => {
  return (
    <section
      id="intro"
      className="flex flex-col items-center pb-[70px] pt-[50px] text-center md:pb-[82px] md:pt-[141px]"
    >
      <div className="flex flex-col">
        <div className="text-small16 mb-5 text-neutral-35 md:mt-5 md:text-center md:text-small18">
          HR 직무를 준비 하면서 어떤 고민들을 가지고 계셨나요?
        </div>
        <MainTitle className="mb-[180px] flex flex-col items-center gap-1">
          <span>HR/인사 직무 챌린지,</span>
          <span>이런 분들에게 추천드려요</span>
        </MainTitle>
        <SectionHeader className="mb-6 md:mb-[42px]">
          프로그램 소개
        </SectionHeader>

        <MainTitle className="flex flex-col items-center gap-1">
          <div>
            <span className="text-[#FF5E00]">3주 만에</span>{' '}
            <span>HR 직무 이해부터</span>
          </div>
          <div>
            <span>자기소개서·포트폴리오까지 완성해요!</span>
          </div>
        </MainTitle>
        <div className="text-small16 mt-3 text-neutral-0 md:mt-5 md:text-center md:text-small18">
          막연한 HR 관심에서 끝나지 않도록, 직무 탐색부터 경험 정리, 결과물
          완성까지 함께합니다.
        </div>
      </div>

      {/* 카드 섹션 */}
      <div className="flex w-full max-w-[1132px] flex-col gap-5 px-5 py-[53px] md:flex-row md:gap-5 md:px-0">
        {cards.map((item, index) => (
          <Card key={index} index={index + 1} {...item} />
        ))}
      </div>

      <div className="text-small14 md:text-small16 text-center text-neutral-40">
        <p>본 프로그램은 서류 준비의 기초가 되는 경험정리를 다룹니다.</p>
        <p>
          이력서, 자기소개서, 포트폴리오 프로그램에 앞서 수강하기를
          권장드립니다.
        </p>
      </div>
    </section>
  );
};

export default HrIntroFeaturesSection;
