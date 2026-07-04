import { useMemo } from 'react';

import Heading2 from '@/common/header/Heading2';
import Badge from '@/domain/program/challenge/challenge-view/challenge-check-list/Badge';
import CheckList from '@/domain/program/challenge/challenge-view/challenge-check-list/CheckList';
import {
  CAREER_START,
  ETC,
  EXPERIENCE_SUMMARY,
  EXPERIENCE_SUMMARY_CHECK_LIST,
  PERSONAL_STATEMENT_CHECK_LIST,
  PERSONAL_STATEMENT_LARGE_CORP,
  PERSONAL_STATEMENT_LARGE_CORP_CHECK_LIST,
  PORTFOLIO,
  PORTFOLIO_CHECK_LIST,
  getCareerStartCheckList,
  superTitle,
  title,
} from '@/domain/program/challenge/challenge-view/challenge-check-list/constants';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import Description from '@/domain/program/program-detail/Description';
import OutlinedBox from '@/domain/program/program-detail/OutlineBox';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import Box from '@/domain/program/program-detail/Box';
import { ChallengeIdSchema } from '@/schema';
import { josa } from 'es-hangul';

interface ChallengeCheckListProps {
  challengeType: ChallengeIdSchema['challengeType'];
  challengeTitle: string;
  isResumeTemplate: boolean;
  challengeId: number;
  weekText: string;
}

function ChallengeCheckList({
  challengeType,
  challengeTitle,
  isResumeTemplate,
  challengeId,
  weekText,
}: ChallengeCheckListProps) {
  const description = [
    '취업 준비를 하면서 어떤 고민들을 가지고 계셨나요?',
    `아래 고민 중 1개라도 해당한다면 ${josa(challengeTitle, '을/를')} 추천해요!`,
  ];

  const checkList = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return getCareerStartCheckList(challengeId, weekText);
      case PORTFOLIO:
        return PORTFOLIO_CHECK_LIST;
      case EXPERIENCE_SUMMARY:
        return EXPERIENCE_SUMMARY_CHECK_LIST;
      case ETC:
        return EXPERIENCE_SUMMARY_CHECK_LIST;
      case PERSONAL_STATEMENT_LARGE_CORP:
        return PERSONAL_STATEMENT_LARGE_CORP_CHECK_LIST;
      default:
        return PERSONAL_STATEMENT_CHECK_LIST;
    }
  }, [challengeType, challengeId]);

  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          superTitleStyle: { color: challengeColors._4D55F5 },
          boxStyle: {
            backgroundColor: challengeColors.F3F4FF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._4D55F5,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FDF6FF,
            borderColor: challengeColors.E45BFF,
            color: challengeColors.E45BFF,
          },
          checkboxColor: challengeColors._4D55F5,
        };
      case PORTFOLIO:
        return {
          superTitleStyle: { color: challengeColors._4A76FF },
          boxStyle: {
            backgroundColor: challengeColors.F0F4FF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._4A76FF,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF9EA,
            borderColor: challengeColors.F8AE00,
            color: challengeColors.F8AE00,
          },
          checkboxColor: challengeColors._4A76FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          boxStyle: {
            backgroundColor: challengeColors.EEFAFF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._14BCFF,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.FF9C34,
          },
          checkboxColor: challengeColors._14BCFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          boxStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          badgeStyle: {
            backgroundColor: challengeColors.F26646,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.EB7900,
          },
          checkboxColor: challengeColors.F26646,
        };
      case ETC:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          boxStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          badgeStyle: {
            backgroundColor: challengeColors.F26646,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.EB7900,
          },
          checkboxColor: challengeColors.F26646,
        };
      default:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          boxStyle: {
            backgroundColor: challengeColors.EEFAFF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._14BCFF,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.FF9C34,
          },
          checkboxColor: challengeColors._14BCFF,
        };
    }
  }, [challengeType]);

  return (
    <section className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:px-10 md:pb-[140px] md:pt-[130px] lg:px-0">
      <div className="mb-16 md:mb-20">
        <SuperTitle
          className="mb-3 md:text-center"
          style={styles.superTitleStyle}
        >
          {isResumeTemplate
            ? `이력서 ${weekText} 완성 챌린지가 필요한 이유`
            : superTitle}
        </SuperTitle>
        <Heading2>
          {isResumeTemplate
            ? '이력서는 취업의 필수!\n채용 담당자가 가장 먼저 나를 판단하게 되는 서류입니다.'
            : title.join('\n')}
        </Heading2>
        <Description className="mt-3 md:mt-8 md:text-center">
          {isResumeTemplate
            ? `가장 중요한 서류임에도 불구하고 자꾸 미뤄두셨다면\n이번 챌린지를 통해 함께 ${weekText} 만에 꼭 완성해요!`
            : description.join('\n')}
        </Description>
      </div>
      <div className="flex w-full flex-col gap-16 md:gap-32 md:px-16">
        {checkList.map((item, index) => (
          <div
            key={item.title[0]}
            className="flex w-full flex-col gap-6 md:items-center md:gap-10"
          >
            <Box
              className="text-small18 md:text-medium24 relative flex w-full max-w-[860px] flex-col py-6 font-bold md:flex-row md:justify-center md:gap-1 md:p-10"
              style={styles.boxStyle}
            >
              <Badge style={styles.badgeStyle}>Check {index + 1}</Badge>
              {item.title.map((ele) => (
                <span key={ele} className="shrink-0">
                  {ele}
                </span>
              ))}
            </Box>
            <div className="flex w-fit flex-col gap-5 px-5 md:items-center md:px-0">
              {item.content.map((group) => (
                <CheckList
                  key={group[0]}
                  checkboxColor={styles.checkboxColor}
                  className={
                    group.length > 1 ? 'justify-start' : 'items-center'
                  }
                >
                  {group.map((ele) => (
                    <span
                      key={ele}
                      className="text-xsmall14 text-neutral-35 xs:text-xsmall16 md:text-small20 shrink-0 font-semibold"
                    >
                      {ele}
                    </span>
                  ))}
                </CheckList>
              ))}
            </div>
            <OutlinedBox
              className="flex w-full max-w-[860px] flex-col items-center md:p-10 lg:flex-row lg:justify-center lg:gap-1"
              style={styles.outlinedBoxStyle}
            >
              {item.solution.map((ele) => (
                <span
                  className="text-xsmall16 md:text-medium24 shrink-0 text-center font-semibold"
                  key={ele}
                >
                  {ele}
                </span>
              ))}
            </OutlinedBox>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ChallengeCheckList;
