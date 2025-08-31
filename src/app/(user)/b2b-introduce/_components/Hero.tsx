'use client';

import CTAButton from './CTAButton';

type Props = { onPrimary: () => void };

export default function Hero({ onPrimary }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#F7F9FF_0%,#FFFFFF_60%)]">
      <div className="mw-1180 relative py-16 md:py-24 lg:py-28">
        {/* floating badges */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-2 top-1/3 -translate-y-1/3 md:left-8">
            <HeroBadge label="포트폴리오" />
          </div>
          <div className="absolute right-8 top-16">
            <HeroBadge label="이력서" />
          </div>
          <div className="absolute bottom-10 right-6 md:right-16">
            <HeroBadge label="자기소개서" />
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mx-auto text-[52px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[3.5rem]">
            합격으로 이어지는 서류,
            <br className="hidden md:block" /> 렛츠커리어가 설계합니다
          </h1>
          <p className="md:text-1.25 mt-6 text-[1.125] text-neutral-600">
            직무별 취업시장 맞춤형 교육으로, 취업준비생의 경험과 역량을
            극대화하여 이력서·자기소개서·포트폴리오를 완성합니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#intro"
              className="rounded-2xl inline-flex items-center justify-center bg-[#5F6AF7] px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-[#5160f6] md:px-8 md:text-lg"
            >
              기업 소개서 받기
            </a>
            <CTAButton
              variant="dark"
              onClick={onPrimary}
              className="px-6 py-4 text-base md:px-8 md:text-lg"
            >
              맞춤 교육 문의
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xxs bg-white/90 px-4 py-3 drop-shadow-md backdrop-blur-md">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FF]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#7F89FF"
          aria-hidden
        >
          <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      </span>
      <span className="text-1.125-medium text-neutral-10">{label}</span>
    </div>
  );
}
