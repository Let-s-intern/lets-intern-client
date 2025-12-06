import { useMediaQuery } from '@mui/material';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { Break } from '@components/Break';
import { challengeColors } from '@components/ChallengeView';
import Box from '@components/common/program/program-detail/Box';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';

const superTitle = '이 모든 고민을 한번에 해결!';

const RESUME_CAREER_START_CONTENT = [
  {
    beforeImg: '/images/resume-start-before1.svg',
    beforeCaption: '정리되지 않은 날 것의 경험과 역량들',
    afterImg: '/images/resume-start-after1.svg',
    afterCaption: '구체적이고 직무 역량이 구조화된 경험',
  },
  {
    beforeImg: '/images/resume-start-before2.svg',
    beforeCaption: '경험이 나열되기만 한 이력서',
    afterImg: '/images/resume-start-after2.svg',
    afterCaption: '업무의 세부 사항부터 역량까지 돋보이는 이력서',
  },
  {
    beforeImg: '/images/resume-start-before3.svg',
    beforeCaption: '역량이 보이지 않는 낡은 이력서 양식',
    afterImg: '/images/resume-start-after3.svg',
    afterCaption: '역량이 돋보이는 이력서 템플릿 활용',
  },
];

const PERSONAL_STATEMENT_CONTENT = [
  {
    beforeImg: '/images/personal-statement-before1.jpg',
    beforeCaption: '누구나 쓸 수 있는 추상적인 지원동기',
    afterImg: '/images/personal-statement-after1.jpg',
    afterCaption: 'A사의 가치 기술과 관련된 경험 연결',
  },
  {
    beforeImg: '/images/personal-statement-before2.jpg',
    beforeCaption: '직무 경험을 구구절절 나열하는 방식',
    afterImg: '/images/personal-statement-after2.jpg',
    afterCaption: '직무 키워드 선정 후, 관련된 경험 구체화',
  },
];

const PORTFOLIO_CONTENT = [
  {
    beforeImg: '/images/up-1-before-494-302.png',
    beforeCaption: '마치 서비스 소개서처럼 솔루션만 설명',
    afterImg: '/images/up-1-after-494-302.png',
    afterCaption: '유저 인터뷰 등을 통한 UX/UI 변경 부분 작성',
  },
  {
    beforeImg: '/images/up-2-before-494-302.png',
    beforeCaption: '어떤 활동을 했는지 경험만 나열',
    afterImg: '/images/up-2-after-494-302.png',
    afterCaption: '문제점 → 전략 → 솔루션을 보여주는 구조화',
  },
];

const CAREER_START_CONTENT = [
  {
    beforeImg: '/images/career-start-before1.jpg',
    beforeCaption: '매번 마감 기한 전까지 소재 고민하기',
    afterImg: '/images/career-start-after1.jpg',
    afterCaption: '경험 서랍에서 바로 직무 FIT한 소재 뽑기',
  },
  {
    beforeImg: '/images/career-start-before2.jpg',
    beforeCaption: '주변 말만 듣고 직무 고르기',
    afterImg: '/images/career-start-after2.jpg',
    afterCaption: '업무부터 역량까지 직무의 A to Z를 직접 찾고 결정하기',
  },
  {
    beforeImg: '/images/career-start-before3.jpg',
    beforeCaption: '양으로 승부 보는 이력서',
    afterImg: '/images/career-start-after3.jpg',
    afterCaption: '핵심 역량과 매력만 깔끔하게 간추린 이력서',
  },
];

const EXPERIENCE_SUMMARY_CONTENT = [
  {
    beforeImg: '/images/experience-summary-before1.jpg',
    beforeCaption: '매번 마감 기한 전까지 소재 고민하기',
    afterImg: '/images/experience-summary-after1.jpg',
    afterCaption: '경험 서랍에서 바로 직무 FIT한 소재 뽑기',
  },
  {
    beforeImg: '/images/experience-summary-before2.jpg',
    beforeCaption: '여기저기 분산된 경험들',
    afterImg: '/images/experience-summary-after2.jpg',
    afterCaption: '경험 마인드맵과 STAR로 논리적인 경험 정리',
  },
  {
    beforeImg: '/images/experience-summary-before3.jpg',
    beforeCaption: '자기소개서 소재 무한 고민 굴레',
    afterImg: '/images/experience-summary-after3.jpg',
    afterCaption: '경험별로 명확하게 연결된 나만의 역량',
  },
];

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
}

function ChallengeResult({
  challengeType,
  challengeTitle,
  isResumeTemplate,
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
                {/* TODO: receivedContent.challengePoint.weekText? */}
                2주 뒤에 포트폴리오 완성하고
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
                  <span className="text-xsmall14 font-semibold text-white md:text-small20">
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
                    <span className="text-xsmall14 font-semibold text-white md:text-small20">
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

function BadgedBox({
  badgeContent,
  badgeColor,
  className,
  children,
  badgeStyle,
}: {
  badgeContent: string;
  badgeColor?: string;
  className?: string;
  children?: ReactNode;
  badgeStyle?: CSSProperties;
}) {
  const style = { color: badgeColor, ...badgeStyle };

  return (
    <Box
      className={twMerge(
        'flex w-full min-w-[260px] flex-col overflow-hidden p-0 md:p-0',
        className,
      )}
    >
      <div
        className={twMerge(
          'w-full bg-neutral-75 px-2.5 py-1 text-center text-xsmall16 font-semibold text-white md:py-2.5 md:text-small20',
        )}
        style={style}
      >
        {badgeContent}
      </div>
      {children}
    </Box>
  );
}

function ResultImg({
  src,
  alt,
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  return (
    <img className="aspect-[13000/7947] h-full w-full" src={src} alt={alt} />
  );
}

export default ChallengeResult;
