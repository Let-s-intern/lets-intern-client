import type { SsoRedirectWhitelist } from '@/api/ssoSchema';

/**
 * SSO 리다이렉트 화이트리스트 목 시드 (LC-3208).
 *
 * 세 행이 화면의 세 가지 상태를 각각 담당한다.
 *   1 → 실제로 붙일 VOD 콜백 (활성)
 *   2 → 비활성 행. 장애 대응으로 잠시 막아 둔 상태를 눈으로 확인하려면 처음부터 하나는
 *        꺼져 있어야 한다. 켜진 행만 있으면 토글을 눌러 보기 전까지 꺼진 모양을 못 본다.
 *   3 → 로컬 개발용 http origin. `https` 강제 검증이 localhost 를 막아 버리면
 *        개발자가 자기 화면을 등록하지 못한다는 사실을 목에서부터 드러낸다.
 */
export const seedSsoRedirectWhitelists: SsoRedirectWhitelist[] = [
  {
    id: 1,
    serviceName: 'FreeSeminarVodHub',
    allowedRedirectUri: 'https://vod.letscareer.co.kr/auth/callback',
    isActive: true,
    createDate: '2026-08-01T10:00:00',
  },
  {
    id: 2,
    serviceName: '인적성 모의고사',
    allowedRedirectUri: 'https://exam.letscareer.co.kr/auth/callback',
    isActive: false,
    createDate: '2026-08-03T14:30:00',
  },
  {
    id: 3,
    serviceName: 'VOD 로컬 개발',
    allowedRedirectUri: 'http://localhost:3000/auth/callback',
    isActive: true,
    createDate: '2026-08-05T09:15:00',
  },
];
