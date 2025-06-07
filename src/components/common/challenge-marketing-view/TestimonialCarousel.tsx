'use client';

import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Props {
  content: string;
  highlights?: string[]; // 강조할 문장 목록
  meta: string;
}

const TestimonialCard = ({ content, highlights = [], meta }: Props) => {
  const highlightedContent = highlights.reduce((acc, phrase) => {
    return acc.replace(
      phrase,
      `<span class="text-[#2B66F6] font-semibold">${phrase}</span>`,
    );
  }, content);

  return (
    <div className="h-[282px] w-[300px] rounded-md bg-static-100 p-5 shadow-sm md:w-[371px]">
      <div className="mb-3 flex w-fit items-center rounded-xs bg-[#F0F4FF] px-2 py-1.5">
        {[...Array(5)].map((_, idx) => (
          <Image
            key={idx}
            src="/images/marketing/star.svg"
            alt="star"
            width={16}
            height={16}
          />
        ))}
      </div>
      <p
        className="h-[168px] text-[14px] leading-relaxed text-neutral-0"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
      <div className="mt-4 text-[12px] text-neutral-50">{meta}</div>
    </div>
  );
};
const testimonials = [
  {
    content:
      '제공해주신 컨텐츠에 유용한 정보들이 정말 많이 담겨있어서 도움을 많이 받을 수 있었습니다! 특히 이번에 포트폴리오는 처음 제작해봤는데 차근차근 어떤 단계를 만들어야 하고, 반드시 들어가야할 내용, 유의사항 등을 자세히 언급해주셔서 포트폴리오를 완성시킬 수 있었습니다:)',
    highlights: [
      '차근차근 어떤 단계를 만들어야 하고, 반드시 들어가야할 내용, 유의사항 등을 자세히 언급',
    ],
    meta: '경영학부 / 졸업생 / 콘텐츠마케팅 지망',
  },
  {
    content:
      '지금까지 경험했던 것들을 제대로 정리한 적이 없었는데, 이번 기회를 경험을 모두 정리할 수 있어서 가장 좋았고, 자신감이나 자존감이 높은 편이 아니라 항상 나의 강점은 무엇일지 잘 모르고 있었는데 키워드 정리나 강점 정리를 하며 이 부분에 대해서도 고민해볼 수 있어서 좋았습니다. 현직자 분께 직접 과제에 대한 피드백을 받을 수 있던 점도 좋았습니다.',
    highlights: ['키워드 정리나 강점 정리'],
    meta: '홍보광고학과 / 졸업생 / 광고기획 지망',
  },
  {
    content:
      'K-STAR-K, 3WHY 등 구체적인 방법론을 제시해줘 자소서를 작성하는 데에 부담이 덜 했습니다. 노션이나 피그마를 통해 실제 회사에 지원할 때 바로 제출해도 되는 양식을 제공한다는 점에서 좋았습니다. 저는 어떤 것을 할 때 그 일의 우수 사례나 레퍼런스를 충분히 찾아보고 시작하는 편인데, 렛츠커리어는 그런 저의 성향에 딱 맞는 프로그램이었어요!',
    highlights: [
      '작성하는 데에 부담이 덜 했습니다.',
      '우수 사례나 레퍼런스를 충분히 찾아보고 시작',
    ],
    meta: '불어불문학과 / 졸업생 / 마케팅, 영업 직무 희망',
  },
  {
    content:
      '목표였던 ‘원서와 포트폴리오의 기초 다지기’, ‘마케팅 안에서 직무/산업군 구체화하기’ 모두 성공한 것 같아요! 정말 감사드립니다',
    highlights: [
      '‘원서와 포트폴리오의 기초 다지기’',
      '‘마케팅 안에서 직무/산업군 구체화하기’ 모두 성공',
    ],
    meta: '경영학부 / 졸업생 / 콘텐츠마케팅 지망',
  },
  {
    content:
      '역시나 강제성이 부여되니 목표 달성이 한결 쉬웠습니다. 이번엔 포트폴리오 작성법도 가져갈 수 있어 더없이 좋습니다.',
    highlights: ['포트폴리오 작성법도 가져갈 수 있어 더없이 좋습니다.'],
    meta: '홍보광고학과 / 4학년 / 퍼포먼스마케터 지망',
  },
  {
    content:
      '현직자의 시선으로 경험을 파악하고 어떻게 하면 더 매력적으로 경험을 드러낼 수 있는지 배웠어요.',
    highlights: ['어떻게 하면 더 매력적으로 경험을 드러낼 수 있는지'],
    meta: '영상학과 / 졸업생 / 콘텐츠마케팅 지망',
  },
];

const TestimonialCarousel: React.FC = () => {
  return (
    <Swiper
      spaceBetween={12}
      slidesPerView={'auto'}
      centeredSlides={true}
      className="w-full"
    >
      {testimonials.map((item, idx) => (
        <SwiperSlide key={idx} className="mx-auto !w-[300px] md:!w-[371px]">
          <TestimonialCard {...item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TestimonialCarousel;
