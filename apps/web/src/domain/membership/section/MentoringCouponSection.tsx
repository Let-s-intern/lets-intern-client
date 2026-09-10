import { MENTORING_COUPON } from '../data/mentoringCoupon';

/** 시안 14 — 1:1 멘토링 50% 할인 쿠폰 (PASS BENEFIT 06). */
export default function MentoringCouponSection() {
  return (
    <section className="bg-white py-16 md:py-24" id="mentoring-coupon">
      <div className="wrap">
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
            {MENTORING_COUPON.badge}
          </span>
          <span className="text-sm font-bold tracking-wide text-[#F1642B]">
            {MENTORING_COUPON.eyebrow}
          </span>
        </div>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {MENTORING_COUPON.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {MENTORING_COUPON.sub}
        </p>

        <div className="mt-10 grid overflow-hidden rounded-2xl bg-[#232433] md:mt-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {/* 좌측 — 할인율 */}
          <div className="p-8 md:border-r md:border-white/10 md:p-10">
            <span className="inline-block rounded-full bg-[#F1642B] px-3 py-1.5 text-xs font-bold text-white">
              {MENTORING_COUPON.passOnly}
            </span>

            <strong className="mt-8 block text-5xl font-bold text-white md:text-6xl">
              {MENTORING_COUPON.rate}
            </strong>

            <strong className="text-small18 mt-4 block font-bold leading-snug text-white">
              {MENTORING_COUPON.rateTitleLines.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </strong>

            <p className="text-xsmall14 text-neutral-70 mt-6 leading-relaxed">
              {MENTORING_COUPON.rateBody.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </p>

            <p className="text-neutral-60 mt-6 text-xs">
              {MENTORING_COUPON.rateFine}
            </p>
          </div>

          {/* 우측 — 현직자 예시 */}
          <div className="p-8 md:p-10">
            <div className="flex items-baseline justify-between gap-3">
              <strong className="text-xsmall16 font-bold text-white">
                {MENTORING_COUPON.mentorsTitle}
              </strong>
              <span className="text-neutral-60 text-xs">
                {MENTORING_COUPON.mentorsNote}
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {MENTORING_COUPON.mentors.map((mentor) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-4"
                  key={`${mentor.company}-${mentor.role}`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold text-white ${mentor.color}`}
                  >
                    {mentor.short}
                  </span>
                  <span className="min-w-0">
                    <strong className="text-xsmall14 block font-bold text-white">
                      {mentor.company}
                    </strong>
                    <span className="text-neutral-60 block text-xs">
                      {mentor.role}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-50">
          {MENTORING_COUPON.footnote}
        </p>
      </div>
    </section>
  );
}
