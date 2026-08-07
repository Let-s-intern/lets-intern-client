import { challengeColors } from '@/domain/program/challenge/challengeColors';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { useMemo } from 'react';
import BenefitSection from './challenge-different/BenefitSection';
import { getDifferentList } from './challenge-different/challenge-different.constants';
import DifferentSection from './challenge-different/DifferentSection';

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  ETC,
} = challengeTypeSchema.enum;

const ChallengeDifferent = ({
  challengeType,
  challengeTitle,
  deposit,
  isResumeTemplate,
}: {
  challengeType: ChallengeType;
  challengeTitle: string;
  deposit: number;
  isResumeTemplate: boolean;
}) => {
  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          primaryLightColor: challengeColors.F3F4FF,
          borderColor: challengeColors._4D55F5,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          primaryLightColor: challengeColors.F0F4FF,
          borderColor: challengeColors._4A76FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors._14BCFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC6B9,
        };
      case ETC:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC6B9,
        };
      // 자소서
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors._14BCFF,
        };
    }
  }, [challengeType]);

  const differentList = getDifferentList(isResumeTemplate, styles);

  const iconName = useMemo(() => {
    switch (challengeType) {
      case PORTFOLIO:
        return 'different-icon-portfolio.svg';
      case CAREER_START:
        return 'different-icon-career-start.svg';
      case EXPERIENCE_SUMMARY:
        return 'different-icon-experience-summary.svg';
      case ETC:
        return 'different-icon-experience-summary.svg';
      case PERSONAL_STATEMENT:
        return 'different-icon-personal-statement.svg';
      default:
        return undefined;
    }
  }, [challengeType]);

  return (
    <section
      id="different"
      className="flex w-full flex-col gap-y-[70px] py-16 md:gap-y-40 md:py-40"
    >
      {/* 차별점 */}
      <DifferentSection
        challengeType={challengeType}
        challengeTitle={challengeTitle}
        deposit={deposit}
        isResumeTemplate={isResumeTemplate}
        iconName={iconName}
        differentList={differentList}
        styles={styles}
      />

      {/* 혜택 */}
      <BenefitSection
        challengeType={challengeType}
        challengeTitle={challengeTitle}
        isResumeTemplate={isResumeTemplate}
        primaryColor={styles.primaryColor}
      />
    </section>
  );
};

export default ChallengeDifferent;
