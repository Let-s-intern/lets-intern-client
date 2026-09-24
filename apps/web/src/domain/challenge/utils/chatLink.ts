/**
 * 챌린지 오픈채팅방 링크 판별.
 *
 * `chatLink` 는 어드민이 자유 URL 로 넣는 값이고(어드민 라벨도 "오픈채팅방 링크
 * (카카오톡/슬랙)" 이다), 종류를 알려주는 플래그가 따로 없다. 그래서 호스트로 가른다.
 */

/** chatLink 가 슬랙 초대 링크인지 판별한다. */
export function isSlackChatLink(link: string): boolean {
  try {
    return new URL(link).hostname.endsWith('slack.com');
  } catch {
    return false;
  }
}

// 운영이 참여코드가 없다는 뜻으로 빈칸 대신 이런 값을 넣는 경우가 있어
// "코드 없음" 과 같게 취급한다 — 그래야 참여코드 모달이 뜨지 않는다.
const NO_CHAT_PASSWORD_VALUES = new Set(['없음', '없다', 'none', 'n/a', 'na']);

/** chatPassword 를 정규화한다. 빈칸·공백·"없음"류 값은 모두 undefined 로 만든다. */
export function normalizeChatPassword(
  password?: string | null,
): string | undefined {
  const trimmed = password?.trim();
  if (!trimmed) return undefined;
  return NO_CHAT_PASSWORD_VALUES.has(trimmed.toLowerCase())
    ? undefined
    : trimmed;
}
