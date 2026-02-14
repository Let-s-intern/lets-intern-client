import { CHALLENGE_COMPARISON, FREQUENT_COMPARISON, PROGRAMS } from '../constants';

const ComparisonSection = () => {
  return (
    <section className="flex w-full flex-col gap-8" id="curation-comparison">
      <div className="flex flex-col gap-2">
        <h3 className="text-medium22 font-bold text-neutral-0">챌린지별 비교 표</h3>
        <p className="text-xsmall15 text-neutral-40">
          가격, 기간, 피드백, 주요 결과물을 한눈에 비교하세요.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-90 bg-white shadow-sm">
        <div className="hidden grid-cols-7 bg-neutral-96 px-4 py-3 text-xsmall13 font-semibold text-neutral-30 md:grid">
          <span>챌린지</span>
          <span>추천 대상</span>
          <span>기간</span>
          <span>가격(플랜)</span>
          <span>피드백</span>
          <span>결과물</span>
          <span>특징</span>
        </div>
        <div className="divide-y divide-neutral-90">
          {CHALLENGE_COMPARISON.map((row) => {
            const program = PROGRAMS[row.programId];
            return (
              <div
                key={row.programId}
                className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-7 md:items-start md:gap-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-small16 font-semibold text-neutral-0">{program.title}</span>
                  <span className="text-xsmall13 text-neutral-40">{program.subtitle}</span>
                </div>
                <div className="text-xsmall14 text-neutral-40 md:text-xsmall13">{row.target}</div>
                <div className="hidden text-xsmall13 text-neutral-40 md:block">{row.duration}</div>
                <div className="hidden text-xsmall13 text-neutral-40 md:block">{row.pricing}</div>
                <div className="hidden text-xsmall13 text-neutral-40 md:block">{row.feedback}</div>
                <div className="hidden text-xsmall13 text-neutral-40 md:block">{row.deliverable}</div>
                <div className="hidden text-xsmall13 text-neutral-40 md:block">
                  {row.features?.join(' · ')}
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-neutral-96 p-3 text-xsmall14 text-neutral-40 md:hidden">
                  <span>기간: {row.duration}</span>
                  <span>가격: {row.pricing}</span>
                  <span>피드백: {row.feedback}</span>
                  <span>결과물: {row.deliverable}</span>
                  <span>특징: {row.features?.join(' · ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-small18 font-semibold text-neutral-0">빈출질문 챌린지 2:2 비교</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FREQUENT_COMPARISON.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-xl border border-neutral-90 bg-white p-4 shadow-sm"
            >
              <div className="text-small16 font-semibold text-neutral-0">{item.title}</div>
              <div className="grid grid-cols-2 gap-2 text-xsmall13 font-semibold text-neutral-40">
                <span>{item.left}</span>
                <span className="text-right">{item.right}</span>
              </div>
              <div className="flex flex-col gap-2 text-xsmall14 text-neutral-30">
                {item.rows.map((row) => (
                  <div key={`${item.title}-${row.label}`} className="rounded-lg bg-neutral-96 p-3">
                    <p className="text-xsmall12 font-semibold text-neutral-50">{row.label}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <p>{row.left}</p>
                      <p className="md:text-right">{row.right}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
