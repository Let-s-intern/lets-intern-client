'use client';

import { convertReportTypeToLandingPath } from '@/api/report';
import Intro1 from '@/assets/graphic/home/intro/1.svg?react';
import Intro11 from '@/assets/graphic/home/intro/11.svg?react';
import Intro2 from '@/assets/graphic/home/intro/2.svg?react';
import Intro3 from '@/assets/graphic/home/intro/3.svg?react';
import Intro4 from '@/assets/graphic/home/intro/4.svg?react';
import Intro5 from '@/assets/graphic/home/intro/5.svg?react';
import Intro6 from '@/assets/graphic/home/intro/6.svg?react';
import Intro8 from '@/assets/graphic/home/intro/8.svg?react';
import useActiveReports from '@/hooks/useActiveReports';
import { useIntroSectionB2CChallenges } from '@/hooks/useFirstB2CChallenge';
import { twMerge } from '@/lib/twMerge';
import { challengeTypeSchema } from '@/schema';
import Link from 'next/link';
import { ReactNode } from 'react';

const {
  EXPERIENCE_SUMMARY,
  CAREER_START,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
} = challengeTypeSchema.enum;

const HOME_INTRO = {
  description: (
    <span className="text-xsmall16 font-semibold text-primary md:text-medium22">
      서류 작성부터 피드백, 면접까지
    </span>
  ),
  title: (
    <h1 className="text-medium24 font-bold text-neutral-0 md:text-xxlarge32 md:font-semibold">
      지금 나에게 필요한
      <br className="md:hidden" /> 프로그램을 찾아보세요
    </h1>
  ),
  items: {
    basic: [
      {
        title: (
          <p>
            경험
            <br />
            정리하기
          </p>
        ),
        icon: <Intro1 width={44} height={44} />,
        href: `type=${EXPERIENCE_SUMMARY}`,
        gaTitle: '경험 정리하기',
      },
      {
        title: (
          <p>
            이력서
            <br />
            준비하기
          </p>
        ),
        icon: <Intro11 width={44} height={44} />,
        href: `type=${CAREER_START}`,
        gaTitle: '이력서 준비하기',
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
            피드백 받기
          </p>
        ),
        icon: <Intro5 width={44} height={44} />,
        href: convertReportTypeToLandingPath('PORTFOLIO'),
        gaTitle: '포트폴리오 피드백 받기',
      },
      {
        title: (
          <p>
            이력서
            <br />
            피드백 받기
          </p>
        ),
        icon: <Intro4 width={44} height={44} />,
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
    ],
  },
};

const IntroItem = ({
  title,
  subTitle,
  icon,
  href,
  gaTitle,
  badgeClassName,
  iconClassName,
}: {
  title: ReactNode;
  subTitle?: ReactNode;
  gaTitle: string;
  icon: ReactNode;
  href?: string;
  badgeClassName?: string;
  iconClassName?: string;
}) => {
  return (
    <Link
      className="icon_menu flex flex-col items-center gap-3 text-nowrap text-center text-xxsmall12 font-medium text-neutral-20 md:min-w-[92px] md:text-xsmall14"
      href={href ?? '#'}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      onClick={(e) => {
        if (!href || href === '#') {
          e.preventDefault();
          alert('준비중입니다.');
          return;
        }
      }}
      data-url={href}
      data-text={gaTitle}
    >
      <div
        className={twMerge(
          'relative flex aspect-square items-center justify-center rounded-xxs bg-[#F7F7F7] md:w-16',
          iconClassName,
        )}
      >
        {icon}
        {subTitle && (
          <span
            className={twMerge(
              'absolute -right-[14px] top-0 -translate-y-1/2 rounded-full bg-primary px-1.5 py-1 text-xxsmall10 font-medium leading-none text-white md:text-[13px]',
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

const IntroSection = () => {
  const { hasActiveResume, hasActivePersonalStatement, hasActivePortfolio } =
    useActiveReports();

  // 새로운 훅을 사용하여 각 타입별 첫 번째 B2C 챌린지 가져오기
  const {
    experienceSummary,
    resume,
    personalStatement,
    personalStatementLargeCorp,
    portfolio,
  } = useIntroSectionB2CChallenges();

  const getCurrentChallenge = (type: string): string | undefined => {
    switch (type) {
      case EXPERIENCE_SUMMARY:
        return experienceSummary?.href;

      case CAREER_START:
        return resume?.href;

      case PERSONAL_STATEMENT:
        return personalStatement?.href;

      case PERSONAL_STATEMENT_LARGE_CORP:
        return personalStatementLargeCorp?.href;

      case PORTFOLIO:
        return portfolio?.href;

      default:
        return undefined;
    }
  };

  const filteredItems = HOME_INTRO.items.basic.filter((item) => {
    // 포트폴리오 피드백 받기
    if (item.href === convertReportTypeToLandingPath('PORTFOLIO')) {
      return hasActivePortfolio;
    }
    // 이력서 피드백 받기
    if (item.href === convertReportTypeToLandingPath('RESUME')) {
      return hasActiveResume;
    }
    // 자소서 피드백 받기
    if (item.href === convertReportTypeToLandingPath('PERSONAL_STATEMENT')) {
      return hasActivePersonalStatement;
    }
    return true;
  });

  const menus = filteredItems.map((item, index) => {
    const typeParam = item.href.startsWith('type=')
      ? item.href.split('=')[1]
      : undefined;
    const challengePathname = typeParam
      ? getCurrentChallenge(typeParam)
      : undefined;
    const isInvalidProgram =
      item.href.startsWith('type=') && !challengePathname;
    const href = item.href.startsWith('type=') ? challengePathname : item.href;

    // B2B 필터링은 getCurrentChallenge 함수에서 이미 처리됨

    if (isInvalidProgram) return null;

    return (
      <IntroItem
        key={index}
        title={item.title}
        subTitle={item.subTitle}
        icon={item.icon}
        href={href}
        iconClassName={filteredItems.length === 5 ? 'w-14' : 'w-15'}
        gaTitle={item.gaTitle}
        badgeClassName={index === 7 ? 'bg-[#34BFFF]' : undefined}
      />
    );
  });

  /**
   * '여기 스타일이 왜 그런가요?'는
   * 디자인 참고: https://www.figma.com/design/cSbg7vHidcSZ53ii46CYbJ/-%EB%A0%9B%EC%B8%A0%EC%BB%A4%EB%A6%AC%EC%96%B4--%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8?node-id=17924-87310&t=9WNiucwASYwJNmWj-4
   */

  return (
    <>
      <section className="flex w-full max-w-[1120px] flex-col gap-[17px] overflow-x-hidden px-5 md:gap-12 xl:px-0">
        <div className="flex flex-col gap-1 text-center md:gap-2">
          {HOME_INTRO.description}
          {HOME_INTRO.title}
        </div>
        <div className="h-full overflow-x-auto pt-2.5 md:mx-auto md:w-fit md:overflow-x-visible md:px-0 md:pt-0">
          <div
            className={twMerge(
              'gap-x-5 gap-y-5 md:mx-auto md:flex md:justify-center md:gap-10 md:px-0',
              filteredItems.length === 5
                ? 'min-w-fit gap-x-4 px-5'
                : 'flex-wrap justify-center',
              filteredItems.length === 6
                ? 'grid grid-cols-3 gap-x-6 px-10'
                : 'flex',
            )}
          >
            {menus}
          </div>
        </div>
      </section>
    </>
  );
};

export default IntroSection;
