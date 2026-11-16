import { PASS_BENEFITS } from '../data/passBenefits';

/**
 * 시안 6 — 혜택 카드 7장 (PASS BENEFITS).
 *
 * "자세히 보기" 는 랜딩 안의 해당 혜택 섹션으로 스크롤한다. 외부로 내보내면 방문자가
 * 랜딩을 이탈해 나머지 혜택을 못 본다.
 */
export default function PassBenefitsSection() {
  const scrollTo = (anchor: string) =>
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="bg-white py-16 md:py-24" id="benefits">
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {PASS_BENEFITS.eyebrow}
        </p>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-neutral-0 md:text-[2rem]">
          {PASS_BENEFITS.title}
        </h2>

        <p className="mt-4 text-center text-xsmall14 text-neutral-40 md:text-xsmall16">
          {PASS_BENEFITS.sub}
        </p>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-6">
          {PASS_BENEFITS.cards.map((card) => (
            <div
              className={`flex flex-col rounded-xxl p-6 md:p-7 ${
                card.accent ? 'bg-[#FDF3EC]' : 'bg-neutral-95'
              } ${card.wide ? 'md:col-span-3' : 'md:col-span-2'}`}
              key={card.title}
            >
              <strong className="text-small18 font-bold text-neutral-0">
                {card.title}
              </strong>

              <p className="mt-4 text-xsmall14 leading-relaxed text-neutral-40">
                {card.body.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </p>

              <button
                className={`mt-6 self-end text-xsmall14 font-medium ${
                  card.accent ? 'text-[#F1642B]' : 'text-primary'
                }`}
                onClick={() => scrollTo(card.anchor)}
                type="button"
              >
                자세히 보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
