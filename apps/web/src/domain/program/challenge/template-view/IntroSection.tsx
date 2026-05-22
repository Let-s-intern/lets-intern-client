import Description from '@/domain/program/program-detail/Description';
import IntroBubbleTail from '@/assets/icons/intro-bubble-tail.svg';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';
import { IntroSectionConfig } from './types';

const IntroBubble = ({
  children,
  align = 'left',
  backgroundColor,
  textColor,
}: {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  backgroundColor: string;
  textColor: string;
}) => {
  const base =
    'relative w-full min-w-0 max-w-full rounded-xl p-5 text-center text-xsmall14 md:min-w-0 md:max-w-full md:px-[60px] md:py-[30px] md:text-left md:text-small20 md:w-fit';
  const tailBase =
    'h-9 w-9 -bottom-5 absolute md:-bottom-9 md:h-[65px] md:w-[65px]';

  return (
    <div
      className={`${base} ${align === 'right' ? 'md:ml-auto' : ''}`}
      style={{ backgroundColor, color: textColor }}
    >
      {children}
      <IntroBubbleTail
        className={`${tailBase} ${
          align === 'right'
            ? 'right-9'
            : align === 'center'
              ? 'left-1/2 -translate-x-1/2'
              : 'left-9'
        }`}
        style={{ color: backgroundColor }}
        aria-hidden="true"
      />
    </div>
  );
};

interface Props {
  config: IntroSectionConfig;
}

function IntroSection({ config }: Props) {
  const {
    backgroundColor,
    primaryColor,
    bubbleBackgroundColor,
    bubbleTextColor,
    titleLine1,
    description,
    bubbles,
    userImageSrc,
  } = config;

  return (
    <section
      className="flex w-full scroll-mt-[56px] flex-col items-center overflow-x-hidden px-5 pb-10 pt-[60px] md:scroll-mt-[60px] md:pb-10 md:pt-[93px]"
      style={{ backgroundColor }}
    >
      <div>
        <MainTitle>
          <span>{titleLine1}</span>
          <div className="mx-auto mb-3 flex w-fit flex-col gap-1 leading-8 md:mb-2 md:flex-row md:items-center md:leading-none">
            <div className="flex w-full flex-col items-center justify-center">
              <div className="flex items-center gap-1 md:gap-1.5">
                <span>어디까지가</span>
                <div
                  className="rounded-xxs text-small20 md:text-xlarge30 -rotate-[2deg] px-2 py-1 leading-none text-neutral-100 md:px-2 md:py-0.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  제대로 된 준비
                </div>
                <span>일까요?</span>
              </div>
            </div>
          </div>
        </MainTitle>
        <Description className="mt-3 text-center md:mt-[17px]">
          {description}
        </Description>
      </div>

      <div className="mt-5 flex w-full min-w-0 flex-col items-center gap-7 md:mt-[52px] md:gap-[18px]">
        <div className="min-w[870px] flex w-full min-w-0 max-w-[990px] flex-col items-stretch gap-7 md:gap-1">
          {bubbles.map((bubble, index) => (
            <div
              key={index}
              className={`w-full min-w-0 ${index === 1 ? 'md:-mt-[90px]' : ''} ${index === 2 ? 'md:mx-auto md:mb-8 md:mt-5 md:w-fit' : ''}`}
            >
              <IntroBubble
                align={bubble.align}
                backgroundColor={bubbleBackgroundColor}
                textColor={bubbleTextColor}
              >
                {bubble.text}
              </IntroBubble>
            </div>
          ))}
        </div>
        <div
          className="h-[70px] w-[72px] bg-cover bg-center bg-no-repeat md:h-[136px] md:w-[146px]"
          style={{ backgroundImage: `url('${userImageSrc}')` }}
        />
      </div>
    </section>
  );
}

export default IntroSection;
