import type { LiveMentorDetail } from '@/api/live-mentoring/liveMentoringSchema';
import { durationLabel, formatPrice } from '../constants';

/**
 * 시안 0 · 할인율 표시에 쓰는 정가.
 * 판매가는 API(`durationPrices`)에서 오지만 정가는 아직 계약에 없어 운영 고정값을 쓴다.
 * TODO(BE): 진행시간별 정가(listPrice)가 응답에 추가되면 이 상수를 걷어낼 것.
 */
const LIST_PRICE_BY_DURATION: Record<number, number> = {
  30: 50000,
  60: 100000,
};

interface DetailHeroProps {
  detail: LiveMentorDetail;
  /** 진행 기간 표시 문자열. */
  period: string;
}

/**
 * 상세 페이지 최상단 히어로 (시안 0).
 *
 * 어두운 배경 위에 상품명·소개 불릿·평점/후기/멘티 수를 얹고, 우측에 멘토 사진을
 * 흑백으로 깐다. 아래로 진행 기간 바와 플랜 선택 카드가 흰 카드로 놓인다.
 * 결제는 아직 범위 밖이라 플랜은 **표시만** 하고 선택·구매가 되지 않는다.
 */
const DetailHero = ({ detail, period }: DetailHeroProps) => {
  const { profile, durationPrices, price } = detail;
  // 대표 표시는 최저가 기준 — 목록 카드와 같은 규칙이다.
  const cheapest = durationPrices.reduce(
    (min, option) => (option.price < min.price ? option : min),
    durationPrices[0],
  );
  const listPrice = LIST_PRICE_BY_DURATION[cheapest?.duration] ?? price;
  const discountRate =
    listPrice > price ? Math.round((1 - price / listPrice) * 100) : 0;

  return (
    <section className="bg-neutral-0 text-static-100 relative overflow-hidden">
      {/* 멘토 사진 — 시안대로 흑백 처리해 텍스트 가독성을 지킨다 */}
      {profile.profileImage && (
        <img
          src={profile.profileImage}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-[max(20px,calc((100%-1180px)/2))] hidden h-[78%] w-[300px] object-cover object-top opacity-80 grayscale [mask-image:linear-gradient(to_bottom,black_70%,transparent)] lg:block"
        />
      )}

      <div className="mw-1180 relative flex flex-col gap-6 px-5 py-12 md:py-16">
        <div className="flex items-center gap-2">
          <span className="bg-primary text-xxsmall12 rounded-sm px-2 py-1 font-bold">
            BEST
          </span>
          <span className="bg-primary-20 text-primary-dark text-xxsmall12 rounded-sm px-2 py-1 font-semibold">
            선착순 마감
          </span>
        </div>

        <h1 className="text-medium24 md:text-xlarge30 max-w-[640px] font-bold leading-snug">
          {detail.title}
        </h1>

        <ul className="flex flex-col gap-1.5">
          {detail.template.hero.bullets.map((bullet, i) => (
            <li
              key={i}
              className="text-xsmall14 md:text-xsmall16 text-white/85"
            >
              - {bullet}
            </li>
          ))}
        </ul>

        <div className="text-xsmall14 md:text-xsmall16 flex flex-wrap items-center gap-x-5 gap-y-2">
          {/* 후기가 없으면 서버 평점이 null 이다 — 별점을 0.0 으로 꾸미지 않고 통째로 뺀다. */}
          {detail.rating !== null && (
            <span className="flex items-center gap-1.5">
              <span className="text-[#FFB800]" aria-hidden="true">
                ★★★★★
              </span>
              <span className="font-semibold">
                ({detail.rating.toFixed(1)})
              </span>
            </span>
          )}
          <span>후기 {detail.reviewCount}건</span>
        </div>

        {/* 진행 기간 바 */}
        <div className="bg-neutral-95 text-neutral-0 flex flex-col gap-1 rounded-md px-5 py-4 md:flex-row md:items-center md:justify-between">
          <span className="text-xsmall14 md:text-xsmall16 flex items-center gap-2 font-semibold">
            <span aria-hidden="true">📢</span> 진행 기간
          </span>
          <span className="text-xsmall14 text-neutral-30">{period}</span>
        </div>

        {/* 플랜 선택 카드 — 결제 연동 전이라 표시 전용 */}
        <div className="bg-neutral-95 text-neutral-0 flex flex-col gap-4 rounded-md px-5 py-6">
          <p className="text-xsmall16 font-bold">{detail.title}</p>

          <div className="flex flex-col gap-0.5">
            {discountRate > 0 && (
              <span className="text-neutral-45 text-xsmall14 line-through">
                {formatPrice(listPrice)}
              </span>
            )}
            <span className="text-medium22 flex items-baseline gap-2 font-bold">
              {discountRate > 0 && (
                <span className="text-system-error">{discountRate}%</span>
              )}
              {formatPrice(price)}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {durationPrices.map((option) => {
              const optionList =
                LIST_PRICE_BY_DURATION[option.duration] ?? option.price;
              return (
                <li
                  key={option.duration}
                  className="text-xsmall14 flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled
                      aria-label={`[LIVE] 1:1 멘토링 (${durationLabel(option.duration)})`}
                      className="accent-primary h-4 w-4"
                    />
                    [LIVE] 1:1 멘토링 ({durationLabel(option.duration)})
                  </span>
                  <span className="text-neutral-45 flex items-center gap-2">
                    <span className="line-through">
                      {formatPrice(optionList)}
                    </span>
                    <span className="text-neutral-0 font-bold">
                      {formatPrice(option.price)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DetailHero;
