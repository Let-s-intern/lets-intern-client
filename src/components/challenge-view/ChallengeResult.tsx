import { useMediaQuery } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { FaCheck } from 'react-icons/fa6';

import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengeColor } from '@components/ChallengeView';
import Heading2 from '@components/common/program/program-detail/Heading2';
import OutlinedBox from '@components/common/program/program-detail/OutlineBox';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

const superTitle = '이 모든 고민을 한번에 해결!';
const title = ['서류 합격률을 300% 높일 수 있는', '렛츠커리어 챌린지'];
const PERSONAL_STATEMENT_CONTENT = [
  {
    beforeImg: '/images/personal-statement-before1.png',
    beforeCaption: '누구나 쓸 수 있는 추상적인 지원동기',
    afterImg: '/images/personal-statement-after1.png',
    afterCaption: 'A사의 가치 기술과 관련된 경험 연결',
  },
  {
    beforeImg: '/images/personal-statement-before2.png',
    beforeCaption: '직무 경험을 구구절절 나열하는 방식',
    afterImg: '/images/personal-statement-after2.png',
    afterCaption: '나만의 장단점 및 역량 키워드 도출',
  },
];

const PORTFOLIO_CONTENT = [
  {
    beforeImg: '/images/portfolio-before1.png',
    beforeCaption: '마치 서비스 소개서처럼 솔루션만 설명',
    afterImg: '/images/portfolio-after1.png',
    afterCaption: '유저 인터뷰 등을 통한 UX/UI 변경 부분 작성',
  },
  {
    beforeImg: '/images/portfolio-before2.png',
    beforeCaption: '어떤 콘텐츠를 만들었는지 경험만 나열',
    afterImg: '/images/portfolio-after2.png',
    afterCaption: '문제점 → 전략 → 솔루션을 보여주는 구조화',
  },
];

const CAREER_START_CONTENT = [
  {
    beforeImg: '/images/career-start-before1.png',
    beforeCaption: '매번 마감 기한 전까지 소재 고민하기',
    afterImg: '/images/career-start-after1.png',
    afterCaption: '경험 서랍에서 바로 직무 FIT한 소재 뽑기',
  },
  {
    beforeImg: '/images/career-start-before2.png',
    beforeCaption: '주변 말만 듣고 직무 고르기',
    afterImg: '/images/career-start-after2.png',
    afterCaption: '업무부터 역량까지 직무의 A to Z를 직접 찾고 결정하기',
  },
  {
    beforeImg: '/images/career-start-before3.png',
    beforeCaption: '양으로 승부 보는 이력서',
    afterImg: '/images/career-start-after3.png',
    afterCaption: '핵심 역량과 매력만 깔끔하게 간추린 이력서',
  },
];

interface ChallengeResultProps {
  colors: ChallengeColor;
  challengeType: ChallengeType;
}

function ChallengeResult({ colors, challengeType }: ChallengeResultProps) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  const contents = useMemo(() => {
    const { PORTFOLIO, PERSONAL_STATEMENT } = challengeTypeSchema.enum;

    switch (challengeType) {
      case PORTFOLIO:
        return PORTFOLIO_CONTENT;
      case PERSONAL_STATEMENT:
        return PERSONAL_STATEMENT_CONTENT;
      default:
        return CAREER_START_CONTENT;
    }
  }, [challengeType]);

  return (
    <section>
      <SuperTitle
        className="mb-1 text-[#00A8EB]"
        style={{ color: colors.primary }}
      >
        {superTitle}
      </SuperTitle>
      <Heading2 className="mb-10 md:mb-20">{title.join('\n')}</Heading2>

      <div className="z-10 -mx-5 overflow-x-auto pl-5 sm:mx-0 sm:pl-0">
        <div className="flex min-w-fit flex-col gap-8 md:gap-16">
          {contents.map((content) => (
            <div
              key={content.beforeCaption}
              className="flex flex-nowrap items-start gap-2 md:gap-3"
            >
              <div className="flex flex-1 flex-col items-center gap-4">
                <BadgedBox badgeContent="Before">
                  <ResultImg
                    src={content.beforeImg}
                    alt={content.beforeCaption}
                  />
                </BadgedBox>
                <span className="text-xsmall14 font-semibold text-neutral-0 md:text-small20">
                  {content.beforeCaption}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center gap-4">
                <BadgedBox badgeContent="After" colors={colors}>
                  <ResultImg
                    src={content.afterImg}
                    alt={content.afterCaption}
                  />
                </BadgedBox>
                <div className="flex items-start gap-1">
                  <FaCheck
                    className="mt-1"
                    color={colors.primary}
                    size={isDesktop ? 20 : 16}
                  />
                  <span className="text-xsmall14 font-semibold text-neutral-0 md:text-small20">
                    {content.afterCaption}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BadgedBox({
  badgeContent,
  colors,
  className,
  children,
}: {
  badgeContent: string;
  colors?: ChallengeColor;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <OutlinedBox
      className={twMerge(
        'flex min-w-[260px] flex-col overflow-hidden border-2 border-neutral-50 bg-neutral-85 p-0 sm:w-full md:h-[350px] md:p-0',
        className,
      )}
      style={{
        backgroundColor: colors?.primaryLight,
        borderColor: colors?.primary,
      }}
    >
      <div
        className={twMerge(
          'w-full bg-neutral-50 px-2.5 py-1 text-center text-xsmall16 font-semibold text-white md:py-2.5 md:text-small20',
        )}
        style={{ backgroundColor: colors?.primary }}
      >
        {badgeContent}
      </div>
      {children}
    </OutlinedBox>
  );
}

function ResultImg({
  src,
  alt,
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  return <img className="h-auto w-full" src={src} alt={alt} />;
}

export default ChallengeResult;
