import type { LetsconLiveKind } from '../data/live';
import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';
import { HeroBackdrop } from './HeroBackdrop';

interface ApplyButtonProps {
  apply: LetsconApply;
  kind: LetsconLiveKind;
  label: string;
  caption: string;
  className: string;
}

function ApplyButton({
  apply,
  kind,
  label,
  caption,
  className,
}: ApplyButtonProps) {
  const status = apply[kind];

  return (
    <button
      data-lift
      type="button"
      disabled={status !== 'available'}
      onClick={() => apply.apply(kind)}
      className={`h-[72px] w-full rounded-lg text-white disabled:cursor-not-allowed md:w-[295px] md:rounded-md ${className}`}
    >
      <span className="block text-base font-bold leading-6">
        {getApplyButtonLabel(status, label)}
      </span>
      <span className="mt-0.5 block text-xs font-medium leading-[18px] text-white/75">
        {caption}
      </span>
    </button>
  );
}

export function Hero({ apply }: { apply: LetsconApply }) {
  return (
    <section className="relative overflow-hidden break-keep bg-[radial-gradient(120%_160%_at_0%_0%,#25226b_0%,#141544_30%,#0b0e2b_70%)] text-white">
      <HeroBackdrop />
      <div className="relative flex flex-col items-center px-5 pb-[72px] pt-12 text-center md:pb-[120px] md:pt-[calc(var(--letscon-header-height,156px)-76px)]">
        <p className="rounded-full border border-white/30 bg-white/15 px-[15px] py-[8px] text-sm font-semibold leading-5 md:border-[#a0aaff]/75 md:bg-transparent md:px-4 md:py-[7px] md:text-xs md:font-medium md:text-[#c9d0ff]">
          마케팅 · HR · PM · 대기업 면접
        </p>

        <p className="order-1 mt-[34px] text-2xl font-bold leading-[34px] tracking-[-0.02em] md:order-none md:mt-[34px] md:text-[43px] md:font-extrabold md:leading-[58px]">
          공채는 끝나도,
          <br className="md:hidden" />{' '}
          <span className="md:text-[#ffe066]">취준은 끝나지 않으니까</span>
        </p>

        <h1 className="mt-[45px] flex items-end text-[54px] font-black leading-none tracking-[-0.06em] md:mt-[38px] md:text-[120px] md:tracking-[-0.035em]">
          LETS<span className="md:text-[#ffe066]">CON</span>
          <span
            aria-hidden="true"
            data-pulse
            className="mb-[3px] ml-1 grid size-[27px] place-items-center rounded-full bg-[#ffe066]/30 shadow-[0_0_16px_rgba(255,224,102,0.3)] md:mb-3 md:ml-1 md:size-[34px]"
          >
            <span className="size-[13px] rounded-full bg-[#ffe066] md:size-5" />
          </span>
        </h1>

        <p className="order-2 mt-6 text-sm leading-[25px] text-white/85 md:mt-[38px] md:text-xl md:leading-7">
          작은 경험을 합격으로 연결한 현직자의 이야기.
          <br />
          남은 2026년, 다시 시작할 취준의 방향과 루틴을 만나요.
        </p>

        <div className="order-3 mt-[37px] flex w-full max-w-[294px] flex-col gap-3 md:mt-[52px] md:w-auto md:max-w-none md:flex-row">
          <ApplyButton
            apply={apply}
            kind="offline"
            label="온라인 + 오프라인 신청하기"
            caption="보증금 15,000원 · 참석 시 전액 환급"
            className="bg-[#4d55f5]"
          />
          <ApplyButton
            apply={apply}
            kind="online"
            label="온라인만 신청하기"
            caption="무료"
            className="border border-white/40 bg-[#22223b]"
          />
        </div>
      </div>
    </section>
  );
}
