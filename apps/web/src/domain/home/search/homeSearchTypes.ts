export const HOME_SEARCH_MAX_RESULTS = 6;
export const HOME_SEARCH_QUERY_MAX_LENGTH = 100;
/** 서버로 보내는 이전 대화 수와 메시지당 길이 상한 (비용·남용 방지) */
export const HOME_SEARCH_HISTORY_MAX_MESSAGES = 6;
export const HOME_SEARCH_HISTORY_MAX_LENGTH = 500;

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
  /** AI 가 show_programs 도구를 호출했을 때(키워드 검색은 결과가 있을 때)만 오른쪽 패널을 띄운다 */
  showPanel: boolean;
}

export interface HomeSearchChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
