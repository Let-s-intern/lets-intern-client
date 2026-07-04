import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { Break } from '@/common/Break';
import Heading2 from '@/common/header/Heading2';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import BadgedBox from './challenge-result/BadgedBox';
import {
  CAREER_START_CONTENT,
  EXPERIENCE_SUMMARY_CONTENT,
  PERSONAL_STATEMENT_CONTENT,
  PORTFOLIO_CONTENT,
  RESUME_CAREER_START_CONTENT,
  superTitle,
} from './challenge-result/constants';
import ResultImg from './challenge-result/ResultImg';

const {
  PORTFOLIO,
  EXPERIENCE_SUMMARY,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  ETC,
} = challengeTypeSchema.enum;

interface ChallengeResultProps {
  challengeType: ChallengeType;
  challengeTitle: string;
  isResumeTemplate: boolean;
  weekText: string;
}

function ChallengeResult({
  challengeType,
  challengeTitle,
  isResumeTemplate,
  weekText,
}: ChallengeResultProps) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  const contents = useMemo(() => {
    // 커리어 시작 + id 143 이상일 때 이력서 템플릿 콘텐츠 반환
    if (isResumeTemplate) {
      return RESUME_CAREER_START_CONTENT;
    }

    switch (challengeType) {
      case PORTFOLIO:
        return PORTFOLIO_CONTENT;
      case CAREER_START:
        return CAREER_START_CONTENT;
      case EXPERIENCE_SUMMARY:
        return EXPERIENCE_SUMMARY_CONTENT;
      case ETC:
        return EXPERIENCE_SUMMARY_CONTENT;
      default:
        return PERSONAL_STATEMENT_CONTENT;
    }
  }, [challengeType, isResumeTemplate]);

  const iconName = (() => {
    switch (challengeType) {
      case PORTFOLIO:
        return 'result-arrow-icon-portfolio.svg';
      case CAREER_START:
        return 'result-arrow-icon-career-start.svg';
      case EXPERIENCE_SUMMARY:
        return 'result-arrow-icon-experience-summary.svg';
      case ETC:
        return 'result-arrow-icon-experience-summary.svg';
      // 자소서
      default:
        return 'result-arrow-icon-personal-statement.svg';
    }
  })();

  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          superTitleStyle: { color: challengeColors._4D55F5 },
          sectionStyle: {
            background: `linear-gradient(180deg,${challengeColors._222A7E} 0%,${challengeColors._111449} 50%,${challengeColors._111449} 100%)`,
          },
          checkIconColor: challengeColors._763CFF,
          badgeStyle: {
            backgroundColor: challengeColors._4D55F5,
            background: `linear-gradient(45deg, ${challengeColors._4D55F5}, ${challengeColors._763CFF})`,
          },
        };
      case PORTFOLIO:
        return {
          superTitleStyle: { color: challengeColors._4A76FF },
          sectionStyle: {
            background: challengeColors._1A2A5D,
          },
          checkIconColor: '#FFCE5B',
          badgeStyle: {
            backgroundColor: challengeColors._4A76FF,
            background: `linear-gradient(45deg, ${challengeColors._4D55F5}, ${challengeColors._4A56FF})`,
          },
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          sectionStyle: {
            background: challengeColors._20304F,
          },
          checkIconColor: challengeColors._39DEFF,
          badgeStyle: {
            backgroundColor: challengeColors._14BCFF,
            background: `linear-gradient(45deg, ${challengeColors._14BCFF}, ${challengeColors._39DEFF})`,
          },
        };
      case EXPERIENCE_SUMMARY:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          sectionStyle: {
            background: challengeColors._261F1E,
          },
          checkIconColor: challengeColors.F26646,
          badgeStyle: {
            backgroundColor: challengeColors._4D55F5,
            background: `linear-gradient(90deg, ${challengeColors.F26646} 0%, ${challengeColors.FF8E36} 100%)`,
          },
        };
      case ETC:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          sectionStyle: {
            background: challengeColors._261F1E,
          },
          checkIconColor: challengeColors.F26646,
          badgeStyle: {
            backgroundColor: challengeColors._4D55F5,
            background: `linear-gradient(90deg, ${challengeColors.F26646} 0%, ${challengeColors.FF8E36} 100%)`,
          },
        };
      // 자소서
      default:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          sectionStyle: {
            background: challengeColors._20304F,
          },
          checkIconColor: challengeColors._39DEFF,
          badgeBoxStyle: {
            backgroundColor: challengeColors.EEFAFF,
            borderColor: challengeColors._14BCFF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._14BCFF,
            background: `linear-gradient(45deg, ${challengeColors._14BCFF}, ${challengeColors._39DEFF})`,
          },
        };
    }
  }, [challengeType]);

  return (
    <section
      className="flex w-full flex-col items-center"
      style={styles.sectionStyle}
    >
      <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-20 md:gap-y-20 md:pb-[150px] md:pt-[140px] lg:px-0">
        <div className="flex w-full flex-col gap-y-3 md:items-center">
          <SuperTitle className="mb-1" style={styles.superTitleStyle}>
            {isResumeTemplate
              ? `${challengeTitle}와 함께라면`
              : challengeType === PORTFOLIO
                ? '더 미루지 않고 지금 렛커와 함께 한다면'
                : superTitle}
          </SuperTitle>
          <Heading2 className="text-white">
            {challengeType === EXPERIENCE_SUMMARY || challengeType === ETC ? (
              <>
                나만의 강점을{' '}
                <img
                  className="mb-1 inline-block h-auto w-7 md:mb-2 md:w-10"
                  src={`/icons/${iconName}`}
                  alt=""
                />{' '}
                파악하게 해줄
                <br /> 기필코 경험정리 챌린지
              </>
            ) : isResumeTemplate ? (
              <>
                채용 담당자가{' '}
                <img
                  className="mb-1 inline-block h-auto w-7 md:mb-2 md:w-10"
                  src={`/icons/${iconName}`}
                  alt=""
                />{' '}
                <br className="md:hidden" />
                끝까지 읽게 되는 <br className="hidden md:block" />
                이력서의 확실한 변화
              </>
            ) : (
              <>
                {weekText} 뒤에{' '}
                {challengeType === PORTFOLIO ? '포트폴리오' : '자기소개서'}{' '}
                완성하고
                <Break />
                서류 합격률을 <span className="text-[#FFCE5B]">300%</span>
                <img
                  className="mb-1 inline-block h-auto w-7 md:mb-2 md:w-10"
                  src={`/icons/${iconName}`}
                  alt=""
                />{' '}
                높일 수 있어요
              </>
            )}
          </Heading2>
        </div>
        {contents.map((content) => (
          <div
            key={content.beforeCaption}
            className="custom-scrollbar z-10 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          >
            <div className="flex min-w-fit flex-col gap-8 md:gap-16">
              <div className="flex flex-nowrap items-start gap-2 md:gap-3">
                <div className="flex flex-1 flex-col items-center gap-4">
                  <BadgedBox badgeContent="Before" badgeColor="#7A7D84">
                    <ResultImg
                      src={content.beforeImg}
                      alt={content.beforeCaption}
                    />
                  </BadgedBox>
                  <span className="text-xsmall14 md:text-small20 font-semibold text-white">
                    {content.beforeCaption}
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-4">
                  <BadgedBox
                    badgeContent="After"
                    badgeStyle={styles.badgeStyle}
                  >
                    <ResultImg
                      src={content.afterImg}
                      alt={content.afterCaption}
                    />
                  </BadgedBox>
                  <div className="flex items-start gap-1">
                    <FaCheck
                      className="mr-1 mt-1"
                      color={styles.checkIconColor}
                      size={isDesktop ? 18 : 14}
                    />
                    <span className="text-xsmall14 md:text-small20 font-semibold text-white">
                      {content.afterCaption}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ChallengeResult;
