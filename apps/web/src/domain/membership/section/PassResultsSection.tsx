import { PASS_RESULTS } from '../data/passResults';

/**
 * 개편 시안 5 — 합격 사례 (REAL RESULTS).
 *
 * 카드 줄은 왼쪽으로 끊김 없이 흐른다. 같은 목록을 두 벌 이어 붙이고 한 벌 폭만큼
 * 밀었다가 되돌아오므로 이음매가 보이지 않는다 (`styles/animations.css` 의 marquee).
 * 좌우 끝이 흐리게 잘리는 모습은 mask-image 로 시안과 같게 만든다.
 *
 * 둘째 벌은 화면 낭독기에 같은 문장을 두 번 읽히지 않도록 `aria-hidden` 이다.
 */
export default function PassResultsSection() {
  const title = PASS_RESULTS.titleLines[0];
  const at = title.indexOf(PASS_RESULTS.titleHighlight);

  return (
    <section className="bg-[#F4F5F9] py-16 md:py-24" id={PASS_RESULTS.anchorId}>
      <div className="wrap">
        <p className="text-center text-sm font-bold tracking-wide text-[#F1642B]">
          {PASS_RESULTS.eyebrow}
        </p>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          <span className="block">
            {title.slice(0, at)}
            <span className="text-primary">{PASS_RESULTS.titleHighlight}</span>
            {title.slice(at + PASS_RESULTS.titleHighlight.length)}
          </span>
          <span className="block">{PASS_RESULTS.titleLines[1]}</span>
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center leading-relaxed">
          {PASS_RESULTS.subLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>
      </div>

      {/*
        카드 줄만 `wrap` 밖으로 낸다. 좌우 끝이 화면 가장자리까지 이어지며 흐려져야
        시안처럼 "계속 이어지는 목록" 으로 보인다. wrap 안에 두면 여백에서 끊긴다.
      */}
      <div
        className="marquee mt-10 overflow-hidden md:mt-14"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <ul className="marquee-track flex w-max gap-4 pl-4 md:gap-6 md:pl-6">
          {[...PASS_RESULTS.cards, ...PASS_RESULTS.cards].map((card, index) => (
            <li
              aria-hidden={index >= PASS_RESULTS.cards.length}
              className="rounded-xxl w-[280px] shrink-0 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:w-[320px] md:p-7"
              key={`${card.company}-${card.role}-${index}`}
            >
              <strong className="text-small18 text-neutral-0 block font-bold">
                {card.company}
              </strong>
              <p className="text-xsmall14 text-neutral-40 mt-2">{card.role}</p>

              <span
                className={`mt-5 inline-flex rounded-full px-4 py-1.5 text-xs font-bold ${
                  card.employment === '정규직'
                    ? 'bg-primary text-white'
                    : 'border-neutral-80 text-neutral-40 border'
                }`}
              >
                {card.employment}
              </span>

              <p className="border-neutral-90 text-neutral-45 mt-5 border-t pt-4 text-xs">
                {PASS_RESULTS.studentNote}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <p className="text-xsmall14 md:text-xsmall16 text-neutral-20 mt-10 text-center font-bold leading-relaxed md:mt-14">
          {PASS_RESULTS.footnote}
        </p>
      </div>
    </section>
  );
}
