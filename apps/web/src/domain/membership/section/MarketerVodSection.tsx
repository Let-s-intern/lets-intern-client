import { formatKRW } from '../data/membership';
import { MARKETER_VOD } from '../data/marketerVod';

/** 시안 12 — 현직자 VOD 카드 (PASS BENEFIT 04, MARKETER INSIGHTS). */
export default function MarketerVodSection() {
  return (
    <section className="bg-[#232433] py-16 md:py-24" id="vod">
      <div className="wrap">
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
            {MARKETER_VOD.badge}
          </span>
          <span className="text-sm font-bold tracking-wide text-[#F1642B]">
            {MARKETER_VOD.eyebrow}
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold leading-snug text-white md:text-[2rem]">
          {MARKETER_VOD.title}
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-70 mt-4 text-center">
          {MARKETER_VOD.sub}
        </p>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
          {MARKETER_VOD.cards.map((card) => (
            <div
              className="rounded-xxl flex flex-col bg-white/5 p-4 md:p-6"
              key={card.title}
            >
              {/* 배너 — 제목·배지·연사 소개가 그림 안에 들어 있다. alt 로 문구를 전한다. */}
              <img
                alt={card.bannerAlt}
                className="w-full rounded-lg"
                loading="lazy"
                src={`/images/membership/${card.banner}`}
              />

              <strong className="text-xsmall16 mt-6 block font-bold text-white">
                {card.title}
              </strong>

              <ul className="mt-4 flex flex-col gap-2">
                {card.bullets.map((bullet) => (
                  <li className="flex gap-2" key={bullet}>
                    <span aria-hidden="true" className="text-primary shrink-0">
                      ✓
                    </span>
                    <span className="text-xsmall14 text-neutral-70">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <span className="text-xsmall14">
                  <span className="text-neutral-60 line-through">
                    정가 {formatKRW(card.regularPrice)}원
                  </span>{' '}
                  <strong className="text-primary font-bold">무료</strong>
                </span>
                <a
                  className="bg-primary text-xsmall14 rounded-lg px-5 py-2.5 font-medium text-white"
                  href={card.url}
                >
                  자세히 보기 →
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xsmall14 text-neutral-70 mt-10 text-center">
          {MARKETER_VOD.footnote}
        </p>
      </div>
    </section>
  );
}
