import { ROADMAP } from '../data/roadmap';

/**
 * 시안 4 — STEP 01~05 세로 목록 (START WITH A DRAFT).
 *
 * 어두운 배경 섹션이다. 기존 지그재그 타임라인(`styles/roadmap.css`)은 시안이 바뀌며
 * 쓰지 않게 됐다 — CSS 파일은 남겨 두고 여기서는 Tailwind 로만 그린다.
 */
export default function RoadmapSection() {
  return (
    <section className="bg-[#232433] py-16 md:py-24">
      <div className="wrap wrap-narrow">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {ROADMAP.eyebrow}
        </p>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-white md:text-[2rem]">
          {ROADMAP.title}
        </h2>

        <div className="text-xsmall14 md:text-xsmall16 text-neutral-70 mt-4 text-center">
          {ROADMAP.subLines.map((line) => (
            <span className="block leading-relaxed" key={line}>
              {line}
            </span>
          ))}
        </div>

        <ol className="mt-10 md:mt-16">
          {ROADMAP.steps.map((step, i) => (
            <li
              className={`flex flex-col gap-1 py-6 md:flex-row md:gap-8 md:py-7 ${
                i > 0 ? 'border-t border-white/10' : ''
              }`}
              key={step.label}
            >
              <span className="text-xsmall14 w-24 shrink-0 font-bold text-[#F1642B]">
                {step.label}
              </span>
              <span className="min-w-0">
                <strong className="text-xsmall16 block font-bold text-white">
                  {step.title}
                </strong>
                <span className="text-xsmall14 text-neutral-70 mt-2 block leading-relaxed">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
