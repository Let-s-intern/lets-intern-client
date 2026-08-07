/** chatLink가 슬랙 초대 링크인지 판별한다(운영이 카카오톡 오픈채팅 대신 슬랙 링크를 넣는 경우가 있음). */
export function isSlackChatLink(link: string): boolean {
  try {
    return new URL(link).hostname.endsWith('slack.com');
  } catch {
    return false;
  }
}

// 운영이 참여코드가 없다는 뜻으로 빈칸 대신 이런 값을 넣는 경우가 있어(예: '없음')
// 방어적으로 "코드 없음"과 동일하게 취급한다 — 그래야 참여코드 확인 모달이 뜨지 않는다.
const NO_CHAT_PASSWORD_VALUES = new Set(['없음', '없다', 'none', 'n/a', 'na']);

/** chatPassword를 정규화한다. 빈칸·공백·"없음"류 값은 모두 "코드 없음"(undefined)으로 취급한다. */
export function normalizeChatPassword(
  password?: string | null,
): string | undefined {
  const trimmed = password?.trim();
  if (!trimmed) return undefined;
  return NO_CHAT_PASSWORD_VALUES.has(trimmed.toLowerCase())
    ? undefined
    : trimmed;
}
