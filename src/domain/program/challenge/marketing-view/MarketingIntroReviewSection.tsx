import SectionHeader from '@/common/header/SectionHeader';
import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';

const IntroBubble = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'w-full rounded-sm bg-[#E9EEFF] px-2 py-2.5 text-center text-xsmall14 font-medium md:w-[492px] md:py-[18px] md:text-small20',
        className,
      )}
    >
      {children}
    </div>
  );
};

const IntroReviewTail = () => {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-10 flex -translate-x-1/2 justify-center"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="114"
        height="52"
        viewBox="0 0 114 52"
        fill="#ffffff"
        className="hidden md:block"
      >
        <path
          d="M52.8735 50.0907C55.1877 52.2831 58.8123 52.2831 61.1265 50.0907L114 0H0L52.8735 50.0907Z"
          fill="white"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="22"
        viewBox="0 0 50 22"
        fill="#ffffff"
        className="md:hidden"
      >
        <path
          d="M20.8448 20.011C23.1666 22.2399 26.8334 22.2399 29.1552 20.011L50 0H0L20.8448 20.011Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

interface MarketingIntroReviewSectionProps {
  weekText: string;
}

function MarketingIntroSection({ weekText }: MarketingIntroReviewSectionProps) {
  return (
    <section className="relative flex flex-col items-center bg-[linear-gradient(0deg,#F0F4FF_0%,#E3E5FB_105.65%)] px-5 pb-10 pt-[114px] md:pb-20 md:pt-[114px]">
      <IntroReviewTail />
      {/* Header */}
      <div>
        <SectionHeader className="mb-6 md:mb-[42px]">참여자 후기</SectionHeader>
        <MainTitle>
          <div className="mx-auto mb-3 flex w-fit flex-col gap-1 leading-8 md:mb-2 md:flex-row md:items-center md:leading-none">
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-1.5">
              <span>
                {weekText} 후, 김렛커의 서류는 <br className="md:hidden" />
              </span>
              <div className="flex items-center gap-1.5">
                <span>완전히 </span>
                <div className="rotate-6 bg-[#4A76FF] p-1.5 text-small20 leading-none text-neutral-100 md:px-2.5 md:py-0.5 md:text-xlarge30">
                  달라졌다!
                </div>
              </div>
            </div>
          </div>
        </MainTitle>
      </div>

      {/* Body */}
      <div className="mt-8 flex flex-col items-center gap-1 md:gap-3">
        <div className="flex w-[242px] flex-col items-center gap-3 md:w-[622px]">
          <IntroBubble className="bg-primary py-[18px] font-bold text-primary-5 md:mr-auto md:font-medium">
            현직자 세미나로 <strong className="font-bold">직무 이해도</strong>를
            높였고, <br />
            <strong className="font-bold">합격 포트폴리오</strong> 예시를 통해
            <br className="md:hidden" />{' '}
            <strong className="font-bold">서류 구조화 </strong>
            시작했어요!
            <p className="mt-3 text-center text-xxsmall12 font-bold text-primary-20 md:text-xsmall16 md:font-medium">
              <strong className="font-bold">그로스 마케터 </strong> 직무 희망
              김렛커
            </p>
          </IntroBubble>
          <IntroBubble className="bg-[#ffffff] py-[18px] font-bold md:ml-auto md:font-medium">
            “<strong className="font-bold">나에게 맞는 </strong>마케터가
            무엇일까
            <br className="md:hidden" /> 방향성을 찾았고{' '}
            <br className="hidden md:block" />
            실무 투입에 대비한 <br className="md:hidden" />
            <strong className="font-bold">진짜 공부</strong> 시작했어요!”
            <p className="mt-3 text-center text-xxsmall12 font-bold md:text-xsmall16 md:font-medium">
              <strong className="font-bold">비전공자 </strong>마케터 직무 희망
              김렛커
            </p>
          </IntroBubble>
          <div className="w-full">
            <IntroBubble className="bg-primary py-[18px] font-bold text-primary-5 md:font-medium">
              <strong className="font-bold">“취준이 처음이라 </strong>막막했는데
              <br className="md:hidden" />
              <strong className="font-bold"> 서류 완성</strong>했습니다!
              <br />
              챌린지가 끝나도 미션/학습 콘텐츠는 <br className="md:hidden" />
              <strong className="font-bold">평생 열람 가능</strong>해요!!”
              <p className="mt-3 text-center text-xxsmall12 font-bold text-primary-20 md:text-xsmall16 md:font-medium">
                마케팅 취준 시작한{' '}
                <strong className="font-bold">대학생 </strong>김렛커
              </p>
            </IntroBubble>
            <div
              className="bubble-tail mx-auto h-0 w-0 border-l-[9px] border-r-[9px] border-t-[14px] border-l-transparent border-r-transparent border-t-[##4D55F5]"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="h-[70px] w-[72px] bg-[url('/images/user-with-laptop2.svg')] bg-cover bg-center bg-no-repeat md:h-[136px] md:w-[146px]" />
        <button
          type="button"
          className="z-1 relative mt-[60px] flex w-[320px] items-center justify-center gap-2 rounded-sm bg-[#0C1737] px-0 py-4 text-center text-xsmall16 font-semibold text-white md:w-auto md:px-5 md:text-medium22"
        >
          이전 기수 수강생이 쓴 생생한 후기 보러가기!
          <div className="relative h-5 w-5 md:h-6 md:w-6">
            <Image
              src="/images/marketing/arrow-circle-right.svg"
              alt="arrow"
              fill
              className="object-contain"
            />
          </div>
          <Link
            className="absolute inset-0"
            href={{
              pathname: '/review/program',
              query: { program: 'challenge_review', challenge: 'marketing' },
            }}
          />
        </button>
      </div>
    </section>
  );
}

export default MarketingIntroSection;
