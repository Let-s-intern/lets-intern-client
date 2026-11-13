import { AiChatItemKind } from '../types/aiChat';

export const AI_CHAT_API_PATH = '/api/ai-chat';

export const AI_CHAT_QUERY_MAX_LENGTH = 200;
/** 서버로 보내는 이전 대화 수와 메시지당 길이 상한 (비용·남용 방지) */
export const AI_CHAT_HISTORY_MAX_MESSAGES = 6;
export const AI_CHAT_HISTORY_MAX_LENGTH = 800;

export const AI_CHAT_RECOMMEND_MAX = 6;
export const AI_CHAT_COMPARE_MAX = 4;

export const AI_CHAT_KIND_LABEL: Record<AiChatItemKind, string> = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  LIVE_MENTORING: 'LIVE 멘토링',
  VOD: 'VOD',
  REPORT: '서류 진단',
  GUIDEBOOK: '가이드북',
  BLOG: '블로그',
};

/** 입력창 placeholder 로 돌아가며 보여주는 질문 예시. 어떻게 물어보면 되는지 알려준다 */
export const AI_CHAT_PLACEHOLDER_EXAMPLES = [
  '내일 삼성 인적성 시험인데 자료집 추천해 줘',
  '삼성 면접 준비 중인데 도움 될 프로그램 추천해 줘',
  '내일 삼성 인적성 시험인데 뭐부터 봐야 해요?',
  '자소서 챌린지랑 가이드북 가격 비교해 줘',
  '무경력 대학생인데 이력서 어떻게 시작해요?',
  '지원동기를 매번 뻔하게 써요',
  '다음 주 면접인데 3일 안에 준비할 수 있을까요?',
  '마케팅 직무 포트폴리오 준비하고 싶어요',
];
export const AI_CHAT_PLACEHOLDER_INTERVAL_MS = 3000;
