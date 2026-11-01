import type { LetsconApply } from '../hooks/useLetsconApply';
import { ApplyForm } from './ApplyForm';
import { ApplySchedule } from './ApplySchedule';
import { DepositRefund } from './DepositRefund';

export function Apply({ apply }: { apply: LetsconApply }) {
  return (
    <section className="break-keep bg-[#f7f8fc] py-16 md:py-[88px]">
      <div className="mx-auto max-w-[920px] px-5">
        <p
          data-reveal
          className="text-primary text-xs font-bold tracking-[0.12em] md:text-[13px] md:tracking-[0.08em]"
        >
          LET&apos;S MAKE A CONNECTION
        </p>
        <h2
          data-reveal
          className="mt-4 text-2xl font-extrabold leading-[1.35] tracking-[-0.02em] text-[#1c1e2b] md:mt-4 md:text-4xl md:leading-[1.3]"
        >
          이틀 모두 무료 참여
          <br />
          현장 참여만 선택해 주세요.
        </h2>
        <p
          data-reveal
          className="mt-4 text-sm leading-[1.6] text-[#7f8290] md:mt-4 md:text-base"
        >
          15일 렛츠콘에서 현장 오프라인 참여 선택시,{' '}
          <br className="md:hidden" />
          참여노쇼를 방지하기 위해 보증금이 있습니다.
        </p>

        <div className="mt-8 grid gap-8 md:mt-7 md:grid-cols-2 md:gap-5">
          <ApplySchedule />
          <ApplyForm apply={apply} />
        </div>

        <div className="mt-6 text-center text-xs leading-[1.5] tracking-[-0.02em] text-[#7f8290] md:leading-[1.45]">
          <p>
            온라인 신청 마감 11/15(일) 16:30 · <br className="md:hidden" />
            <span className="text-primary">
              오프라인 신청 마감 11/12(목) 23:59
            </span>
          </p>
          <p className="mt-2 md:mt-0">
            신청 완료 후 카카오 알림톡이 발송되며, <br className="md:hidden" />
            생중계 링크는 행사 당일 보내드립니다.
          </p>
        </div>

        <DepositRefund />
      </div>
    </section>
  );
}
