import { challengeColors } from '@/domain/challenge/challenge-view/ChallengeView';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengePoint } from '@/types/interface';
import Description from '@components/common/program/program-detail/Description';
import CircularBox from '@components/common/ui/CircularBox';
import Heading2 from '@components/common/ui/Heading2';
import { ReactNode, useMemo } from 'react';

const QUESTION_BOXES = [
  `나의 경험을\n전략적으로\n서류에 녹일 수\n없을까?`,
  `서류의 구조는\n어떻게 작성해야\n할까?`,
  `합격률을 높이는\n서류 작성 트렌드는\n뭘까?`,
  `무조건 면접으로\n가는 서류는\n어떤 특징이 있을까?`,
  ``,
  `기업에서 원하는\n서류 작성 방법은\n뭐지?`,
  ``,
  `면접 전략까지\n세울 수 있는\n서류는 뭘까?`,
];

const RESUME_QUESTION_BOXES = [
  `나의 경험을\n전략적으로\n서류에 녹일 수\n없을까?`,
  `이력서의 구조는\n어떻게 작성해야\n할까?`,
  `합격률을 높이는\n이력서 작성 트렌드는\n뭘까?`,
  `무조건 면접으로\n가는 이력서는\n어떤 특징이 있을까?`,
  ``,
  `기업에서 원하는\n서류 작성 방법은\n뭐지?`,
  ``,
  `면접 전략까지\n세울 수 있는\n서류는 뭘까?`,
];

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
} = challengeTypeSchema.enum;

const TrendItem = ({
  number,
  title,
  description,
  imageSrc,
  imageAlt,
}: {
  number: number;
  title: ReactNode;
  description: ReactNode;
  imageSrc: string;
  imageAlt: string;
}) => (
  <div>
    <div className="mb-8 md:mb-20 md:flex md:items-center md:justify-between">
      <div className="md:flex md:gap-3">
        <CircularBox className="mb-2 h-5 w-5 shrink-0 bg-primary text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
          {number}
        </CircularBox>
        <div>
          <Title>{title}</Title>
          <Paragraph>{description}</Paragraph>
        </div>
      </div>
      <img src={imageSrc} alt={imageAlt} />
    </div>
  </div>
);

// 이력서 템플릿용 트렌드 섹션
const ResumeTrendSection = ({ primaryColor }: { primaryColor: string }) => (
  <div className="flex w-full max-w-[1000px] flex-col gap-y-[50px] px-5 py-[70px] md:gap-y-20 md:px-10 md:py-[120px] lg:px-0">
    <div className="flex w-full flex-col gap-y-3 md:items-center">
      <p
        className="text-xsmall16 font-bold md:text-small20"
        style={{ color: primaryColor }}
      >
        서류 작성의 시작, 이력서
      </p>
      <Heading2>
        {new Date().getFullYear()} 합격 이력서 트렌드는{' '}
        <span className="text-primary">핵심 역량 강조</span>
        <br />
        지원한 직무에 Fit한 역량을 드러내야 해요.
      </Heading2>
    </div>
    <div className="flex w-full flex-col gap-y-[60px] md:gap-y-[70px]">
      <TrendItem
        number={1}
        title={
          <>
            경험 나열만 하는 이력서가 아닌
            <br />
            <span className="text-primary">직무 역량이 돋보이는</span> 이력서가
            필요해요.
          </>
        }
        description={
          <>
            지원한 직무의 역량을 정의 후 핵심 역량을 강조하며 <br />
            스스로의 Fit함을 요약적으로 제시하며 시작해요.
          </>
        }
        imageSrc="/images/challenge-trend-143.svg"
        imageAlt="직무정의, 역량강조, 직무와의fit"
      />
      <TrendItem
        number={2}
        title={
          <>
            이력서의 핵심은 How!
            <br />
            <span className="text-primary">
              내가 어떻게 일하는 사람인지 드러내야 해요.
            </span>
          </>
        }
        description={
          <>
            경험을 드러낼 때는 과업의 배경부터 솔루션 도출까지
            <br />
            과정에서 어떻게 일했는지 드러나는 이력서가 필요해요.
          </>
        }
        imageSrc="/images/challenge-trend-2-143.svg"
        imageAlt="이력서의 핵심은 HOW! 내가 어떻게 일하는 사람인지 드러내야 해요."
      />
      <TrendItem
        number={3}
        title={
          <>
            최대한 구체적으로 작성!
            <br />
            <span className="text-primary">경험이 구체적일수록</span> 지원자의
            Fit을 쉽게 파악해요.
          </>
        }
        description={
          <>
            구체성은 곧 차별화!
            <br />
            경험이 구체적일수록 다른 지원자와의 차별화가 가능해요.
          </>
        }
        imageSrc="/images/challenge-trend-3.svg"
        imageAlt="구체적인 경험이 곧 차별화입니다."
      />
    </div>
  </div>
);

// 일반 트렌드 섹션
const GeneralTrendSection = ({ primaryColor }: { primaryColor: string }) => (
  <div className="flex w-full max-w-[1000px] flex-col gap-y-[50px] px-5 py-[70px] md:gap-y-20 md:px-10 md:py-[120px] lg:px-0">
    <div className="flex w-full flex-col gap-y-3 md:items-center">
      <p
        className="text-xsmall16 font-bold md:text-small20"
        style={{ color: primaryColor }}
      >
        취업 성공 전략
      </p>
      <Heading2>
        {new Date().getFullYear()} 채용 트렌드는{' '}
        <span className="text-primary">직무 연관성</span>,{' '}
        <br className="hidden md:block" />
        나에 <br className="md:hidden" />
        대한 이해를 직무와 결합시켜야 해요
      </Heading2>
    </div>
    <div className="flex w-full flex-col gap-y-[60px] md:gap-y-[70px]">
      <TrendItem
        number={1}
        title={
          <>
            스펙 나열하기는 그만!
            <br className="hidden md:block" /> 나만의 경험에서{' '}
            <br className="md:hidden" />
            <span className="text-primary">차별화 포인트</span>부터 찾아야 해요
          </>
        }
        description={
          <>
            직무에서 선호하는 K(지식) / S(스킬) / A(태도)에 맞춰 <br />
            쌓아 온 경험을 재구성하면 경쟁력을 갖출 수 있어요
          </>
        }
        imageSrc="/images/challenge-trend-1.svg"
        imageAlt="K(지식), S(스킬), A(태도)"
      />
      <TrendItem
        number={2}
        title={
          <>
            뻔한 말은 그만!
            <br className="hidden md:block" />{' '}
            <span className="text-primary">나만의 컨셉</span>이 있어야{' '}
            <br className="md:hidden" />더 보고 싶은 서류가 완성돼요
          </>
        }
        description={
          <>
            흔한 키워드가 아닌 채용 공고에서 강조하는 역량 키워드에 <br />
            맞춰 정리하면, 다른 지원자들과의 차이를 만들 수 있어요
          </>
        }
        imageSrc="/images/challenge-trend-2.svg"
        imageAlt="형식적이고 뻔한 내용이 아니라 역량 키워드에 맞춰 서류를 정리해야 합니다."
      />
    </div>
  </div>
);

// 질문 박스 그리드 컴포넌트
const QuestionBoxGrid = ({ boxes }: { boxes: string[] }) => (
  <div className="relative flex w-full flex-col items-center">
    <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-4 md:gap-3">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={twMerge(
            'h-20 whitespace-pre rounded-md bg-white px-2.5 py-3 text-[10px] font-semibold md:h-40 md:px-5 md:py-6 md:text-small20',
            box === '' && 'hidden md:invisible md:block',
          )}
        >
          {box}
        </div>
      ))}
    </div>
    {/* grid 양 옆에 회색 그라데이션 박스 */}
    <div className="absolute bottom-0 left-0 top-0 h-full w-40 bg-gradient-to-r from-neutral-90 to-transparent md:w-80" />
    <div className="absolute bottom-0 right-0 top-0 h-full w-40 bg-gradient-to-l from-neutral-90 to-transparent md:w-80" />
  </div>
);

const ChallengeIntroCareerStart = ({
  challengeTitle,
  weekText,
  challengeType,
  isResumeTemplate,
}: {
  challengeTitle: string;
  weekText: ChallengePoint['weekText'];
  challengeType: ChallengeType;
  isResumeTemplate: boolean;
}) => {
  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          primaryLightColor: challengeColors.F3F4FF,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,

          primaryLightColor: challengeColors.F0F4FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,

          primaryLightColor: challengeColors.EEFAFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors._4D55F5,

          primaryLightColor: challengeColors.F3F4FF,
        };
      default:
        return {
          primaryColor: challengeColors._14BCFF,

          primaryLightColor: challengeColors.EEFAFF,
        };
    }
  }, [challengeType]);

  return (
    <section className="flex w-full flex-col md:items-center">
      <div className="flex w-full flex-col items-center bg-neutral-90">
        <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-20 md:gap-y-[60px] md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-3 md:gap-y-[30px]">
            <Heading2 className="md:flex md:flex-col md:items-center">
              <div className="mb-1 flex w-fit flex-col gap-2.5 xs:flex-row xs:items-center">
                {isResumeTemplate
                  ? '늘 마감 기한에 쫓기고 계시나요?'
                  : '취업 준비 평균 기간이'}
                <div className="flex items-center gap-0.5">
                  {!isResumeTemplate && (
                    <span className="text-primary">11.5개월?</span>
                  )}
                  <img
                    className="h-auto w-6 md:w-8"
                    src="/icons/career-start-timer-icon.svg"
                    alt="타이머 아이콘"
                  />
                </div>
              </div>
              <div>
                {challengeTitle} <span className="text-primary">커리큘럼</span>
                이면 충분해요!
              </div>
            </Heading2>
            <Description className="md:text-center">
              {isResumeTemplate
                ? '경험 정리부터 서류 완성까지!'
                : '렛츠커리어의 체계적인 커리큘럼으로'}
              <br className="hidden md:block" /> {weekText} 만에
              <br className="md:hidden" />
              {isResumeTemplate
                ? ' 이력서 완성해서 서류의 코어를 완성해요.'
                : ' 서류 완성해서 취업씬으로 나갈 수 있어요!'}
            </Description>
          </div>
          <QuestionBoxGrid
            boxes={isResumeTemplate ? RESUME_QUESTION_BOXES : QUESTION_BOXES}
          />
        </div>
      </div>

      {/* 트렌드 섹션 */}
      <div
        className="flex w-full flex-col md:items-center"
        style={{ backgroundColor: styles.primaryLightColor }}
      >
        {isResumeTemplate ? (
          <ResumeTrendSection primaryColor={styles.primaryColor} />
        ) : (
          <GeneralTrendSection primaryColor={styles.primaryColor} />
        )}
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
