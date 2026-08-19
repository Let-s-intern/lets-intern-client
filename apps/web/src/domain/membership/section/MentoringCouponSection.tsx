import {
  COUPON_ALT,
  COUPON_SIZE,
  COUPON_SRC,
  MENTORING_COUPON,
} from '../data/mentoringCoupon';

/**
 * 1:1 멘토링·커피챗 할인 쿠폰.
 *
 * 헤더와 각주는 텍스트, 쿠폰 카드만 이미지다. 챌린지 일정 섹션과 같은 구성이다 —
 * 헤더를 이미지에 넣으면 h2 가 사라져 검색에서 통째로 빠진다.
 *
 * 크기는 `styles/mentoring-coupon.css` 의 --coupon-width 하나로 조절한다.
 */
export default function MentoringCouponSection() {
  return (
    <section className="mcoupon" id="mentoring-coupon">
      <div className="wrap">
        <div className="sec-head rv">
          <h2>
            {MENTORING_COUPON.titleTop}
            <br />
            <span className="mcoupon-hl">{MENTORING_COUPON.titleMain}</span>
          </h2>
          <p>{MENTORING_COUPON.subtitle}</p>
        </div>

        <img
          className="mcoupon-img rv"
          src={COUPON_SRC}
          alt={COUPON_ALT}
          width={COUPON_SIZE.width}
          height={COUPON_SIZE.height}
          loading="lazy"
          decoding="async"
        />

        <p className="mcoupon-note rv">{MENTORING_COUPON.footnote}</p>
      </div>
    </section>
  );
}
