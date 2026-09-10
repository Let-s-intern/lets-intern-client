import { JOB_MARKET } from '../data/jobMarket';

/**
 * 시안 3 — 채용공고 예시 + 카피 2블록 (WHY NOW).
 *
 * 좌측 목록은 실시간 공고가 아니라 재구성한 예시다. 각주(`footnote`)를 카드 안에 함께
 * 그린다 — 진짜 공고처럼 보이는데 지원할 수 없으므로, 각주가 빠지면 사용자를 속인다.
 */
export default function JobMarketSection() {
  return (
    <section className="bg-neutral-95 py-16 md:py-24">
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* 좌측 — 공고 예시 카드 */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-8">
            <div className="flex items-baseline justify-between gap-3">
              <strong className="text-xsmall16 text-neutral-0 font-bold">
                {JOB_MARKET.listTitle}{' '}
                <span className="text-primary">{JOB_MARKET.listCount}</span>
              </strong>
              <span className="text-xs text-neutral-50">
                {JOB_MARKET.listCaption}
              </span>
            </div>

            <ul className="divide-neutral-90 border-neutral-90 mt-4 divide-y border-t">
              {JOB_MARKET.postings.map((post) => (
                <li
                  className="flex items-center gap-4 py-4"
                  key={`${post.industry}-${post.role}`}
                >
                  <span className="text-xsmall14 text-neutral-40 w-28 shrink-0 md:w-32">
                    {post.industry}
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="text-xsmall14 text-neutral-0 block font-semibold">
                      {post.role}
                    </strong>
                    <span className="mt-0.5 block text-xs text-neutral-50">
                      {post.tasks}
                    </span>
                  </span>
                  <span className="text-xsmall14 text-neutral-40 w-14 shrink-0 text-right">
                    {post.level}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-center text-xs text-neutral-50">
              {JOB_MARKET.footnote}
            </p>
          </div>

          {/* 우측 — 카피 2블록 */}
          <div className="flex flex-col gap-12 md:gap-20">
            <p className="text-sm font-bold tracking-wide text-[#F1642B] lg:-mb-8">
              {JOB_MARKET.eyebrow}
            </p>

            {JOB_MARKET.copies.map((copy) => (
              <div key={copy.titleLines[0]}>
                <h2 className="text-neutral-0 text-xl font-bold leading-snug md:text-[1.75rem]">
                  {copy.titleLines.map((line) => (
                    <span
                      className={
                        line === copy.highlight ? 'text-primary block' : 'block'
                      }
                      key={line}
                    >
                      {line}
                    </span>
                  ))}
                </h2>
                <div className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4">
                  {copy.body.map((line) => (
                    <span className="block leading-relaxed" key={line}>
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
