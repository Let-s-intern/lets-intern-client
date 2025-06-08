import { twMerge } from '@/lib/twMerge';
import Image from 'next/image';
import MainTitle from './MainTitle';

const sparkleClassName = {
  before:
    "before:absolute before:-left-10 before:top-5 before:h-[50px] before:w-[65px] before:bg-[url('/images/sprinkle1.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:md:-left-56 before:md:top-[140px] before:md:h-[82px] before:md:w-[108px]",
  after:
    "after:absolute after:-right-10 after:top-5 after:h-[50px] after:w-[65px] after:bg-[url('/images/sprinkle2.svg')] after:bg-cover after:bg-center after:bg-no-repeat  after:md:-right-56 after:md:top-[140px] after:md:h-[82px] after:md:w-[108px]",
};

const bubbleTailClassName =
  "before:absolute before:inset-x-auto before:-top-0.5 before:h-[31px] before:w-[64px] before:bg-[url('/images/marketing/bubble-tail.svg')] before:bg-cover before:bg-top before:bg-no-repeat before:md:h-[54px] before:md:w-[114px]";

function MarketingBenefitsSection() {
  return (
    <section
      className={twMerge(
        'relative flex flex-col items-center gap-6 overflow-x-hidden bg-[#4A76FF] px-5 pb-[50px] pt-[51px] md:gap-12 md:px-0 md:pb-[84px] md:pt-[78px]',
        bubbleTailClassName,
      )}
    >
      <div className="flex flex-col items-center gap-1 text-center md:gap-1.5">
        <MainTitle
          className={twMerge(
            'relative flex text-white',
            sparkleClassName.before,
            sparkleClassName.after,
          )}
        >
          🎁 마케팅 챌린지 참여자를 <br className="md:hidden" />
          위한 특별 혜택
        </MainTitle>
        <p className="mt-1.5 text-xsmall14 text-white/85 md:text-small20">
          혼자 하는 취준, 여기서 끝내세요. <br />
          렛츠커리어는 마케팅 챌린지 수료자만을 위해 <br />
          채용 연계 인재풀 등록 기회를 제공합니다.
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-3 rounded-xs bg-white p-3 pb-5 md:w-[800px] md:gap-4 md:rounded-sm md:px-6 md:pb-7 md:pt-5">
        <div className="flex w-full flex-col items-center">
          <Image
            src="/icons/check-star.svg"
            alt=""
            width={34}
            height={34}
            unoptimized
            className="h-7 w-7 object-contain md:h-[34px] md:w-[34px]"
          />
          <h3 className="mb-2 mt-1 text-center text-small18 font-bold text-[#4A76FF] md:mb-3 md:mt-2 md:text-medium24">
            슈퍼인턴과 함께 30개 사 이상의
            <br className="md:hidden" />
            마케터 직무 채용 연계
          </h3>
          <div className="flex items-center gap-2 md:gap-[14px]">
            <Image
              src="/images/superintern.svg"
              alt="슈퍼인턴"
              unoptimized
              width={100}
              height={40}
              className="h-6 w-auto md:h-10"
            />
            <span
              className="text-xsmall14 font-medium text-neutral-40 md:text-medium24"
              aria-hidden="true"
            >
              X
            </span>
            <Image
              src="/logo/horizontal-logo.svg"
              alt="렛츠커리어"
              unoptimized
              width={100}
              height={40}
              className="h-5 w-auto md:h-8"
            />
          </div>
        </div>
        <hr className="w-full max-w-[720px] border-t border-neutral-80" />
        <p className="text-nowrap text-center text-xsmall16 text-neutral-0 md:text-medium22">
          마케팅 챌린지 참여자분들만을 위해 준비했어요.
          <br />
          렛츠커리어 X 슈퍼인턴 인재풀 등록해서
          <br />
          <strong className="font-bold">
            주요 스타트업 마케터 면접 제안까지!
          </strong>
        </p>
      </div>
    </section>
  );
}

export default MarketingBenefitsSection;
