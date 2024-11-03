import { LuAlarmClock } from 'react-icons/lu';

import Badge from '@components/common/program/program-detail/Badge';
import Description from '@components/common/program/program-detail/Description';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SpeechBubble from '@components/common/program/program-detail/SpeechBubble';
import CircularBox from '@components/common/ui/CircularBox';
import { ReactNode } from 'react';

const bubbles = [
  '합격률을 높이는 서류 작성 트렌드는 뭘까?',
  '학교 다니느라 바쁜데 취준은 언제하지?',
  '요즘 이 직무가 뜬다던데.. 과연 나랑 잘 맞을까?',
  '준비하는데 너무 오래걸린다 ㅠㅠ',
];

function ChallengeIntroCareerStart() {
  return (
    <section>
      <div className="mb-20 md:mb-56">
        <div className="mb-14 flex flex-col items-center md:mb-24">
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
            className="z-10 -translate-x-12 translate-y-2 -rotate-6 text-white md:-translate-x-24 md:translate-y-6"
            tailPosition="left"
            bgColor="#E874FF"
          >
            {bubbles[2]}
          </SpeechBubble>
          <SpeechBubble
            className="translate-x-16 md:translate-x-20 md:translate-y-4"
            tailHidden={true}
          >
            {bubbles[3]}
          </SpeechBubble>
        </div>
        <Heading2 className="mb-3 md:mb-8 md:flex md:flex-col md:items-center">
          <div className="mb-1 flex w-fit items-center gap-2.5">
            취업 준비 평균 기간이
            <Badge className="bg-[#F3F4FF]">
              <LuAlarmClock size={24} color="#4D55F5" />
              <span className="text-primary">11.5개월?</span>
            </Badge>
          </div>
          <div>
            서류 기초 다지기 <span className="text-primary">2주 커리큘럼</span>
            이면 충분해요!
          </div>
        </Heading2>
        <Description className="md:text-center">
          렛츠커리어의 체계적인 커리큘럼으로
          <br className="hidden md:block" /> 2주 만에
          <br className="md:hidden" />
          서류 완성해서 취업씬으로 나갈 수 있어요!
        </Description>
      </div>

      <div>
        <Heading2 className="mb-10 md:mb-20">
          2024 채용 트렌드는 <span className="text-primary">직무 연관성</span>,{' '}
          <br className="hidden md:block" />
          나에 <br className="md:hidden" />
          대한 이해를 직무와 결합시켜야 해요
        </Heading2>
        <div>
          <div className="mb-8 md:mb-20 md:flex md:items-center md:justify-between">
            <div className="md:flex md:gap-3">
              <CircularBox className="mb-2 h-5 w-5 bg-primary text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
                1
              </CircularBox>
              <div>
                <Title>
                  스펙 나열하기는 그만!
                  <br className="hidden md:block" /> 나만의 경험에서{' '}
                  <br className="md:hidden" />
                  <span className="text-primary">차별화 포인트</span>부터 찾아야
                  해요
                </Title>
                <Paragraph>
                  직무에서 선호하는 K(지식) / S(스킬) / A(태도)에 맞춰 <br />
                  쌓아 온 경험을 재구성하면 경쟁력을 갖출 수 있어요
                </Paragraph>
              </div>
            </div>
            <img
              src="/images/challenge-trend-1.svg"
              alt="K(지식), S(스킬), A(태도)"
            />
          </div>
        </div>
        <div>
          <div className="mb-8 md:flex md:items-center md:justify-between">
            <div className="md:flex md:gap-3">
              <CircularBox className="mb-2 h-5 w-5 bg-primary text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
                2
              </CircularBox>
              <div>
                <Title>
                  뻔한 말은 그만!
                  <br className="hidden md:block" />{' '}
                  <span className="text-primary">나만의 컨셉</span>
                  이 있어야 <br className="md:hidden" />더 보고 싶은 서류가
                  완성돼요
                </Title>
                <Paragraph>
                  흔한 키워드가 아닌 채용 공고에서 강조하는 역량 키워드에 <br />
                  맞춰 정리하면, 다른 지원자들과의 차이를 만들 수 있어요
                </Paragraph>
              </div>
            </div>
            <img
              src="/images/challenge-trend-2.svg"
              alt="형식적이고 뻔한 내용이 아니라 역량 키워드에 맞춰 서류를 정리해야 합니다."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Title({ children }: { children?: ReactNode }) {
  return (
    <span className="text-small18 font-semibold text-neutral-0 md:text-medium22 md:font-bold">
      {children}
    </span>
  );
}

function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-5 mt-2.5 text-xsmall14 text-neutral-45 md:text-small18">
      {children}
    </p>
  );
}

export default ChallengeIntroCareerStart;
