/**
 * 자료집 설명(introduction)은 JSON `{ summary, bullets }` 문자열로 저장.
 * 유저단(web MaterialsView)의 파싱과 동일 규칙 — 구버전 평문은 전체를 summary로.
 */
export interface MaterialIntro {
  summary: string;
  bullets: string[];
}

export const parseMaterialIntro = (
  introduction?: string | null,
): MaterialIntro => {
  if (!introduction) return { summary: '', bullets: [] };
  try {
    const parsed = JSON.parse(introduction);
    if (parsed && typeof parsed === 'object' && 'summary' in parsed) {
      return {
        summary: String(parsed.summary ?? ''),
        bullets: Array.isArray(parsed.bullets)
          ? parsed.bullets.map(String)
          : [],
      };
    }
  } catch {
    // 구버전 평문
  }
  return { summary: introduction, bullets: [] };
};

/** 빈 불릿은 제거하고 JSON 문자열로 직렬화. */
export const serializeMaterialIntro = (
  summary: string,
  bullets: string[],
): string =>
  JSON.stringify({
    summary: summary.trim(),
    bullets: bullets.map((b) => b.trim()).filter(Boolean),
  });
