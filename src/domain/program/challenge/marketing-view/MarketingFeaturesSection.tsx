import SectionSubHeader from '@/common/header/SectionSubHeader';
import React, { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';

const badges = ['콘텐츠', '마케팅 전략', '그로스', 'AE'];

const cards = [
  {
    title: '마케팅 실무 역량 Class',
    description: (
      <>
        Figma, Google Analytics 등 <br />
        취업에 필요한 역량을 모두 담았어요.
        <br />+ 스타트업 CMO의 Special Track까지!
      </>
    ),
    mobileImg: 'marketing-point1-mobile.png',
    desktopImg: 'marketing-point1-desktop.svg',
    alt: '필요한 마케팅 역량(피그마, Google Analytics, Meta)을 보여주는 이미지',
  },
  {
    title: '현직자 피드백',
    description: (
      <>
        마케팅 현직자와의 <br />
        무제한 질의응답 + 피드백으로 <br />
        확실하게 궁금증을 해결해요.
      </>
    ),
    mobileImg: 'marketing-point2-mobile2.png',
    desktopImg: 'marketing-point2-desktop2.png',
    alt: '현직자 회사 로고(대학내일, 야놀자, 클래스101 등) 이미지',
  },
  {
    title: '챌린지를 통한 서류 완성',
    description: (
      <>
        채용 공고에 바로 지원이 <br />
        가능하도록, 수준급의 서류를 <br />
        무조건 완성해요.
      </>
    ),
    mobileImg: 'marketing-point3-mobile.png',
    desktopImg: 'marketing-point3-desktop.png',
    alt: '서류 작성하고 1차 면접 합격 메일을 받은 이미지',
  },
];

const Badge = ({ text }: { text: string }) => {
  return (
    <div className="bg-[#4A76FF] px-2 py-1 text-small18 font-bold text-white md:px-3 md:text-xlarge30">
      {text}
    </div>
  );
};

const Card = ({
  title,
  description,
  index,
  desktopImg,
  mobileImg,
  alt,
}: {
  title: string;
  description: ReactNode;
  index: number;
  desktopImg: string;
  mobileImg: string;
  alt: string;
}) => {
  return (
    <div className="relative flex w-full min-w-60 flex-1 flex-col items-center justify-center gap-3 rounded-xs bg-white p-4 md:rounded-sm md:px-6 md:py-11">
      <div className="absolute -top-2.5 left-5 -rotate-12 rounded-xxs bg-[#2CB2FF] px-3 py-1.5 text-xsmall16 font-semibold text-white md:-top-7 md:px-4 md:py-2 md:text-small18">
        Point {index}
      </div>
      <div className="flex h-fit w-full items-center justify-center rounded-[4.5px] border border-neutral-80 bg-neutral-90 p-3">
        <picture className="flex justify-center">
          <source
            srcSet={`/images/${mobileImg}`}
            media="(orientation: portrait)"
          />
          <img
            className="mx-auto object-cover"
            src={`/images/${desktopImg}`}
            alt={alt}
          />
        </picture>
      </div>
      <div className="mt-0.5 flex flex-col items-center justify-center gap-1.5 text-neutral-0 md:mt-6 md:gap-2">
        <div className="text-small18 font-bold md:text-medium24">{title}</div>
        <div className="text-xsmall14 md:text-xsmall16">{description}</div>
      </div>
    </div>
  );
};

const MarketingFeaturesSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center bg-black pb-[70px] pt-[50px] text-center md:pb-28 md:pt-32">
      <div className="flex flex-col">
        <SectionSubHeader className="mb-2 text-[#7E9DFF] md:mb-3">
          그 고민, 현직자와 함께 해결해요!
        </SectionSubHeader>
        <MainTitle className="flex flex-col items-center gap-1">
          <span className="text-white">
            누적 4,000건 이상의 피드백, <br />
            수차례의 챌린지 운영 노하우를 집약해
          </span>
          <span className="gradient-text bg-gradient-to-r from-[#7FDDFF] to-[#7395FF]">
            단 4주 만에 끝내는 <br className="md:hidden" />
            실전형 커리큘럼을 설계했습니다.
          </span>
        </MainTitle>
      </div>

      <div
        className="flex flex-col items-center gap-4 py-7 md:py-9"
        aria-hidden="true"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-white/45" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/45" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/45" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center justify-center gap-1.5">
          {badges.map((text) => (
            <Badge key={text} text={text} />
          ))}
        </div>
        <MainTitle className="text-white">
          현직자 피드백과 강의로 <br className="md:hidden" />
          필요한 마케터 역량을 배우고, <br />
          챌린지를 통해 서류 완성까지 한 번에!
        </MainTitle>
      </div>

      {/* 카드 섹션 */}
      <div className="mt-8 flex w-full max-w-[1000px] flex-col gap-7 px-5 md:mt-16 md:flex-row md:gap-3 md:px-0">
        {cards.map((item, index) => (
          <Card key={index} index={index + 1} {...item} />
        ))}
      </div>
    </section>
  );
};

export default MarketingFeaturesSection;
