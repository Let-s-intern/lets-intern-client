export const PROGRAM_CATEGORY = {
  ALL: 'ALL',
  CHALLENGE: 'CHALLENGE',
  CLASS: 'CLASS',
} as const;

export const PRGRAM_STATUS = {
  PREV: '사전알림 신청',
  PROCEEDING: '모집 중',
  POST: '마감',
} as const;

export const PROGRAM_FILTER_STATUS = {
  PREV: '모집 예정',
  PROCEEDING: '모집 중',
  POST: '모집 종료',
} as const;

export const CHALLENGE_ARTICLE = {
  TITLE: '챌린지',
  DESCRIPTION: '커리어 준비의 첫 시작이 막막하다면?',
};

export const VOD_ARTICLE = {
  TITLE: 'VOD 클래스',
  DESCRIPTION: '커리어 준비의 첫 시작이 막막하다면?',
};

export const LIVE_ARTICLE = {
  TITLE: 'LIVE 클래스',
  DESCRIPTION: '커리어 준비의 첫 시작이 막막하다면?',
};

export const PROGRAM_TYPE = {
  CHALLENGE: 'challenge',
  LIVE: 'live',
  VOD: 'vod',
} as const;

export const PROGRAM_FILTER_TYPE = {
  CAREER_SEARCH: '커리어 탐색',
  DOCUMENT_PREPARATION: '서류 준비',
  MEETING_PREPARATION: '면접 준비',
  PASS: '합격 후 성장',
};

export const PROGRAM_FILTER_TITLE = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  VOD: 'VOD 클래스',
};
