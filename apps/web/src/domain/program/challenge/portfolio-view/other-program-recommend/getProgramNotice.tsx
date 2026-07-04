import { ChallengeType, challengeTypeSchema } from '@/schema';

const {
  CAREER_START,
  PERSONAL_STATEMENT,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

export const getProgramNotice = (
  challengeType: ChallengeType,
  isResumeTemplate: boolean,
) => {
  if (isResumeTemplate) {
    return (
      <>
        본 프로그램은 취업의 기초가 되는
        <br className="md:hidden" />{' '}
        <span className="font-bold">경험 구조화 및 이력서 작성</span>을
        다룹니다.
        <br />
        자기소개서 및 포트폴리오 완성 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (challengeType === CAREER_START) {
    return (
      <>
        본 프로그램은 취업의 기초가 되는
        <br className="md:hidden" />{' '}
        <span className="font-bold">퍼스널 브랜딩과 마스터 이력서 작성</span>을
        다룹니다.
        <br />
        자기소개서 및 포트폴리오 완성 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (
    challengeType === PERSONAL_STATEMENT ||
    challengeType === PERSONAL_STATEMENT_LARGE_CORP
  ) {
    return (
      <>
        본 프로그램은 취업의 기초가 되는
        <br className="md:hidden" />{' '}
        <span className="font-bold">자기소개서 작성</span>을 다룹니다.
        <br /> 서류 기초 완성 및 포트폴리오 완성 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (challengeType === PORTFOLIO) {
    return (
      <>
        본 프로그램은 나만의 필살기를 만들 수 있는
        <br className="md:hidden" />{' '}
        <span className="font-bold">포트폴리오 제작 방법</span>을 다룹니다.
        <br /> 서류 기초 작성 및 자기소개서 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (challengeType === EXPERIENCE_SUMMARY || challengeType === ETC) {
    return (
      <>
        본 프로그램은 서류 준비의 기초가 되는 경험정리를 다룹니다.
        <br className="hidden md:block" /> 이력서, 자기소개서, 포트폴리오
        프로그램에 앞서 수강하기를 권장드립니다.
      </>
    );
  }

  return null;
};
