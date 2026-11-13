export const HOME_SEARCH_MAX_RESULTS = 6;
export const HOME_SEARCH_QUERY_MAX_LENGTH = 100;

export const HOME_SEARCH_CATEGORIES = [
  { value: 'ALL', label: '전체' },
  { value: 'CHALLENGE', label: '챌린지' },
  { value: 'VOD', label: 'VOD' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'BLOG', label: '블로그' },
] as const;

export type HomeSearchCategory =
  (typeof HOME_SEARCH_CATEGORIES)[number]['value'];

export interface HomeSearchItem {
  key: string;
  kind:
    | 'CHALLENGE'
    | 'LIVE'
    | 'LIVE_MENTORING'
    | 'VOD'
    | 'REPORT'
    | 'GUIDEBOOK'
    | 'BLOG';
  title: string;
  description: string;
  thumbnail: string | null;
  href: string;
}

export interface HomeSearchResponse {
  /** ai: DeepSeek 가 고른 결과, keyword: 키 미설정·실패 시 키워드 매칭 결과 */
  mode: 'ai' | 'keyword';
  answer: string | null;
  items: HomeSearchItem[];
}
