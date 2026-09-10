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

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {PASS_BENEFITS.title}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {PASS_BENEFITS.sub}
        </p>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-6">
          {PASS_BENEFITS.cards.map((card) => (
            <div
              className={`flex flex-col rounded-2xl p-6 md:p-7 ${
                card.accent ? 'bg-[#FDF3EC]' : 'bg-neutral-95'
              } ${card.wide ? 'md:col-span-3' : 'md:col-span-2'}`}
              key={card.title}
            >
              <strong className="text-small18 text-neutral-0 font-bold">
                {card.title}
              </strong>

              <p className="text-xsmall14 text-neutral-40 mt-4 leading-relaxed">
                {card.body.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </p>

              <button
                className={`text-xsmall14 mt-6 self-end font-medium ${
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
