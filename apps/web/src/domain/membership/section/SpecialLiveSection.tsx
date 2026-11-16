import { SPECIAL_LIVE } from '../data/specialLive';

/** 시안 13 — 쥬디 LIVE 클리닉 + 특별 세미나 (PASS BENEFIT 05). */
export default function SpecialLiveSection() {
  const { clinic, seminar } = SPECIAL_LIVE;

  return (
    <section className="bg-white py-16 md:py-24" id="special-live">
      <div className="wrap">
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
            {SPECIAL_LIVE.badge}
          </span>
          <span className="text-sm font-bold tracking-wide text-[#F1642B]">
            {SPECIAL_LIVE.eyebrow}
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-neutral-0 md:text-[2rem]">
          {SPECIAL_LIVE.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="mt-4 text-center text-xsmall14 text-neutral-40 md:text-xsmall16">
          {SPECIAL_LIVE.sub}
        </p>

        {/* 쥬디 클리닉 — 어두운 강조 카드 */}
        <div className="mt-10 rounded-xxl bg-[#232433] p-6 md:mt-14 md:p-8">
          <span className="inline-block rounded-lg bg-[#F1642B] px-3 py-1.5 text-xs font-bold text-white">
            {clinic.tag}
          </span>
          <strong className="mt-5 block text-small18 font-bold text-white md:text-xl">
            {clinic.title}
          </strong>
          <p className="mt-4 text-xsmall14 leading-relaxed text-neutral-70">
            {clinic.bodyLead}
            <strong className="font-bold text-white">{clinic.bodyCount}</strong>
            {clinic.bodyMid}
            <strong className="font-bold text-[#F6A780]">
              {clinic.bodyHighlight}
            </strong>
            {clinic.bodyTail}
          </p>
        </div>

        {/* 특별 세미나 — 흰 카드 */}
        <div className="mt-4 rounded-xxl border border-neutral-90 p-6 md:p-8">
          <strong className="block text-xsmall16 font-bold text-neutral-0">
            {seminar.title}
          </strong>
          <p className="mt-4 text-xsmall14 leading-relaxed text-neutral-40">
            {seminar.body.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
