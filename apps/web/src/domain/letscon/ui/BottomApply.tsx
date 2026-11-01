import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';
import { ConnectionLine } from './ConnectionLine';

const BUTTON =
  'flex h-[62px] flex-col items-center justify-center rounded-[14px] md:h-[70px] md:w-[294px] disabled:cursor-not-allowed';

export function BottomApply({ apply }: { apply: LetsconApply }) {
  return (
    <section className="relative overflow-hidden break-keep bg-[linear-gradient(135deg,#2e3ac6,#4753de)] px-5 py-12 md:h-[350px] md:bg-[linear-gradient(135deg,#3944cd,#4753de)] md:py-16">
      <ConnectionLine
        viewBox="0 0 1440 350"
        points={[
          [96, 344],
          [288, 248],
          [480, 296],
          [672, 188],
          [864, 235],
          [1056, 127],
          [1248, 163],
        ]}
        className="absolute inset-0 hidden h-full w-full opacity-60 md:block"
      >
        <circle cx={1248} cy={163} r={36} fill="#ffe566" opacity={0.15} />
        <circle cx={1248} cy={163} r={18} fill="#ffe566" opacity={0.25} />
        <circle cx={1248} cy={163} r={8} fill="#ffe566" />
      </ConnectionLine>

      <div className="relative mx-auto flex max-w-[600px] flex-col items-center text-center">
        <h2 className="text-[22px] font-bold leading-[1.4] tracking-[-0.02em] text-white md:text-3xl md:leading-[1.4]">
          취업을 향한 여러분의 모든 도전에
          <br />
          렛츠커리어가 끝까지 함께하겠습니다.
        </h2>
        <p className="mt-3 text-base text-white md:mt-4 md:text-lg">
          11월 14-15일, 렛츠콘에서 함께해요!
        </p>
        <div className="mt-8 flex w-full flex-col gap-2.5 md:mt-8 md:w-auto md:flex-row md:gap-3">
          <button
            type="button"
            disabled={apply.offline !== 'available'}
            onClick={() => apply.apply('offline')}
            className={`${BUTTON} bg-[#ffe566] text-[#11142b] shadow-[0_8px_20px_rgba(10,14,80,0.25)] disabled:bg-white/25 disabled:text-white/80 disabled:shadow-none`}
          >
            <span className="text-[17px] font-bold">
              {getApplyButtonLabel(apply.offline, '온라인 + 오프라인 신청하기')}
            </span>
            <span className="mt-0.5 text-xs font-medium">
              보증금 15,000원 · 참석 시 전액 환급
            </span>
          </button>
          <button
            type="button"
            disabled={apply.online !== 'available'}
            onClick={() => apply.apply('online')}
            className={`${BUTTON} border border-white bg-white/15 text-white disabled:border-white/50 disabled:text-white/80`}
          >
            <span className="text-[17px] font-semibold">
              {getApplyButtonLabel(apply.online, '온라인만 신청하기')}
            </span>
            <span className="mt-0.5 text-xs font-medium">무료</span>
          </button>
        </div>
      </div>
    </section>
  );
}
