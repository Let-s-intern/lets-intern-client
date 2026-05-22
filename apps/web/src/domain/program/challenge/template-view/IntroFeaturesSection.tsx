import SectionHeader from '@/common/header/SectionHeader';
import { ChallengeContent } from '@/types/interface';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';
import { FeatureCardConfig, IntroFeaturesSectionConfig } from './types';

const Card = ({
  title,
  description,
  index,
  desktopImg,
  mobileImg,
  alt,
  primaryColor,
  cardGradient,
}: FeatureCardConfig & {
  index: number;
  primaryColor: string;
  cardGradient: string;
}) => {
  return (
    <div
      className="relative flex w-full min-w-60 flex-1 flex-col items-center justify-center overflow-hidden rounded-md px-[34px] py-[34.5px]"
      style={{ background: cardGradient }}
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
        <div
          className="text-xsmall16 md:text-small18 flex w-fit items-center justify-center rounded-md px-[14px] py-[6px] font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Point {index}
        </div>

        <div className="text-small18 text-neutral-0 md:text-medium24 mt-[18px] text-center font-bold">
          {title}
        </div>

        <div className="min-h-[97px] flex-1" />

        <div
          className="text-xsmall16 text-neutral-0 md:text-small18 text-center"
          style={{ letterSpacing: '-0.022px' }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

interface Props {
  config: IntroFeaturesSectionConfig;
  content: ChallengeContent | null;
}

function IntroFeaturesSection({ config, content }: Props) {
  const weekText = content?.challengePoint?.weekText ?? '3주';
  const { getTitle, description, cards, primaryColor, cardGradient } = config;

  return (
    <section
      id="intro"
      className="flex scroll-mt-[56px] flex-col items-center pb-[70px] pt-[50px] text-center md:scroll-mt-[60px] md:pb-[82px] md:pt-[141px]"
    >
      <div className="flex flex-col">
        <SectionHeader className="mb-6 w-full text-left md:mb-[42px] md:text-center">
          챌린지 소개
        </SectionHeader>
        <MainTitle className="flex flex-col items-center gap-1">
          {getTitle(weekText)}
        </MainTitle>
        <div className="text-small14 text-neutral-0 md:text-small18 mt-3 md:mt-5 md:text-center">
          {description}
        </div>
      </div>

      <div className="flex w-full max-w-[1132px] flex-col gap-5 px-5 py-[53px] md:flex-row md:gap-5 md:px-0">
        {cards.map((item, index) => (
          <Card
            key={index}
            index={index + 1}
            primaryColor={primaryColor}
            cardGradient={cardGradient}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}

export default IntroFeaturesSection;
