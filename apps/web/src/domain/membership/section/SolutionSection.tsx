import { SOLUTION } from '../data/solution';

/** 시안 5 — 결과물 3카드 + 하단 강조 밴드 (YOUR JOB ROADMAP). */
export default function SolutionSection() {
  return (
    <>
      <section className="bg-neutral-95 py-16 md:py-24">
        <div className="wrap">
          <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
            {SOLUTION.eyebrow}
          </p>

          <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
            {SOLUTION.title}
          </h2>

          <div className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
            {SOLUTION.subLines.map((line) => (
              <span className="block leading-relaxed" key={line}>
                {line}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
            {SOLUTION.cards.map((card) => (
              <div
                className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-7"
                key={card.index}
              >
                <p className="text-xs font-bold tracking-wide text-[#F6A780]">
                  {card.index} {card.label}
                </p>

                <strong className="text-small18 text-neutral-0 mt-5 block font-bold leading-snug">
                  {card.titleLines.map((line) => (
                    <span className="block" key={line}>
                      {line}
                    </span>
                  ))}
                </strong>

                <p className="text-xsmall14 text-neutral-40 mt-5 leading-relaxed">
                  {card.body.map((line) => (
                    <span className="block" key={line}>
                      {line}
                    </span>
                  ))}
                </p>

                {card.chips ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {card.chips.map((chip) => (
                      <span
                        className="bg-neutral-95 text-xsmall14 text-neutral-30 rounded-full px-3 py-1.5"
                        key={chip}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}

                {card.checks ? (
                  <ul className="mt-6 flex flex-col gap-3">
                    {card.checks.map((check) => (
                      <li className="flex items-center gap-2" key={check}>
                        <span
                          aria-hidden="true"
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F1642B] text-[0.65rem] text-white"
                        >
                          ✓
                        </span>
                        <span className="text-xsmall14 text-neutral-0 font-medium">
                          {check}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#232433] px-5 py-10 text-center md:py-14">
        <p className="text-xsmall14 text-neutral-70">{SOLUTION.bandLead}</p>
        <p className="text-small18 mt-2 font-bold text-white md:text-2xl">
          {SOLUTION.bandMain}
        </p>
      </div>
    </>
  );
}
