/** 저장된 sns 문자열을 URL 배열로 파싱. JSON 배열이면 그대로, 아니면 단일 URL로 취급(하위호환) */
export function parseSnsList(sns: string | null | undefined): string[] {
  if (!sns) return [];
  const trimmed = sns.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (v): v is string => typeof v === 'string' && v.trim() !== '',
      );
    }
    return [trimmed];
  } catch {
    return [trimmed];
  }
}

/** URL 배열을 저장용 JSON 문자열로 직렬화. 빈 항목은 제외, 전부 비면 null */
export function serializeSnsList(list: string[]): string | null {
  const cleaned = list.map((s) => s.trim()).filter((s) => s !== '');
  if (cleaned.length === 0) return null;
  return JSON.stringify(cleaned);
}
