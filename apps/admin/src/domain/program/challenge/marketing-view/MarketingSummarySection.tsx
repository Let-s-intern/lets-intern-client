import React from 'react';
import MainTitle from '../ui/MainTitle';

const summaryItems = [
  {
    title: '현직자 피드백과 함께\n마케팅 서류의 A-Z를 분석해요.',
    description: '콘텐츠 마케터 / 그로스 마케터 /\n마케팅 전략 / AE',
    icon: '/images/marketing/summary-icon1.svg',
  },
  {
    title: '8회에 걸친 클래스로\n마케팅 필수 역량과 서류 작성 역량까지',
    description:
      '현직자의 GA / Figma / Meta 실습 Class\n+ 스타트업 CMO의 Hidden Track',
    icon: '/images/marketing/summary-icon2.svg',
  },
  {
    title: '렛츠커리어 합격 자료와 함께\n따라오기만 해도 서류 완성!',
    description:
      '반복적인 서류 제출이 아닌\n진짜 합격이 가능한 서류를 제공합니다.',
    icon: '/images/marketing/summary-icon3.svg',
  },
  {
    title: '현직자 상주 커뮤니티에서\n무엇이든 물어보세요!',
    description: '단 {WEEK_TEXT}간 제공되는,\n무제한 질의응답 커뮤니티',
    icon: '/images/marketing/summary-icon4.svg',
  },
];

const SummaryItem = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="rounded-xs flex flex-row items-center gap-5 bg-white p-5 md:flex-col md:items-start md:gap-4 md:p-6">
      <div className="mb-2 shrink-0 md:mb-0 md:h-12 md:w-12">
        <img
          src={icon}
          alt=""
          className="h-[42px] w-[42px] md:h-[54px] md:w-[54px]"
        />
      </div>
      <div className="flex flex-col gap-1 text-left">
        <div className="text-xsmall16 text-neutral-10 md:text-small20 whitespace-pre-line font-bold">
          {title}
        </div>
        <div className="text-xsmall14 text-neutral-30 md:text-small18 whitespace-pre-line">
          {description}
        </div>
      </div>
    </div>
  );
};

interface MarketingSummarySectionProps {
  weekText: string;
}

const MarketingSummarySection: React.FC<MarketingSummarySectionProps> = ({
  weekText,
}) => {
  const replacedSummaryItems = summaryItems.map((item) => ({
    ...item,
    description: item.description.replace('{WEEK_TEXT}', weekText),
  }));

  return (
    <section className="flex flex-col items-center bg-[#F1F4FF] px-5 pb-12 pt-[60px] text-center md:px-0 md:pb-[120px] md:pt-[100px]">
      <div className="text-xsmall16 md:text-small20 mb-2 font-bold text-[#4A76FF] md:mb-3">
        렛츠커리어의 심기일전!
      </div>
      <MainTitle className="mb-6">
        렛츠커리어는 취업의 <br className="md:hidden" />
        <span className="text-bold text-medium22 md:text-xlarge30 mx-1 bg-[#4A76FF] px-2 py-1 text-white">
          합격의 순간
        </span>
        까지 함께합니다.
        <br className="md:hidden" />
        <br />단 {weekText}의 챌린지로{` `}
        <br className="md:hidden" />
        서류는 정말 끝내봐요!
      </MainTitle>

      {/* 위 2개 (2열) */}
      <div className="mb-2.5 grid w-full max-w-[1000px] grid-cols-1 gap-2.5 md:grid-cols-2">
        {replacedSummaryItems.slice(0, 2).map((item, idx) => (
          <SummaryItem key={idx} {...item} />
        ))}
      </div>

      {/* 아래 3개 (3열) */}
      <div className="grid w-full max-w-[1000px] grid-cols-1 gap-2.5 md:grid-cols-2">
        {replacedSummaryItems.slice(2).map((item, idx) => (
          <SummaryItem key={idx + 2} {...item} />
        ))}
      </div>
    </section>
  );
};

export default MarketingSummarySection;
