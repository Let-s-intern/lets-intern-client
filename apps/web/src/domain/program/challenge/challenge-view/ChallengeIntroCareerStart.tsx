import Heading2 from '@/common/header/Heading2';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import Description from '@/domain/program/program-detail/Description';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengePoint } from '@/types/interface';
import { useMemo } from 'react';
import GeneralTrendSection from './challenge-intro-career-start/GeneralTrendSection';
import QuestionBoxGrid from './challenge-intro-career-start/QuestionBoxGrid';
import ResumeTrendSection from './challenge-intro-career-start/ResumeTrendSection';

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
      <div className="bg-neutral-90 flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-20 md:gap-y-[60px] md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col gap-y-3 md:gap-y-[30px]">
            <Heading2 className="md:flex md:flex-col md:items-center">
              <div className="xs:flex-row xs:items-center mb-1 flex w-fit flex-col gap-2.5">
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

export default ChallengeIntroCareerStart;
