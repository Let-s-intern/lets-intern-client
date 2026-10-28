/**
 * 저장된 `user.sns` 문자열을 URL 배열로 파싱. JSON 배열이면 그대로, 아니면 단일 URL 로 취급한다.
 * 도메인 간 import 를 피하려고 `domain/mentors/mentor-detail/sns.ts` 의 같은 함수를 옮겨 왔다.
 * 저장 형식이 바뀌면 두 곳을 함께 고친다.
 */
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
