import { Fragment } from 'react/jsx-runtime';

import twentynineCmImg from '@/assets/live-29cm.jpg';
import baeminImg from '@/assets/live-baemin.jpg';
import kakaoImg from '@/assets/live-kakao.jpg';
import longImg from '@/assets/live-long.png';
import tossbankImg from '@/assets/live-tossbank.jpg';
import universityImg from '@/assets/live-university.jpg';
import SpeechBubble from '@/domain/program/program-detail/SpeechBubble';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';

const superTitle = [
  '점점 어려워지는 채용 시장',
  '혼자서 막막했던 취업 준비',
  '다양한 멘토들이 들려주는 현업 이야기',
];
const title = [
  '막막하고 어렵게 느껴지는 취업 여정\n혼자서 준비하기 막막하셨나요?',
  '렛츠커리어 LIVE 클래스에서\n모두 해결 가능해요!',
  <Fragment key="mentor">
    렛츠커리어 LIVE 클래스에선
    <br /> 원하는 직무의 멘토에게
    <br className="md:hidden" /> 직접 물어볼 수 있어요
  </Fragment>,
];
const bubbles = [
  '아는 것도 없는데, 혼자 하는 취준 너무 막막해..',
  '친한 선배나 멘토도 없는데...물어볼 곳 없을까?',
  '취업 준비에 필요한 꿀팁들만 쏙쏙 듣고 싶어!',
  '현직자분들의 강연 어디서 듣지?',
];
const points = [
  {
    title: '실제 현직자와 합격생이\n직접 전하는 생생한 이야기',
    content: '100% 솔직한 이야기를\n들려 드려요',
    src: '/images/speech-bubble.svg',
    alt: '말풍선',
  },
  {
    title: '현직자에게 바로 전달되는\n사전 질문, 그리고 긴 Q&A 시간',
    content: '궁금증을 충분히 해결하고\n필요한 정보를 얻어가요',
    src: '/images/qna.svg',
    alt: 'Q&A',
  },
  {
    title: '갓 취업한 주니어 현직자가\n들려주는 따끈한! 취업 인사이트',
    content: '취업 트렌드가 듬뿍 반영된\n최신 인사이트를 제공해요',
    src: '/images/briefcase.svg',
    alt: '서류 가방',
  },
];
const company = [
  {
    imgSrc: tossbankImg,
    alt: '토스뱅크 브랜드 디자인 인턴의 렛츠챗',
  },
  {
    imgSrc: twentynineCmImg,
    alt: '29cm 패션 플랫폼 백엔드 개발자의 렛츠챗',
  },
  {
    imgSrc: universityImg,
    alt: '대학내일 AE와 함께하는 렛츠클래스',
  },
  {
    imgSrc: kakaoImg,
    alt: '카카오톡 IT 대기업 서비스 기획, 운영 인턴이 되기까지의 모든 것',
  },
  {
    imgSrc: baeminImg,
    alt: '배달의 민족 PM 취업 준비, 무엇을 어떻게 해야할까?',
  },
  {
    imgSrc: longImg,
    alt: '롱블랙 콘텐츠 에디터 현직자 LIVE',
  },
];

type Point = {
  title: string;
  content: string;
  src: string;
  alt: string;
};

function LiveIntro() {
  return (
    <section className="flex w-full flex-col gap-y-20 pb-[70px] md:items-center md:gap-y-52 md:pb-40">
      <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10">
        <SuperTitle className="mb-1 text-primary">{superTitle[0]}</SuperTitle>
        <Heading2>{title[0]}</Heading2>
        <div className="mt-10 flex flex-col items-center md:mt-20">
          <SpeechBubble className="-translate-x-8 -rotate-6 md:-translate-x-16">
            {bubbles[0]}
          </SpeechBubble>
          <SpeechBubble
            className="z-20 translate-x-8 translate-y-2 rotate-3 text-white md:translate-x-16 md:translate-y-4"
            tailHidden={true}
            bgColor="#4D55F5"
          >
            {bubbles[1]}
          </SpeechBubble>
          <SpeechBubble
            className="z-10 -translate-x-12 translate-y-2 -rotate-6 text-primary md:-translate-x-24 md:translate-y-6"
            tailPosition="left"
            bgColor="#E9EAFF"
          >
            {bubbles[2]}
          </SpeechBubble>
          <SpeechBubble
            className="translate-x-10 md:translate-x-20 md:translate-y-4"
            tailHidden={true}
          >
            {bubbles[3]}
          </SpeechBubble>
        </div>
      </div>

      <div className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
        <SuperTitle className="mb-1 text-primary">{superTitle[1]}</SuperTitle>
        <Heading2>{title[1]}</Heading2>
        <div className="mt-8 flex flex-col gap-3 md:mt-20 md:flex-row">
          {points.map((point, index) => (
            <PointBox key={index} index={index} point={point} />
          ))}
        </div>
      </div>

      <div className="w-ful flex max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
        <SuperTitle className="mb-1 text-primary">{superTitle[2]}</SuperTitle>
        <Heading2>{title[2]}</Heading2>
        <div className="mt-8 w-full overflow-x-hidden md:mt-20">
          <div className="flex w-fit animate-live-infinite-scroll-mobile gap-1.5 md:animate-live-infinite-scroll-desktop">
            <ImageGroup />
            <ImageGroup />
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageGroup() {
  return company.map((item) => (
    <img
      key={item.imgSrc.src}
      className="aspect-square h-auto w-56 rounded-sm bg-neutral-45 md:w-[360px]"
      src={item.imgSrc.src}
      alt={item.alt}
    />
  ));
}

function PointBox({ point, index }: { point: Point; index: number }) {
  return (
    <div
      key={index}
      className="relative flex flex-col overflow-hidden rounded-md border border-primary-20 bg-neutral-95 px-4 pb-9 pt-6 md:h-72 md:w-full"
    >
      <div className="mb-2.5 w-fit rounded-full bg-primary-90 px-2 py-1 text-xxsmall12 font-semibold text-white lg:text-xsmall14">
        Point {index + 1}
      </div>
      <span className="mb-4 block whitespace-pre text-small18 font-semibold lg:text-medium24">
        {point.title}
      </span>
      <span className="whitespace-pre break-keep text-xsmall14 font-medium text-neutral-30 lg:text-xsmall16">
        {point.content}
      </span>
      <img
        className="absolute -bottom-1 right-0 h-auto w-32 md:bottom-0 lg:w-36"
        src={point.src}
        alt={point.alt}
      />
    </div>
  );
}

export default LiveIntro;
