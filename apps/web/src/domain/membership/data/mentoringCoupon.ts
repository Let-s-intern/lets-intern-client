// 1:1 멘토링·커피챗 할인 쿠폰 섹션 — 시안을 통째로 한 장 넣는다.
// 이미지 안에 문구가 들어가므로 alt 로 내용을 문장으로 담는다.

/** `public/images/membership/` 하위 파일 (좌우 여백을 잘라낸 판) */
export const COUPON_SRC = '/images/membership/mentoring-coupon.webp';

/** 원본 픽셀 크기 — next/image 를 쓰지 않으므로 직접 넣어 CLS 를 막는다 */
export const COUPON_SIZE = { width: 1092, height: 829 } as const;

/**
 * 이미지 안 텍스트를 문장으로 옮긴 것.
 * 이름표("쿠폰 이미지") 수준이면 검색·스크린리더 손실을 메우지 못한다.
 */
export const COUPON_ALT =
  '궁금한 점을 1:1로 물어보고 싶다면 1:1 멘토링, 커피챗 50% 할인 이용권 2장. ' +
  '렛츠커리어의 다양한 멘토님들께 취업고민이나 포트폴리오, 이력서 등을 상담해보세요. ' +
  '1:1 멘토링·커피챗 50% OFF 올인원 패스 쿠폰을 총 2장 제공하며, ' +
  '쿠폰 1장당 멘토링 또는 커피챗 1회에 사용할 수 있어요.';
