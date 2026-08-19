import { COUPON_ALT, COUPON_SIZE, COUPON_SRC } from '../data/mentoringCoupon';

/**
 * 1:1 멘토링·커피챗 할인 쿠폰 — 시안을 섹션 통째로 한 장 넣는다.
 *
 * 간트(ChallengeScheduleSection)와 같은 방식이다. 헤더·본문·각주가 모두 이미지 안에 있으므로
 * `alt` 로 내용을 문장으로 담아 검색·스크린리더 손실을 메운다.
 *
 * 쿠폰 장수(2장)와 할인율(50%)이 이미지에 박힌다 — 조건이 바뀌면 이미지를 다시 내보내야 한다.
 */
export default function MentoringCouponSection() {
  return (
    <section className="mcoupon" id="mentoring-coupon">
      <div className="wrap">
        <img
          className="mcoupon-img rv"
          src={COUPON_SRC}
          alt={COUPON_ALT}
          width={COUPON_SIZE.width}
          height={COUPON_SIZE.height}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
