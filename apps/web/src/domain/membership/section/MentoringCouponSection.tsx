import {
  COUPON_ALT,
  COUPON_SIZE,
  COUPON_SRC,
  MENTORING_COUPON,
} from '../data/mentoringCoupon';

/**
 * 1:1 멘토링·커피챗 할인 쿠폰.
 *
 * 헤더와 각주는 텍스트, 쿠폰 카드만 이미지다.
 * 헤더를 이미지에 넣으면 제목이 사라져 검색에서 통째로 빠진다.
 *
 * 이 섹션은 혜택 묶음(가이드북 / 챌린지 7종 / 직무별 챌린지 3종)의 다음 블록이다.
 * 그래서 제목을 섹션 h2 가 아니라 그 블록들과 같은 h3 계층으로 둔다 —
 * 이 묶음의 h2 는 CoursePlanSection 이 렌더하는 시안 6-0 헤더다.
 *
 * 크기는 `styles/mentoring-coupon.css` 의 --coupon-width 하나로 조절한다.
 */
export default function MentoringCouponSection() {
  return (
    <section className="mcoupon" id="mentoring-coupon">
      <div className="wrap">
        <div className="mcoupon-head rv">
          <h3>
            {MENTORING_COUPON.titleTop}
            <br />
            <span className="mcoupon-hl">{MENTORING_COUPON.titleMain}</span>
          </h3>
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
