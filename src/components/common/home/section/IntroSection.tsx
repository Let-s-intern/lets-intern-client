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
        img: '/images/home/intro/1.png',
        href: '/program',
      },
      {
        title: (
          <>
            자기소개서
            <br />
            준비하기
          </>
        ),
        img: '/images/home/intro/2.png',
        href: '/program',
      },
      {
        title: (
          <>
            포트폴리오
            <br />
            준비하기
          </>
        ),
        img: '/images/home/intro/3.png',
        href: '/program',
      },
      {
        title: (
          <>
            멘토와 1:1
            <br />
            면접 준비하기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
      {
        title: (
          <>
            이력서
            <br />
            피드백 받기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
      {
        title: (
          <>
            자소서
            <br />
            피드백 받기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
      {
        title: (
          <>
            포트폴리오
            <br />
            피드백 받기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
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
        img: '/images/home/intro/1.png',
        href: '/program',
      },
      {
        title: (
          <>
            대기업 자소서
            <br />
            준비하기
          </>
        ),
        img: '/images/home/intro/2.png',
        href: '/program',
      },
      {
        title: (
          <>
            인적성
            <br />
            준비하기
          </>
        ),
        img: '/images/home/intro/3.png',
        href: '/program',
      },
      {
        title: (
          <>
            멘토와 1:1
            <br />
            면접 준비하기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
      {
        title: (
          <>
            이력서
            <br />
            피드백 받기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
      {
        title: (
          <>
            자소서
            <br />
            피드백 받기
          </>
        ),
        img: '/images/home/intro/4.png',
        href: '/program',
      },
    ],
  },
};

const IntroSection = () => {
  const [basic, setBasic] = useState(true);

  return (
    <>
      <section className="flex w-full max-w-[1160px] flex-col gap-y-8 px-5 xl:px-0">
        <div className="flex flex-col gap-y-1 text-center">
          {HOME_INTRO.description}
          {HOME_INTRO.title}
        </div>
        <div className="flex w-full flex-col gap-y-6 md:mx-auto md:w-fit">
          <div className="flex w-full items-stretch justify-center gap-x-2 md:justify-start">
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
              'grid w-full grid-cols-4 gap-x-4 gap-y-6 px-1 md:grid-rows-1 md:gap-x-10',
              {
                'md:grid-cols-7': basic,
                'md:grid-cols-6': !basic,
              },
            )}
          >
            {basic
              ? HOME_INTRO.items.basic.map((item, index) => (
                  <IntroItem
                    key={index}
                    index={index}
                    title={item.title}
                    img={item.img}
                    href={item.href}
                  />
                ))
              : HOME_INTRO.items.enterprise.map((item, index) => (
                  <IntroItem
                    key={index}
                    index={index}
                    title={item.title}
                    img={item.img}
                    href={item.href}
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
        'rounded-xs px-3 py-2 text-center text-xsmall14 md:px-4 md:py-1.5',
        {
          'bg-primary text-white': active,
          'bg-neutral-90 text-neutral-35': !active,
        },
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const IntroItem = ({
  index,
  title,
  img,
  href,
}: {
  index: number;
  title: ReactNode;
  img: string;
  href: string;
}) => {
  return (
    <Link
      className="flex w-full flex-col gap-y-2 text-center text-xxsmall12 font-medium text-neutral-20 md:text-xsmall16"
      href={href}
    >
      <img
        className="aspect-square w-full rounded-xs bg-neutral-80 object-cover"
        src={img}
        alt={'intro-item-' + index}
      />
      {title}
    </Link>
  );
};
