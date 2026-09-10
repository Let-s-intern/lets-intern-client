import { RECOMMEND } from '../data/recommend';

/**
 * 시안 2 — 고민 카드 3장 (WHERE DO I START?).
 *
 * 기존 멤버십의 3열 페인포인트 구조와 형태가 달라 컴포넌트를 새로 썼다. 레거시
 * `styles/recommend.css` 는 되살리지 않고 Tailwind 로 그린다 — 이 섹션만 쓰는 규칙을
 * 전역 CSS 에 얹으면 다음 시즌에 무엇이 살아 있는 규칙인지 알기 어려워진다.
 */
export default function RecommendSection() {
  return (
    <section className="bg-neutral-95 py-16 md:py-24">
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {RECOMMEND.eyebrow}
        </p>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          {RECOMMEND.titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          {RECOMMEND.sub}
        </p>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {RECOMMEND.cards.map((card) => (
            <div
              className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-7"
              key={card.no}
            >
              <span className="bg-primary-10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">
                {card.no}
              </span>
              <strong className="text-small18 text-neutral-0 mt-5 block font-bold">
                {card.title}
              </strong>
              <p className="text-xsmall14 text-neutral-40 mt-3 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
