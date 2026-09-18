import { PASS_RESULTS } from '../data/passResults';

/**
 * 개편 시안 5 — 합격 사례 (REAL RESULTS).
 *
 * 카드 줄은 가로 스크롤이다. 시안은 좌우로 천천히 흐르는 캐러셀이지만 자동 흐름은 넣지
 * 않았다 — keyframes 가 필요해 CSS 파일을 건드려야 하고, 카드에 링크가 없어 흐름이
 * 전하는 정보도 없다. 좌우 끝이 흐리게 잘리는 모습은 mask-image 로 같게 만든다.
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
        className="mt-10 overflow-x-auto [scrollbar-width:none] md:mt-14 [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <ul className="flex w-max gap-4 px-6 md:gap-6 md:px-10">
          {PASS_RESULTS.cards.map((card) => (
            <li
              className="rounded-xxl w-[280px] shrink-0 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:w-[320px] md:p-7"
              key={`${card.company}-${card.role}`}
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
