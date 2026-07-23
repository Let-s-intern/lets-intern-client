/**
 * "듣고 싶은 챌린지 제안하기" CTA가 연결할 마그넷 ID.
 * 환경변수 `NEXT_PUBLIC_SEMINAR_MAGNET_ID` 로 세팅하며, 미설정 시 99로 폴백한다.
 */
export const SEMINAR_MAGNET_ID =
  Number(process.env.NEXT_PUBLIC_SEMINAR_MAGNET_ID) || 99;
