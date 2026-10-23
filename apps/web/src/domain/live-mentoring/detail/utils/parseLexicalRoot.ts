import type { SerializedLexicalNode } from 'lexical';

/**
 * Lexical JSON 문자열에서 root 노드를 꺼낸다. 비었거나 형식이 아니면 null.
 *
 * `domain/mentors/mentor-detail/MentorIntroSection.tsx` 의 지역 함수와 같은 동작이다.
 * 도메인 간 import 가 금지라 따로 둔다.
 */
export const parseLexicalRoot = (
  json: string | null | undefined,
): SerializedLexicalNode | null => {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (
      parsed?.root &&
      typeof parsed.root === 'object' &&
      'type' in parsed.root
    ) {
      return parsed.root;
    }
    return null;
  } catch {
    return null;
  }
};
