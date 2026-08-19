// 1:1 멘토링·커피챗 할인 쿠폰 섹션.
//
// 헤더와 각주는 텍스트, 쿠폰 카드만 이미지다. 카드 이미지는 배경이 투명하므로
// 뒤 배경은 섹션이 깐다(styles/mentoring-coupon.css).
//
// 쿠폰 장수(2장)와 할인율(50%)이 카드 이미지에 박혀 있다 —
// 조건이 바뀌면 이미지를 다시 내보내야 한다.

/** 쿠폰 카드 이미지 (배경 투명) */
export const COUPON_SRC = '/images/membership/mentoring-coupon.webp';

/** 실측 크기. next/image 를 쓰지 않으므로 <img> 에 직접 넣어 CLS 를 막는다 */
export const COUPON_SIZE = { width: 803, height: 415 } as const;

/** 카드 이미지 안 문구를 문장으로 옮긴 것. 이름표 수준으로 줄이지 말 것 */
export const COUPON_ALT =
  '1:1 멘토링·커피챗 50% OFF 올인원 패스 쿠폰. 총 2장 제공.';

/** 헤더와 각주 문구 */
export const MENTORING_COUPON = {
  titleTop: '궁금한 점을 1:1로 물어보고 싶다면',
  /** 두 번째 줄은 포인트 컬러로 강조한다 */
  titleMain: '1:1 멘토링, 커피챗 50% 할인 이용권 2장',
  subtitle:
    '렛츠커리어의 다양한 멘토님들께 취업고민이나 포트폴리오, 이력서 등을 상담해보세요.',
  footnote: '쿠폰 1장당 멘토링 또는 커피챗 1회에 사용할 수 있어요.',
} as const;
