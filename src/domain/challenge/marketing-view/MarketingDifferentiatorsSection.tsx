import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';
import {
  MarketingTool,
  PortfolioChange,
  ProfessionalsList,
} from './Differentiators';

const differentiators = [
  {
    title: '마케팅 실무 역량 Class',
    description: (
      <>
        신입 마케터가 가장 막히는 실무 툴, <br className="md:hidden" />단 3회
        수업으로 한 번에 끝냅니다.
      </>
    ),
    visualExplanation: <MarketingTool />,
  },
  {
    title: (
      <>
        모든 마케터의 현직자 특강부터 <br className="md:hidden" />
        실시간 피드백까지
      </>
    ),
    description: (
      <>
        현직자와 직접 만나 질문하고, 피드백받고, 성장하는 4주 <br />
        마케터가 되기 위해 필요한 경험, 역량, 프로젝트가
        <br className="md:hidden" /> 무엇인지 현직자 시선에서 알아가세요.
      </>
    ),
    visualExplanation: <ProfessionalsList />,
  },
  {
    title: (
      <>
        4주 안에 서류 완성, <br className="md:hidden" />단 하나의 코스로 끝
      </>
    ),
    description:
      '4주 안에 경험 정리, 자소서, 포트폴리오까지\n마케팅 직무에 꼭 맞는 서류를 한 번에 완성하세요.',
    visualExplanation: <PortfolioChange />,
  },
];

const Badge = ({ index }: { index: number }) => {
  return (
    <div className="flex h-8 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#7FDDFF] to-[#7395FF] md:h-[38px] md:w-[92px]">
      <div className="flex h-[28px] w-[76px] items-center justify-center rounded-full bg-[#060C1D] leading-none md:h-[34px] md:w-[88px]">
        <span className="gradient-text bg-gradient-to-b from-[#7FDDFF] to-[#8FAAFF] text-xsmall14 font-bold md:text-small18 md:font-semibold">
          차별점 {index}
        </span>
      </div>
    </div>
  );
};

const Differentiator = ({
  index,
  title,
  description,
  visualExplanation,
}: {
  index: number;
  title: ReactNode;
  description: ReactNode;
  visualExplanation: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center">
      <Badge index={index} />
      <MainTitle className="mb-1 mt-5 text-white md:mb-1.5">{title}</MainTitle>
      <p className="whitespace-pre-line text-center text-xsmall14 font-normal text-white/85 md:text-small20">
        {description}
      </p>
      {visualExplanation}
    </div>
  );
};

const MarketingDifferentiatorsSection: React.FC = () => {
  return (
    <section className="flex w-full scroll-mt-[56px] flex-col items-center gap-14 bg-gradient-to-b from-black to-[#132356] px-5 pb-[70px] md:scroll-mt-[60px] md:gap-[68px] md:px-0 md:pb-[140px]">
      {differentiators.map((item, index) => (
        <article key={index} className="w-full max-w-[1440px]">
          <Differentiator index={index + 1} {...item} />
        </article>
      ))}
    </section>
  );
};

export default MarketingDifferentiatorsSection;
