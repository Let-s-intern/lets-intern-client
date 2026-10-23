/**
 * 회의 서버 주소 검증. 서버 `MeetingServerServiceImpl#validateBaseUrl` 과 같은 규칙이다.
 *
 * 최종 판정은 서버가 한다(400 `MEETING_SERVER_INVALID_BASE_URL`). 여기서 먼저 거르는 이유는
 * 사유를 입력칸 옆에 바로 보여주기 위해서다.
 *
 * 문제가 없으면 null, 있으면 화면에 그대로 띄울 한국어 사유.
 */
export const validateMeetingServerBaseUrl = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return '주소를 입력해 주세요.';

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return 'https://로 시작하는 전체 주소를 입력해 주세요.';
  }

  // http 를 열어 두면 중간자가 회의 주소를 바꿔치기할 수 있다.
  if (url.protocol !== 'https:') return 'https 주소만 등록할 수 있습니다.';

  // `https://a@evil/` 은 앞쪽 호스트처럼 보이지만 실제 접속지는 뒤쪽이다.
  if (url.username || url.password || trimmed.includes('@')) {
    return '주소에 사용자 정보(@)를 넣을 수 없습니다.';
  }

  // `URL` 은 빈 `?`·`#` 를 지워 버리므로 원문으로 본다.
  if (trimmed.includes('?') || trimmed.includes('#')) {
    return '주소에 ? 나 # 를 넣을 수 없습니다.';
  }

  // 방 이름을 이어 붙이므로 `/` 로 끝나야 한다.
  if (!trimmed.endsWith('/')) return '주소는 / 로 끝나야 합니다.';

  return null;
};
