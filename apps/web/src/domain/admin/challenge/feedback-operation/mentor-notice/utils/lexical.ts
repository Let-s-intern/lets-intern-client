/** 문자열이 Lexical JSON인지 확인. 아니면 Lexical JSON으로 감싸서 반환 */
export function toLexicalJson(text: string | undefined): string | undefined {
  if (!text) return undefined;
  try {
    const parsed = JSON.parse(text);
    if (parsed?.root) return text; // 이미 Lexical JSON
  } catch {
    // 일반 텍스트 → Lexical paragraph로 감싸기
    return JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text,
                type: 'text',
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    });
  }
  return text;
}
