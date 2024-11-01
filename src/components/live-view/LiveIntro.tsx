import { ReactNode } from 'react';
import { IoTriangleSharp } from 'react-icons/io5';

import { twMerge } from '@/lib/twMerge';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

const superTitle = [
  '점점 어려워지는 채용 시장',
  '혼자서 막막했던 취업 준비',
  '원하는 직무로의 취업 준비',
];
const title = [
  '막막하고 어렵게 느껴지는 취업 여정\n혼자서 준비하기 막막하셨나요?',
  '렛츠커리어 LIVE 클래스에서\n모두 해결 가능해요!',
  '렛츠커리어 LIVE 클래스에서\n모두 해결 가능해요!',
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

type Point = {
  title: string;
  content: string;
  src: string;
  alt: string;
};

function LiveIntro() {
  return (
    <section className="py-20">
      <SuperTitle className="mb-1 text-primary">{superTitle[0]}</SuperTitle>
      <Heading2>{title[0]}</Heading2>
      <div className="mb-20 mt-10 flex flex-col items-center">
        <SpeechBubble className="-translate-x-8 -rotate-6">
          {bubbles[0]}
        </SpeechBubble>
        <SpeechBubble
          className="z-20 translate-x-8 translate-y-2 rotate-3 text-white"
          tailHidden={true}
          bgColor="#4D55F5"
        >
          {bubbles[1]}
        </SpeechBubble>
        <SpeechBubble
          className="z-10 -translate-x-12 translate-y-2 -rotate-6 text-primary"
          tailPosition="left"
          bgColor="#E9EAFF"
        >
          {bubbles[2]}
        </SpeechBubble>
        <SpeechBubble className="translate-x-10" tailHidden={true}>
          {bubbles[3]}
        </SpeechBubble>
      </div>

      <SuperTitle className="mb-1 text-primary">{superTitle[1]}</SuperTitle>
      <Heading2>{title[1]}</Heading2>
      <div className="mb-20 mt-8 flex flex-col gap-3">
        {points.map((point, index) => (
          <PointBox key={index} index={index} point={point} />
        ))}
      </div>

      <SuperTitle className="mb-1 text-primary">{superTitle[2]}</SuperTitle>
      <Heading2>{title[2]}</Heading2>
      <div className="-mx-5 mt-8 overflow-x-auto px-5 md:-mx-10 md:px-10 xl:-mx-52 xl:px-52">
        <div className="flex w-fit gap-1.5">
          <img className="h-56 w-56 bg-neutral-45" src="" alt="" />
          <img className="h-56 w-56 bg-neutral-45" src="" alt="" />
          <img className="h-56 w-56 bg-neutral-45" src="" alt="" />
          <img className="h-56 w-56 bg-neutral-45" src="" alt="" />
        </div>
      </div>
    </section>
  );
}

function SpeechBubble({
  className,
  children,
  bgColor,
  tailPosition = 'right',
  tailHidden = false,
}: {
  className?: string;
  children?: ReactNode;
  bgColor?: string;
  tailPosition?: 'left' | 'right';
  tailHidden?: boolean;
}) {
  return (
    <div
      className={twMerge(
        'min-w-50 relative w-fit rounded-full bg-neutral-90 px-8 py-4 text-xxsmall12 font-semibold text-neutral-0',
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      {children}
      {!tailHidden && (
        <IoTriangleSharp
          className={twMerge(
            'absolute -bottom-4',
            tailPosition === 'right'
              ? 'right-8 -rotate-90'
              : 'left-8 rotate-90',
          )}
          size={32}
          color={bgColor ? bgColor : '#F3F3F3'}
        />
      )}
    </div>
  );
}

function PointBox({ point, index }: { point: Point; index: number }) {
  return (
    <div
      key={index}
      className="relative flex flex-col rounded-md border border-primary-20 bg-neutral-95 px-4 pb-9 pt-6"
    >
      <div className="mb-2.5 w-fit rounded-full bg-primary-90 px-2 py-1 text-xxsmall12 font-semibold text-white">
        Point {index + 1}
      </div>
      <span className="mb-4 block whitespace-pre-line text-small18 font-semibold">
        {point.title}
      </span>
      <span className="whitespace-pre-line text-xsmall14 font-medium text-neutral-30">
        {point.content}
      </span>
      <img
        className="absolute bottom-0 right-0"
        src={point.src}
        alt={point.alt}
      />
    </div>
  );
}

export default LiveIntro;
