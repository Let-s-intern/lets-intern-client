import Description from '@/domain/program/program-detail/Description';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';

const IntroBubble = ({
  children,
  align = 'left',
}: {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
}) => {
  const base =
    'relative w-full rounded-xl bg-[#FEEFE6] text-center text-xsmall14 font-medium md:px-[60px] md:py-[30px] md:text-small20 md:text-left md:w-fit';
  const tailBase = 'absolute -bottom-9 h-[65px] w-[65px]';

  return (
    <div className={`${base} ${align === 'right' ? 'md:ml-auto' : ''}`}>
      {children}
      <img
        className={`${tailBase} ${
          align === 'right'
            ? 'right-9'
            : align === 'center'
              ? 'left-1/2 -translate-x-1/2'
              : 'left-9'
        }`}
        src="/images/hr-introbubble-tail.svg"
        alt=""
        aria-hidden="true"
      />
    </div>
  );
};

function HrIntroSection() {
  return (
    <section className="flex scroll-mt-[56px] flex-col items-center bg-[#FFFAF7] px-5 pb-10 pt-[60px] md:scroll-mt-[60px] md:pb-10 md:pt-[93px]">
      {/* Header */}
      <div>
        <MainTitle>
          <span>HR/인사 직무,</span>
          <div className="mx-auto mb-3 flex w-fit flex-col gap-1 leading-8 md:mb-2 md:flex-row md:items-center md:leading-none">
            <div className="flex w-full flex-col items-center justify-center">
              <div className="flex items-center gap-1 md:gap-1.5">
                <span>어디까지가</span>
                <div className="-rotate-[2deg] rounded-xxs bg-[#ff5e00] text-small20 leading-none text-neutral-100 md:px-2 md:py-0.5 md:text-xlarge30">
                  제대로 된 준비
                </div>
                <span>일까요?</span>
              </div>
            </div>
          </div>
        </MainTitle>
        <Description className="mt-3 md:mt-[17px] md:text-center">
          HR 준비가 어려운 이유는 &apos;정답이 없어서&apos;가 아니라,
          &apos;정리된 흐름이 &apos;없기 때문&apos;&apos;입니다.
        </Description>
      </div>

      {/* Body */}
      <div className="gap-13 mt-5 flex flex-col items-center md:mt-[52px] md:gap-[18px]">
        <div className="flex w-[242px] flex-col items-center gap-1 md:w-[990px]">
          <div className="w-full">
            <IntroBubble align="left">
              HRD랑 HRM, 차이는 알겠는데
              <br />
              그래서 나는 뭘 준비해야 할까요?
            </IntroBubble>
          </div>
          <div className="w-full items-end md:-mt-[90px]">
            <IntroBubble align="right">
              채용 공고는 보는데
              <br />내 경험을 어떻게 연결해야 할지 모르겠어요
            </IntroBubble>
          </div>

          <div className="md:mb-8 md:mt-5">
            <IntroBubble align="left">
              자기소개서랑 포트폴리오는
              <br />꼭 필요한 건지, 어디서부터 시작해야 할지 막막해요
            </IntroBubble>
          </div>
        </div>
        <div className="h-[70px] w-[72px] bg-[url('/images/hr-user-with-laptop.svg')] bg-cover bg-center bg-no-repeat md:h-[136px] md:w-[146px]" />
      </div>
    </section>
  );
}

export default HrIntroSection;
