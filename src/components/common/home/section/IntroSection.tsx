import { useGetUserProgramQuery } from '@/api/program';
import { convertReportTypeToLandingPath } from '@/api/report';
import Intro1 from '@/assets/graphic/home/intro/1.svg?react';
import Intro2 from '@/assets/graphic/home/intro/2.svg?react';
import Intro3 from '@/assets/graphic/home/intro/3.svg?react';
import Intro4 from '@/assets/graphic/home/intro/4.svg?react';
import Intro5 from '@/assets/graphic/home/intro/5.svg?react';
import Intro6 from '@/assets/graphic/home/intro/6.svg?react';
// import Intro7 from '@/assets/graphic/home/intro/7.svg?react';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

const HOME_INTRO = {
  description: (
    <span className="text-xsmall16 font-bold text-primary md:text-medium22">
      취업 준비, 어디까지 완성 되었나요?
    </span>
  ),
  title: (
    <h1 className="text-medium24 font-semibold text-neutral-0 md:text-xxlarge32 md:font-bold">
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
          <>
            경험 정리
            <br />
            &강점찾기
          </>
        ),
        icon: <Intro1 width={44} height={44} />,
        href: 'current=기필코',
      },
      {
        title: (
          <>
            자기소개서
            <br />
            준비하기
          </>
        ),
        icon: <Intro2 width={44} height={44} />,
        href: 'current=자기소개서',
      },
      {
        title: (
          <>
            포트폴리오
            <br />
            준비하기
          </>
        ),
        icon: <Intro3 width={44} height={44} />,
        href: 'current=포트폴리오',
      },
      {
        title: (
          <>
            멘토와 1:1
            <br />
            면접 준비하기
          </>
        ),
        icon: <Intro4 width={44} height={44} />,
        href: 'https://letscareer.framer.website/',
      },
      {
        title: (
          <>
            이력서
            <br />
            피드백 받기
          </>
        ),
        icon: <Intro5 width={44} height={44} />,
        href: convertReportTypeToLandingPath('RESUME'),
      },
      {
        title: (
          <>
            자소서
            <br />
            피드백 받기
          </>
        ),
        icon: <Intro6 width={44} height={44} />,
        href: convertReportTypeToLandingPath('PERSONAL_STATEMENT'),
      },
      // {
      //   title: (
      //     <>
      //       포트폴리오
      //       <br />
      //       피드백 받기
      //     </>
      //   ),
      //   icon: <Intro7 width={44} height={44} />,
      //   href: convertReportTypeToLandingPath('PORTFOLIO'),
      // },
    ],
    enterprise: [
      {
        title: (
          <>
            경험 정리
            <br />
            &강점찾기
          </>
        ),
        icon: <Intro1 width={44} height={44} />,
        href: 'current=기필코',
      },
      {
        title: (
          <>
            대기업 자소서
            <br />
            준비하기
          </>
        ),
        icon: <Intro2 width={44} height={44} />,
        href: 'current=대기업,자기소개서',
      },
      {
        title: (
          <>
            인적성
            <br />
            준비하기
          </>
        ),
        icon: <Intro3 width={44} height={44} />,
        href: 'https://litt.ly/letscareer/sale/0U6p79r',
      },
      {
        title: (
          <>
            멘토와 1:1
            <br />
            면접 준비하기
          </>
        ),
        icon: <Intro4 width={44} height={44} />,
        href: 'https://letscareer.framer.website/',
      },
      {
        title: (
          <>
            이력서
            <br />
            피드백 받기
          </>
        ),
        icon: <Intro5 width={44} height={44} />,
        href: convertReportTypeToLandingPath('RESUME'),
      },
      {
        title: (
          <>
            자소서
            <br />
            피드백 받기
          </>
        ),
        icon: <Intro6 width={44} height={44} />,
        href: convertReportTypeToLandingPath('PERSONAL_STATEMENT'),
      },
    ],
  },
};

const IntroSection = () => {
  const [basic, setBasic] = useState(true);

  const { data } = useGetUserProgramQuery({
    pageable: { page: 1, size: 20 },
    searchParams: {
      type: 'CHALLENGE',
      status: ['PROCEEDING'],
    },
  });

  const getCurrentChallenge = (keyword: string): string | undefined => {
    const keywordList = keyword.split(',');

    // 모든 keyword를 포함하고 있는 챌린지
    const currentChallenge = data?.programList.find((program) => {
      return keywordList.every((keyword) =>
        program.programInfo.title?.includes(keyword),
      );
    });

    if (currentChallenge) {
      return `/program/challenge/${currentChallenge.programInfo.id}`;
    }

    return undefined;
  };

  return (
    <>
      <section className="flex w-full max-w-[1160px] flex-col gap-y-8 px-5 xl:px-0">
        <div className="flex flex-col gap-y-1 text-center">
          {HOME_INTRO.description}
          {HOME_INTRO.title}
        </div>
        <div className="mx-auto flex w-full flex-col items-center gap-y-8 md:w-fit md:gap-y-11">
          <div className="flex w-fit items-center justify-center gap-x-2 rounded-xs bg-neutral-90 p-1.5">
            <IntroButton
              active={basic}
              text="일반 채용"
              onClick={() => setBasic(true)}
            />
            <IntroButton
              active={!basic}
              text="대기업 공채"
              onClick={() => setBasic(false)}
            />
          </div>
          <div
            className={clsx(
              'grid w-full grid-cols-4 gap-x-4 gap-y-6 px-1 md:grid-cols-6 md:grid-rows-1 md:gap-x-10',
              {
                // 'md:grid-cols-7': basic,
                'md:grid-cols-6': !basic,
              },
            )}
          >
            {basic
              ? HOME_INTRO.items.basic.map((item, index) => (
                  <IntroItem
                    key={index}
                    title={item.title}
                    icon={item.icon}
                    href={
                      item.href.startsWith('current=')
                        ? getCurrentChallenge(item.href.split('=')[1])
                        : item.href
                    }
                  />
                ))
              : HOME_INTRO.items.enterprise.map((item, index) => (
                  <IntroItem
                    key={index}
                    title={item.title}
                    icon={item.icon}
                    href={
                      item.href.startsWith('current=')
                        ? getCurrentChallenge(item.href.split('=')[1])
                        : item.href
                    }
                  />
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default IntroSection;

const IntroButton = ({
  active,
  text,
  onClick,
}: {
  active: boolean;
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={clsx(
        'rounded-xs px-4 py-1.5 text-center text-xsmall14 md:px-4 md:py-1.5 md:text-xsmall16',
        {
          'bg-white font-semibold text-neutral-0 shadow-10': active,
          'bg-transparent font-medium text-neutral-45': !active,
        },
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const IntroItem = ({
  title,
  icon,
  href,
}: {
  title: ReactNode;
  icon: ReactNode;
  href?: string;
}) => {
  return (
    <Link
      className="flex w-full flex-col gap-y-4 text-center text-xxsmall12 font-medium text-neutral-20 md:text-xsmall16"
      href={href ?? '#'}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      onClick={() => {
        if (!href || href === '#') {
          alert('준비중입니다.');
        }
      }}
    >
      <div className="flex aspect-square items-center justify-center rounded-xxs bg-[#F7F7F7] md:w-full">
        {icon}
      </div>
      {title}
    </Link>
  );
};
