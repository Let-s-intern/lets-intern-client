'use client';
import useChallengeSchedule from '@/hooks/useChallengeSchedule';
import { ChallengeIdPrimitive } from '@/schema';

interface PriceOption {
  name: string;
  originalPrice: string;
  discountedPrice: string;
  discountPercentage: string;
}

interface Props {
  challenge: ChallengeIdPrimitive;
}

export default function ChallengeRecruitmentInfoSection({ challenge }: Props) {
  const { startDate, deadline, duration, orientationDate } =
    useChallengeSchedule(challenge);

  return (
    <div className="relative flex flex-col items-center gap-16 self-stretch px-5 py-10 max-sm:gap-10 max-sm:px-4 max-sm:py-5">
      <div className="relative gap-1 self-stretch text-center text-3xl font-bold leading-10 tracking-tight text-zinc-800 max-md:text-2xl max-md:leading-9 max-sm:text-2xl max-sm:leading-8">
        모집개요
      </div>
      <div className="relative flex w-full max-w-[1000px] items-start gap-3 max-md:flex-col max-md:gap-4">
        <div className="relative flex flex-[1_0_0] flex-col items-start gap-6 self-stretch rounded-lg bg-stone-50 px-4 py-7">
          <div className="relative flex flex-col items-start gap-2 self-stretch">
            <div className="relative text-base font-semibold leading-6 tracking-normal text-blue-500 max-sm:text-sm max-sm:leading-5">
              시작 일자
            </div>
            <div className="relative self-stretch text-base font-medium leading-6 tracking-normal text-zinc-800 max-sm:text-sm max-sm:leading-5">
              {startDate}
            </div>
          </div>
          <div className="relative flex flex-col items-start gap-2 self-stretch">
            <div className="relative text-base font-semibold leading-6 tracking-normal text-blue-500 max-sm:text-sm max-sm:leading-5">
              진행 기간
            </div>
            <div className="relative self-stretch text-base font-medium leading-6 tracking-normal text-zinc-800 max-sm:text-sm max-sm:leading-5">
              {duration}
            </div>
          </div>
        </div>
        <div className="relative flex flex-[1_0_0] flex-col items-start gap-6 self-stretch rounded-lg bg-stone-50 px-4 py-7">
          <div className="relative flex flex-col items-start gap-2 self-stretch">
            <div className="relative gap-1.5 text-base font-semibold leading-6 tracking-normal text-blue-500 max-sm:text-sm max-sm:leading-5">
              모집 마감
            </div>
            <div className="relative text-base font-medium leading-6 tracking-normal text-zinc-800 max-sm:text-sm max-sm:leading-5">
              {deadline}
            </div>
          </div>
          <div className="relative flex flex-col items-start gap-2 self-stretch">
            <div className="relative gap-1.5 text-base font-semibold leading-6 tracking-normal text-blue-500 max-sm:text-sm max-sm:leading-5">
              OT 일자 (온라인 진행)
            </div>
            <div className="relative text-base font-medium leading-6 tracking-normal text-zinc-800 max-sm:text-sm max-sm:leading-5">
              {orientationDate}
            </div>
          </div>
          <div className="relative flex flex-col items-start gap-2 self-stretch">
            <div className="relative gap-1.5 text-base font-semibold leading-6 tracking-normal text-blue-500 max-sm:text-sm max-sm:leading-5">
              진행방식
            </div>
            <div className="relative text-base font-medium leading-6 tracking-normal text-zinc-800 max-sm:text-sm max-sm:leading-5">
              온라인
            </div>
          </div>
        </div>
        <div className="relative flex flex-[1_0_0] flex-col items-start gap-2 self-stretch rounded-lg bg-stone-50 px-4 py-7">
          <div className="relative text-base font-semibold leading-6 tracking-normal text-blue-500 max-sm:text-sm max-sm:leading-5">
            가격
          </div>
          <div className="relative flex flex-col items-start gap-2 self-stretch">
            {/* {priceOptions.map((option, index) => (
              <React.Fragment key={index}>
                <div className="relative flex items-center justify-between self-stretch">
                  <div className="relative flex-[1_0_0] text-base font-medium leading-6 tracking-normal text-zinc-800 max-sm:text-sm max-sm:leading-5">
                    {option.name}
                  </div>
                  <div className="relative flex flex-col items-end justify-center">
                    <div className="relative flex items-center justify-center gap-1">
                      <div className="relative text-sm font-semibold leading-5 tracking-tight text-rose-500 max-sm:text-xs max-sm:leading-4">
                        {option.discountPercentage}
                      </div>
                      <div className="relative left-0 top-0 h-5 w-[58px] text-sm font-medium leading-5 tracking-tight text-zinc-500 line-through max-sm:text-xs max-sm:leading-4">
                        {option.originalPrice}
                      </div>
                    </div>
                    <div className="relative text-xl font-bold leading-7 tracking-tight text-zinc-800 max-sm:text-lg max-sm:leading-6">
                      {option.discountedPrice}
                    </div>
                  </div>
                </div>
                {index < priceOptions.length - 1 && (
                  <div className="relative h-px self-stretch bg-neutral-200" />
                )}
              </React.Fragment>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
