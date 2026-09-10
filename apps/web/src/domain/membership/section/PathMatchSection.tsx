import { PATH_MATCH } from '../data/pathMatch';

/** 시안 7 — 상황별 프로그램 매칭 5줄 (FIND YOUR PATH). */
export default function PathMatchSection() {
  return (
    <section className="bg-neutral-95 py-16 md:py-24">
      <div className="wrap wrap-narrow">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {PATH_MATCH.eyebrow}
        </p>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {PATH_MATCH.title}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {PATH_MATCH.sub}
        </p>

        <ul className="mt-10 flex flex-col gap-3 md:mt-14">
          {PATH_MATCH.rows.map((row) => (
            <li
              className="rounded-xxl flex flex-col gap-3 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:flex-row md:items-center md:gap-8 md:p-7"
              key={row.program}
            >
              <strong className="text-xsmall16 text-neutral-0 flex-1 font-bold">
                {row.situation}
              </strong>

              <span aria-hidden="true" className="text-neutral-50 md:px-4">
                →
              </span>

              <span className="flex-1">
                <strong className="text-primary text-xsmall16 block font-bold">
                  {row.program}
                </strong>
                <span className="text-xsmall14 text-neutral-40 mt-1 block">
                  {row.outcome}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
