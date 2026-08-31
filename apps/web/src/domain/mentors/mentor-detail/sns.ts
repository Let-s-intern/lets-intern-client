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

/** URL 도메인으로 SNS 종류를 판별해 아이콘 경로 반환. 매칭 없으면 일반 링크 아이콘 */
export function getSnsIcon(url: string): string {
  const u = url.toLowerCase();
  if (u.includes('instagram.com')) return '/icons/instagram-icon.svg';
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    return '/icons/youtube-icon.svg';
  }
  if (u.includes('naver')) return '/icons/naver-blog-icon.svg';
  if (u.includes('linkedin.com')) return '/icons/linkedin-icon.svg';
  return '/icons/link-02.svg';
}
