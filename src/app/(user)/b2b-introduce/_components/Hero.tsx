'use client';

import { Break } from '@components/Break';

type Props = { onPrimary?: () => void; primaryHref?: string };

export default function Hero({ onPrimary, primaryHref }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#F7F9FF_0%,#FFFFFF_60%)]">
      <div className="mw-1180 relative py-16 md:py-24 lg:py-36">
        {/* floating badges (desktop only) */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
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
          {/* chips above heading (mobile only) */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:hidden">
            {['포트폴리오', '이력서', '자기소개서'].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xsmall16 text-neutral-10 shadow-sm backdrop-blur"
              >
                {label}
              </span>
            ))}
          </div>
          <h1 className="mx-auto text-[52px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[3.5rem]">
            합격으로 이어지는 서류,
            <br className="hidden md:block" /> 렛츠커리어가 설계합니다
          </h1>
          <p className="mt-6 text-xsmall16 text-neutral-40 md:text-small20">
            직무별 취업시장 맞춤형 교육으로, 취업준비생의 경험과 역량을
            <Break />
            극대화하여 이력서·자기소개서·포트폴리오를 완성합니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#intro"
              className="inline-flex items-center justify-center rounded-xs bg-primary-90 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-primary-90 md:px-5 md:text-xsmall16"
            >
              기업 소개서 받기
            </a>
            {primaryHref ? (
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-xs bg-neutral-900 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:px-5 md:text-xsmall16"
              >
                맞춤 교육 문의
              </a>
            ) : (
              <button
                onClick={onPrimary}
                className="inline-flex items-center justify-center rounded-xs bg-neutral-900 px-5 py-3 text-xsmall16 font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:px-5 md:text-xsmall16"
              >
                맞춤 교육 문의
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ label }: { label: string }) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-xxs bg-white/90 px-3 drop-shadow-md backdrop-blur-md">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xxs bg-[#EEF0FF]">
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
      <span className="text-xsmall16 text-neutral-10">{label}</span>
    </div>
  );
}
