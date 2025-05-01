import { useGetChallengeHome } from '@/api/challenge';
import { convertReportTypeToLandingPath } from '@/api/report';
import Intro1 from '@/assets/graphic/home/intro/1.svg?react';
import Intro2 from '@/assets/graphic/home/intro/2.svg?react';
import Intro3 from '@/assets/graphic/home/intro/3.svg?react';
import Intro5 from '@/assets/graphic/home/intro/5.svg?react';
import Intro6 from '@/assets/graphic/home/intro/6.svg?react';
import Intro8 from '@/assets/graphic/home/intro/8.svg?react';
import useActiveReports from '@/hooks/useActiveReports';
import { twMerge } from '@/lib/twMerge';
import { challengeTypeSchema } from '@/schema';
import Link from 'next/link';
import { ReactNode } from 'react';

const {
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
} = challengeTypeSchema.enum;

const HOME_INTRO = {
  description: (
    <span className="text-xsmall16 font-semibold text-primary md:text-medium22">
      취업 준비, 어디까지 완성되었나요?
    </span>
  ),
  title: (
    <h1 className="text-medium24 font-bold text-neutral-0 md:text-xxlarge32 md:font-semibold">
      서류 작성부터 피드백, 면접까지
      <br />
      지금 나에게 필요한
      <br className="md:hidden" /> 프로그램을 찾아보세요
    </h1>
  ),
  items: {
    basic: [
      {
        title: (
          <p>
            경험정리 <br className="md:hidden" />& 이력서{' '}
            <br className="hidden md:block" />
            준비
          </p>
        ),
        icon: <Intro1 width={44} height={44} />,
        href: `type=${EXPERIENCE_SUMMARY}`,
        gaTitle: '경험 정리 & 이력서 준비',
      },
      {
        title: (
          <p>
            자소서
            <br />
            준비하기
          </p>
        ),
        icon: <Intro2 width={44} height={44} />,
        href: `type=${PERSONAL_STATEMENT}`,
        gaTitle: '자기소개서 준비하기',
      },
      {
        title: (
          <p>
            대기업 자소서
            <br />
            준비하기
          </p>
        ),
        subTitle: '대기업',
        icon: <Intro8 width={44} height={44} />,
        href: `type=${PERSONAL_STATEMENT_LARGE_CORP}`,
        gaTitle: '대기업 자기소개서 준비하기',
      },
      {
        title: (
          <p>
            포트폴리오
            <br />
            준비하기
          </p>
        ),
        icon: <Intro3 width={44} height={44} />,
        href: `type=${PORTFOLIO}`,
        gaTitle: '포트폴리오 준비하기',
      },
      {
        title: (
          <p>
            이력서
            <br />
            피드백 받기
          </p>
        ),
        icon: <Intro5 width={44} height={44} />,
        href: convertReportTypeToLandingPath('RESUME'),
        gaTitle: '이력서 피드백 받기',
      },
      {
        title: (
          <p>
            자소서
            <br />
            피드백 받기
          </p>
        ),
        icon: <Intro6 width={44} height={44} />,
        href: convertReportTypeToLandingPath('PERSONAL_STATEMENT'),
        gaTitle: '자기소개서 피드백 받기',
      },
      // 면접 메뉴
      // {
      //   title: (
      //     <>
      //       멘토와 1:1
      //       <br />
      //       면접 준비하기
      //     </>
      //   ),
      //   subTitle: '대기업',
      //   icon: <Intro9 />,
      //   href: 'https://letscareerinterview.imweb.me/',
      //   gaTitle: '멘토와 1:1 면접 준비하기',
      // },
      // {
      //   title: (
      //     <>
      //       멘토와 1:1
      //       <br />
      //       면접 준비하기
      //     </>
      //   ),
      //   subTitle: '스타트업',
      //   icon: <Intro4 width={44} height={44} />,
      //   href: 'https://letscareerinterview.imweb.me/Startupinterview',
      //   gaTitle: '멘토와 1:1 면접 준비하기',
      // },
    ],
  },
};

const IntroSection = () => {
  const { data: experienceSummaryData } = useGetChallengeHome({
    type: EXPERIENCE_SUMMARY,
  });
  const { data: personalStatementData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT,
  });
  const { data: personalStatementLargeCorpData } = useGetChallengeHome({
    type: PERSONAL_STATEMENT_LARGE_CORP,
  });
  const { data: portfolioData } = useGetChallengeHome({ type: PORTFOLIO });

  const { hasActiveResume, hasActivePersonalStatement } = useActiveReports();

  const getCurrentChallenge = (type: string): string | undefined => {
    switch (type) {
      case EXPERIENCE_SUMMARY:
        return experienceSummaryData &&
          experienceSummaryData.programList.length > 0
          ? `/program/challenge/${experienceSummaryData.programList[0].id}`
          : undefined;
      case PERSONAL_STATEMENT:
        return personalStatementData &&
          personalStatementData.programList.length > 0
          ? `/program/challenge/${personalStatementData.programList[0].id}`
          : undefined;
      case PERSONAL_STATEMENT_LARGE_CORP:
        return personalStatementLargeCorpData &&
          personalStatementLargeCorpData.programList.length > 0
          ? `/program/challenge/${personalStatementLargeCorpData.programList[0].id}`
          : undefined;
      case PORTFOLIO:
        return portfolioData && portfolioData.programList.length > 0
          ? `/program/challenge/${portfolioData.programList[0].id}`
          : undefined;
      default:
        return undefined;
    }
  };

  return (
    <>
      <section className="flex w-full max-w-[1120px] flex-col gap-y-9 px-5 md:gap-y-12 xl:px-0">
        <div className="flex flex-col gap-y-1 text-center md:gap-y-2">
          {HOME_INTRO.description}
          {HOME_INTRO.title}
        </div>
        <div className="mx-auto flex w-full flex-col items-center gap-y-8 md:w-fit md:gap-y-11">
          <div className="grid grid-cols-4 gap-x-5 gap-y-6 px-1 md:flex md:gap-10">
            {HOME_INTRO.items.basic.map((item, index) => {
              // 이력서 피드백 받기
              if (index === 4) {
                if (hasActiveResume) {
                  return (
                    <IntroItem
                      key={index}
                      title={item.title}
                      subTitle={item.subTitle}
                      icon={item.icon}
                      href={
                        item.href.startsWith('type=')
                          ? getCurrentChallenge(item.href.split('=')[1])
                          : item.href
                      }
                      gaTitle={item.gaTitle}
                    />
                  );
                }
                return null;
              }

              // 자소서 피드백 받기
              if (index === 5) {
                if (hasActivePersonalStatement) {
                  return (
                    <IntroItem
                      key={index}
                      title={item.title}
                      subTitle={item.subTitle}
                      icon={item.icon}
                      href={
                        item.href.startsWith('type=')
                          ? getCurrentChallenge(item.href.split('=')[1])
                          : item.href
                      }
                      gaTitle={item.gaTitle}
                    />
                  );
                }
                return null;
              }

              return (
                <IntroItem
                  key={index}
                  title={item.title}
                  subTitle={item.subTitle}
                  icon={item.icon}
                  href={
                    item.href.startsWith('type=')
                      ? getCurrentChallenge(item.href.split('=')[1])
                      : item.href
                  }
                  gaTitle={item.gaTitle}
                  badgeClassName={index === 7 ? 'bg-[#34BFFF]' : undefined}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default IntroSection;

const IntroItem = ({
  title,
  subTitle,
  icon,
  href,
  gaTitle,
  badgeClassName,
}: {
  title: ReactNode;
  subTitle?: ReactNode;
  gaTitle: string;
  icon: ReactNode;
  href?: string;
  badgeClassName?: string;
}) => {
  return (
    <Link
      className="icon_menu flex min-w-[66px] flex-col items-center gap-y-4 text-center text-xxsmall12 font-medium text-neutral-20 md:min-w-[92px] md:text-xsmall14"
      href={href ?? '#'}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      onClick={() => {
        if (!href || href === '#') {
          alert('준비중입니다.');
        }
      }}
      data-url={href}
      data-text={gaTitle}
    >
      <div className="relative flex aspect-square w-15 items-center justify-center rounded-xxs bg-[#F7F7F7] md:w-16">
        {icon}
        {subTitle && (
          <span
            className={twMerge(
              'absolute -right-[14px] top-0 -translate-y-1/2 rounded-full bg-primary px-2 py-[5px] text-[11px] font-medium leading-none text-white md:text-[13px]',
              badgeClassName,
            )}
          >
            {subTitle}
          </span>
        )}
      </div>
      {title}
    </Link>
  );
};
