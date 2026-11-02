import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';
import { ConnectionLine } from './ConnectionLine';

export function BottomApply({ apply }: { apply: LetsconApply }) {
  return (
    <section className="relative overflow-hidden break-keep bg-[linear-gradient(135deg,#2e3ac6,#4753de)] px-5 py-16 md:bg-[linear-gradient(135deg,#3944cd,#4753de)] md:py-24">
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
        <h2
          data-reveal
          className="text-[22px] font-bold leading-[1.4] tracking-[-0.02em] text-white md:text-3xl md:leading-[1.4]"
        >
          취업을 향한 여러분의 모든 도전에
          <br />
          렛츠커리어가 끝까지 함께하겠습니다.
        </h2>
        <p data-reveal className="mt-3 text-base text-white md:mt-4 md:text-lg">
          11월 14-15일, 렛츠콘에서 함께해요!
        </p>
        <div data-reveal className="mt-8 w-full md:w-auto">
          <button
            data-lift
            type="button"
            disabled={apply.status !== 'available'}
            onClick={apply.openSheet}
            className="h-[62px] w-full rounded-[14px] bg-[#ffe566] text-[17px] font-bold text-[#11142b] shadow-[0_8px_20px_rgba(10,14,80,0.25)] disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/70 disabled:shadow-none md:h-[70px] md:w-[320px]"
          >
            {getApplyButtonLabel(apply.status, '렛츠콘 신청하기')}
          </button>
        </div>
      </div>
    </section>
  );
}
