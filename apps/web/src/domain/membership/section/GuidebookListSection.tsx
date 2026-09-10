import { GUIDEBOOK_ITEMS } from '../data/guidebooks';

/**
 * 시안 11 — 가이드북 7종 카드 그리드 (PASS BENEFIT 03).
 *
 * 상단 배지를 `7 GUIDE BOOK` 으로 적는다. 시안은 `6 GUIDE BOOK` 이라고 썼지만 제목도
 * "7종" 이고 카드도 7장이라 배지 쪽이 오타로 보인다.
 */
export default function GuidebookListSection() {
  return (
    <section className="bg-white py-16 md:py-24" id="guidebooks">
      <div className="wrap">
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
            PASS BENEFIT 03
          </span>
          <span className="text-sm font-bold tracking-wide text-[#F1642B]">
            7 GUIDE BOOK
          </span>
        </div>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          취준 필수 가이드북 7종
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          패스 이용기간 동안 자유롭게 이용할 수 있어요.
        </p>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
          {GUIDEBOOK_ITEMS.map((item) => (
            <a
              className="rounded-xxl flex flex-col bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
              href={item.url}
              key={item.label}
              rel="noreferrer"
              target="_blank"
            >
              <img
                alt=""
                className="w-full rounded-lg"
                loading="lazy"
                src={`/images/membership/${item.src}`}
              />
              <div className="flex flex-1 flex-col justify-between pt-4">
                <strong className="text-xsmall16 text-neutral-0 font-bold">
                  {item.label}
                </strong>
                <span className="text-primary text-xsmall14 mt-6 self-end font-medium">
                  가이드북 자세히 보기 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
