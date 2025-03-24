import { ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';
import { ChallengePoint } from '@/types/interface';
import { ChallengeColor } from '@components/ChallengeView';
import Description from '@components/common/program/program-detail/Description';
import CircularBox from '@components/common/ui/CircularBox';
import Heading2 from '@components/common/ui/Heading2';

const boxes = [
  `나의 경험을\n전략적으로\n서류에 녹일 수\n없을까?`,
  `서류의 구조는\n어떻게 작성해야\n할까?`,
  `합격률을 높이는\n서류 작성 트렌드는\n뭘까?`,
  `무조건 면접으로\n가는 서류는\n어떤 특징이 있을까?`,
  ``,
  `기업에서 원하는\n서류 작성 방법은\n뭐지?`,
  ``,
  `면접 전략까지\n세울 수 있는\n서류는 뭘까?`,
];

const ChallengeIntroCareerStart = ({
  colors,
  challengeTitle,
  weekText,
}: {
  colors: ChallengeColor;
  challengeTitle: string;
  weekText: ChallengePoint['weekText'];
}) => {
  return (
    <section className="flex w-full flex-col md:items-center">
      <div className="flex w-full flex-col items-center bg-neutral-90">
        <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-20 md:gap-y-[60px] md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-3 md:gap-y-[30px]">
            <Heading2 className="md:flex md:flex-col md:items-center">
              <div className="mb-1 flex w-fit flex-col gap-2.5 xs:flex-row xs:items-center">
                취업 준비 평균 기간이
                <div className="flex items-center gap-0.5">
                  <img
                    className="h-auto w-6 md:w-8"
                    src="/icons/career-start-timer-icon.svg"
                    alt="타이머 아이콘"
                  />
                  <span className="text-primary">11.5개월?</span>
                </div>
              </div>
              <div>
                {challengeTitle}{' '}
                <span className="text-primary">{weekText} 커리큘럼</span>
                이면 충분해요!
              </div>
            </Heading2>
            <Description className="md:text-center">
              렛츠커리어의 체계적인 커리큘럼으로
              <br className="hidden md:block" /> {weekText} 만에
              <br className="md:hidden" /> 서류 완성해서 취업씬으로 나갈 수
              있어요!
            </Description>
          </div>
          <div className="relative flex w-full flex-col items-center">
            <div
              className={`grid w-full grid-cols-3 gap-2 md:grid-cols-4 md:gap-3`}
            >
              {boxes.map((box, index) => {
                return (
                  <div
                    key={index}
                    className={twMerge(
                      'h-20 whitespace-pre rounded-md bg-white px-2.5 py-3 text-[10px] font-semibold md:h-40 md:px-5 md:py-6 md:text-small20',
                      box === '' && 'hidden md:invisible md:block',
                    )}
                  >
                    {box}
                  </div>
                );
              })}
            </div>
            {/* grid 양 옆에 회색 그라데이션 박스 */}
            <div className="absolute bottom-0 left-0 top-0 h-full w-40 bg-gradient-to-r from-neutral-90 to-transparent md:w-80" />
            <div className="absolute bottom-0 right-0 top-0 h-full w-40 bg-gradient-to-l from-neutral-90 to-transparent md:w-80" />
          </div>
        </div>
      </div>
      <div
        className="flex w-full flex-col md:items-center"
        style={{ backgroundColor: colors.primaryLight }}
      >
        <div className="flex w-full max-w-[1000px] flex-col gap-y-[50px] px-5 py-[70px] md:gap-y-20 md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-3 md:items-center">
            <p
              className="text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary }}
            >
              취업 성공 전략
            </p>
            <Heading2>
              {new Date().getFullYear()} 채용 트렌드는{' '}
              <span className="text-primary">직무 연관성</span>
              , <br className="hidden md:block" />
              나에 <br className="md:hidden" />
              대한 이해를 직무와 결합시켜야 해요
            </Heading2>
          </div>
          <div className="flex w-full flex-col gap-y-[60px] md:gap-y-[70px]">
            <div>
              <div className="mb-8 md:mb-20 md:flex md:items-center md:justify-between">
                <div className="md:flex md:gap-3">
                  <CircularBox className="mb-2 h-5 w-5 shrink-0 bg-primary text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
                    1
                  </CircularBox>
                  <div>
                    <Title>
                      스펙 나열하기는 그만!
                      <br className="hidden md:block" /> 나만의 경험에서{' '}
                      <br className="md:hidden" />
                      <span className="text-primary">차별화 포인트</span>부터
                      찾아야 해요
                    </Title>
                    <Paragraph>
                      직무에서 선호하는 K(지식) / S(스킬) / A(태도)에 맞춰{' '}
                      <br />
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
                      흔한 키워드가 아닌 채용 공고에서 강조하는 역량 키워드에{' '}
                      <br />
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
        </div>
      </div>
    </section>
  );
};

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
