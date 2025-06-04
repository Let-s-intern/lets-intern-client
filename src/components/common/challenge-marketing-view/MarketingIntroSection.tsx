import { twMerge } from '@/lib/twMerge';
import SectionHeader from '@components/ui/SectionHeader';
import { ReactNode } from 'react';
import MainTitle from './MainTitle';

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

function MarketingIntroSection() {
  return (
    <div className="md:pt-25 flex flex-col items-center px-5 pb-10 pt-[60px] md:pb-20">
      {/* Header */}
      <div>
        <SectionHeader className="mb-6 md:mb-[42px]">챌린지 소개</SectionHeader>
        <MainTitle>
          <div className="mx-auto mb-3 flex w-fit flex-col gap-1 leading-8 md:mb-2 md:flex-row md:items-center md:leading-none">
            <div className="flex w-full flex-col items-center justify-center">
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="-rotate-6 bg-[#4A76FF] p-1.5 text-small20 leading-none text-neutral-100 md:px-2.5 md:py-0.5 md:text-xlarge30">
                  마케터
                </div>
                <span>를 준비하며</span>
              </div>
            </div>
            <span className="text-nowrap">누구나 한 번쯤 겪는 고민들..</span>
          </div>
          <span>
            렛츠커리어는 실제 마케팅 <br className="md:hidden" />
            취준생들의 질문에서 출발했습니다
          </span>
        </MainTitle>
      </div>

      {/* Body */}
      <div className="mt-5 flex flex-col items-center gap-1 md:mt-10 md:gap-3">
        <div className="flex w-[242px] flex-col items-center gap-1 md:w-[622px] md:gap-3">
          <IntroBubble className="md:mr-auto">
            퍼포먼스 마케터? 콘텐츠 마케터? <br />각 직무마다 구체적으로{' '}
            <br className="md:hidden" />
            어떤 일을 하는지 모르겠어요
          </IntroBubble>
          <IntroBubble className="bg-[#DDF2FF] md:ml-auto">
            마케터로서 가장 중요하고 <br className="md:hidden" />
            필요한 역량이 무엇일까요? <br />
            앞으로 어떤 역량을 더 쌓아야 할까요?
          </IntroBubble>
          <div className="w-full">
            <IntroBubble>
              포트폴리오 구성 너무 어려워요… <br className="md:hidden" />
              경험은 있는데, <br className="hidden md:block" />
              이걸 직무에 맞게 <br className="md:hidden" />
              어떻게 어필해야 할지 모르겠어요.
            </IntroBubble>
            <div
              className="bubble-tail mx-auto h-0 w-0 border-l-[9px] border-r-[9px] border-t-[14px] border-l-transparent border-r-transparent border-t-[#E9EEFF]"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="h-[70px] w-[72px] bg-[url('/images/user-with-laptop.svg')] bg-cover bg-center bg-no-repeat md:h-[136px] md:w-[146px]" />
      </div>
    </div>
  );
}

export default MarketingIntroSection;
