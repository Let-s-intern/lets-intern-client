import { PATH_MATCH } from '../data/pathMatch';

/** 시안 7 — 상황별 프로그램 매칭 5줄 (FIND YOUR PATH). */
export default function PathMatchSection() {
  return (
    <section className="bg-neutral-95 py-16 md:py-24">
      <div className="wrap wrap-narrow">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {PATH_MATCH.eyebrow}
        </p>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-neutral-0 md:text-[2rem]">
          {PATH_MATCH.title}
        </h2>

        <p className="mt-4 text-center text-xsmall14 text-neutral-40 md:text-xsmall16">
          {PATH_MATCH.sub}
        </p>

        <ul className="mt-10 flex flex-col gap-3 md:mt-14">
          {PATH_MATCH.rows.map((row) => (
            <li
              className="flex flex-col gap-3 rounded-xxl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:flex-row md:items-center md:gap-8 md:p-7"
              key={row.program}
            >
              <strong className="flex-1 text-xsmall16 font-bold text-neutral-0">
                {row.situation}
              </strong>

              <span aria-hidden="true" className="text-neutral-50 md:px-4">
                →
              </span>

              <span className="flex-1">
                <strong className="block text-xsmall16 font-bold text-primary">
                  {row.program}
                </strong>
                <span className="mt-1 block text-xsmall14 text-neutral-40">
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
