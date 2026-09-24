// 얼리버드 최상단 배너 설정. (시안: 히어로/네비 직후 최상단 풀폭 배너)
// TODO(open-issue §6-4): 실제 배너 이미지 asset·링크 타깃·노출 기간 확정 필요.
// image 가 비어 있으면 EarlyBirdBanner 는 렌더하지 않는다(빈 공간 방지).

export const EARLY_BIRD = {
  /** public 기준 절대경로. asset 수령 후 예: '/images/membership/earlybird-banner.png' */
  image: '',
  /** 데스크톱/모바일 분리 시 사용(없으면 image 재사용) */
  imageMobile: '',
  alt: '하반기 멤버십 얼리버드 배너',
  /** 클릭 이동 대상. 비어 있으면 클릭 불가(정적 이미지) */
  href: '',
} as const;
