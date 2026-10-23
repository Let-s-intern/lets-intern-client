/** Lexical editor state JSON 에서 순수 텍스트만 뽑는다(공백 판정용). */
function extractLexicalText(node: unknown): string {
  if (node == null || typeof node !== 'object') return '';
  const n = node as { text?: unknown; children?: unknown };
  const own = typeof n.text === 'string' ? n.text : '';
  const kids = Array.isArray(n.children)
    ? n.children.map(extractLexicalText).join('')
    : '';
  return own + kids;
}

/**
 * 본문이 실질적으로 비었는지. 빈 에디터도 `{"root":{...}}` 형태의 JSON 이라
 * 문자열 비교만으로는 "내용 없음" 을 알 수 없다.
 */
export function isBlankFeedback(json?: string | null): boolean {
  if (!json) return true;
  try {
    return extractLexicalText(JSON.parse(json)?.root).trim().length === 0;
  } catch {
    return true;
  }
}
