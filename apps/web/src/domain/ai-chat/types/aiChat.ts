export type AiChatItemKind =
  | 'CHALLENGE'
  | 'LIVE'
  | 'LIVE_MENTORING'
  | 'VOD'
  | 'REPORT'
  | 'GUIDEBOOK'
  | 'MEMBERSHIP'
  | 'BLOG';

export interface AiChatPrice {
  /** 실제 결제 금액 */
  selling: number;
  /** 할인 전 금액. 할인이 없으면 null */
  original: number | null;
  /** 베이직 기준, 보증금 포함 같은 보조 설명 */
  note: string | null;
}

export interface AiChatPeriod {
  start: string | null;
  end: string | null;
}

export interface AiChatItem {
  key: string;
  kind: AiChatItemKind;
  title: string;
  description: string;
  thumbnail: string | null;
  href: string;
  price: AiChatPrice | null;
  /** 모집 기간 */
  recruit: AiChatPeriod | null;
  /** 진행 기간 */
  schedule: AiChatPeriod | null;
}

export interface AiChatReview {
  title: string | null;
  content: string;
  author: string | null;
  meta: string | null;
}

/** 한 프로그램 상세 소개 패널 데이터 */
export interface AiChatProgramDetail {
  item: AiChatItem;
  summary: string | null;
  highlights: { title: string; description: string | null }[];
  /** 커리큘럼(챌린지 회차) 또는 진행 방식(멘토링 시간별 가격) */
  steps: { label: string; title: string }[];
  stepsTitle: string;
  reviews: AiChatReview[];
}

/** AI 가 도구로 띄우는 오른쪽 패널 */
export type AiChatPanel =
  | { type: 'recommend'; items: AiChatItem[] }
  | { type: 'compare'; items: AiChatItem[] }
  | { type: 'detail'; detail: AiChatProgramDetail };

export interface AiChatResponse {
  /** ai: DeepSeek 답변, keyword: 키 미설정·실패 시 키워드 매칭 결과 */
  mode: 'ai' | 'keyword';
  answer: string | null;
  panel: AiChatPanel | null;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatTurn {
  id: number;
  query: string;
  status: 'pending' | 'done' | 'error';
  result?: AiChatResponse;
}
