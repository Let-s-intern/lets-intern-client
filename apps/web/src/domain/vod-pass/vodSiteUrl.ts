/**
 * 세미나 VOD 사이트(`FreeSeminarVodHub`) 주소. 환경마다 다르게 쓰려면 `NEXT_PUBLIC_VOD_SITE_URL` 을 둔다.
 * 끝의 슬래시는 떼어 둔다.
 */
export const VOD_SITE_URL = (
  process.env.NEXT_PUBLIC_VOD_SITE_URL || 'https://vod.letscareer.co.kr'
).replace(/\/+$/, '');

/** VOD 목록 화면. 로그인이 없으면 그 사이트의 로그인 화면으로 이어진다. */
export const VOD_SITE_LIST_URL = `${VOD_SITE_URL}/vod`;
