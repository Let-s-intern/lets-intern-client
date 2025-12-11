import Description from '@/domain/program/program-detail/Description';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import CircularBox from '@components/common/ui/CircularBox';
import Heading2 from '@components/common/ui/Heading2';
import { ReactNode } from 'react';

const boxes = [
  `같은 경험을 더\n강력하게 보이게\n할 수 있는\n방법은 없을까?`,
  `언제부터의 경험을\n정리 해야할까?`,
  `이 경험에서\n어필할 수 있는\n차별화된 강점은 뭘까?`,
  `활동은 많이 했는데,\n어디서부터\n시작해야 할까?`,
  ``,
  `내 경험이 너무\n평범하진 않을까?`,
  ``,
  `내가 가진\n역량은 뭘까?`,
];

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
} = challengeTypeSchema.enum;

const ChallengeIntroExpericeSummary = ({
  challengeType,
}: {
  challengeType: ChallengeType;
}) => {
  return (
    <section className="flex w-full flex-col md:items-center">
      <div className="flex w-full flex-col items-center bg-neutral-90">
        <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-20 md:gap-y-[60px] md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-3 md:gap-y-[30px]">
            <Heading2>
              200명의 합격자가 입을 모아 강조한 <br className="md:hidden" />
              경험 정리의 중요성!
              <br /> 기필코 경험 정리 챌린지로 <br className="md:hidden" />
              <span className="text-[#F26646]">2주 안에 완성</span>해요
            </Heading2>
            <Description className="md:text-center">
              렛츠커리어의 체계적인 커리큘럼으로
              <br /> 머릿 속 숨어있던 경험까지 끌어내 정리할 수 있어요!
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
      <div className="flex w-full flex-col bg-neutral-95 md:items-center">
        <div className="flex w-full max-w-[1000px] flex-col gap-y-[50px] px-5 py-[70px] md:gap-y-20 md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-3 md:items-center">
            <p className="text-xsmall16 font-bold text-[#F26646] md:text-small20">
              취업 성공 전략
            </p>
            <Heading2>
              {new Date().getFullYear()} 채용 트렌드는{' '}
              <span className="text-[#F26646]">직무 연관성</span>
              , <br className="hidden md:block" />
              나에 <br className="md:hidden" />
              대한 이해를 직무와 결합시켜야 해요
            </Heading2>
          </div>
          <div className="flex w-full flex-col gap-y-[60px] md:gap-y-[70px]">
            <div>
              <div className="mb-8 md:mb-20 md:flex md:items-center md:justify-between">
                <div className="md:flex md:gap-3">
                  <CircularBox className="mb-2 h-5 w-5 shrink-0 bg-[#F26646] text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
                    1
                  </CircularBox>
                  <div>
                    <Title>
                      스펙 나열하기는 그만!
                      <br className="hidden md:block" /> 나만의 경험에서{' '}
                      <br className="md:hidden" />
                      <span className="text-[#F26646]">차별화 포인트</span>부터
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
                  src="/images/strategy-experience-summary-1.svg"
                  alt="K(지식), S(스킬), A(태도)"
                />
              </div>
            </div>
            <div>
              <div className="mb-8 md:flex md:items-center md:justify-between">
                <div className="md:flex md:gap-3">
                  <CircularBox className="mb-2 h-5 w-5 bg-[#F26646] text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
                    2
                  </CircularBox>
                  <div>
                    <Title>
                      뻔한 말은 그만!
                      <br className="hidden md:block" />{' '}
                      <span className="text-[#F26646]">나만의 컨셉</span>
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
                  src="/images/strategy-experience-summary-2.svg"
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

export default ChallengeIntroExpericeSummary;
