import { useMediaQuery } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengeColor } from '@components/ChallengeView';
import Box from '@components/common/program/program-detail/Box';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';

const superTitle = '이 모든 고민을 한번에 해결!';

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
    beforeImg: '/images/portfolio-before1.png',
    beforeCaption: '마치 서비스 소개서처럼 솔루션만 설명',
    afterImg: '/images/portfolio-after1.jpg',
    afterCaption: '유저 인터뷰 등을 통한 UX/UI 변경 부분 작성',
  },
  {
    beforeImg: '/images/portfolio-before2.jpg',
    beforeCaption: '어떤 콘텐츠를 만들었는지 경험만 나열',
    afterImg: '/images/portfolio-after2.jpg',
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

const { PORTFOLIO, ETC, CAREER_START } = challengeTypeSchema.enum;

interface ChallengeResultProps {
  colors: ChallengeColor;
  challengeType: ChallengeType;
  challengeTitle: string;
}

function ChallengeResult({
  colors,
  challengeType,
  challengeTitle,
}: ChallengeResultProps) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  const contents = useMemo(() => {
    switch (challengeType) {
      case PORTFOLIO:
        return PORTFOLIO_CONTENT;
      case CAREER_START:
        return CAREER_START_CONTENT;
      case ETC:
        return EXPERIENCE_SUMMARY_CONTENT;
      default:
        return PERSONAL_STATEMENT_CONTENT;
    }
  }, [challengeType]);

  const iconName = (() => {
    switch (challengeType) {
      case PORTFOLIO:
        return 'result-arrow-icon-portfolio.svg';
      case CAREER_START:
        return 'result-arrow-icon-career-start.svg';
      default:
        return 'result-arrow-icon-personal-statement.svg';
    }
  })();

  return (
    <section
      className="flex w-full flex-col items-center"
      style={{
        background:
          challengeType === CAREER_START ? colors.gradientBg : colors.dark,
      }}
    >
      <div className="flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-20 md:gap-y-20 md:pb-[150px] md:pt-[140px] lg:px-0">
        <div className="flex w-full flex-col gap-y-3 md:items-center">
          <SuperTitle className="mb-1" style={{ color: colors.primary }}>
            {superTitle}
          </SuperTitle>
          <Heading2 className="text-white">
            {challengeType === ETC ? (
              <>
                나만의 강점을 파악하게 해줄
                <br /> 기필코 경험정리 챌린지
              </>
            ) : (
              <>
                서류 합격률을 300%{' '}
                <img
                  className="mb-1 inline-block h-auto w-7 md:mb-2 md:w-10"
                  src={`/icons/${iconName}`}
                  alt=""
                />{' '}
                <br className="md:hidden" />
                높일 수 있는 <br className="hidden md:block" />
                {challengeTitle}
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
                  <BadgedBox badgeContent="After" colors={colors} isGradient>
                    <ResultImg
                      src={content.afterImg}
                      alt={content.afterCaption}
                    />
                  </BadgedBox>
                  <div className="flex items-start gap-1">
                    <FaCheck
                      className="mt-1"
                      color={colors.gradient}
                      size={isDesktop ? 20 : 16}
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
  colors,
  isGradient = false,
  badgeColor,
  className,
  children,
}: {
  badgeContent: string;
  colors?: ChallengeColor;
  isGradient?: boolean;
  badgeColor?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Box
      className={twMerge(
        'flex w-full min-w-[260px] flex-col overflow-hidden p-0 md:p-0',
        className,
      )}
      style={{
        backgroundColor: colors?.primaryLight,
        borderColor: colors?.primary,
      }}
    >
      <div
        className={twMerge(
          'w-full bg-neutral-75 px-2.5 py-1 text-center text-xsmall16 font-semibold text-white md:py-2.5 md:text-small20',
        )}
        style={{
          color: badgeColor,
          backgroundColor: colors?.primary,
          background: isGradient
            ? `linear-gradient(45deg, ${colors?.primary}, ${colors?.gradient})`
            : undefined,
        }}
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
