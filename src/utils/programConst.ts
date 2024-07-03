export const PROGRAM_STATUS = {
  PREV: '모집 예정',
  PROCEEDING: '모집 중',
  POST: '마감',
} as const;

export const PROGRAM_CLASSIFICATION = {
  CAREER_SEARCH: '탐색',
  DOCUMENT_PREPARATION: '서류',
  MEETING_PREPARATION: '면접',
  PASS: '성장',
} as const;

export const PROGRAM_TYPE = {
  CHALLENGE: 'CHALLENGE',
  LIVE: 'LIVE',
  VOD: 'VOD',
} as const;

export const PROGRAM_FILTER_STATUS = {
  PROCEEDING: '모집 중',
  PREV: '모집 예정',
  POST: '모집 종료',
};

export const PROGRAM_FILTER_CLASSIFICATION = {
  CAREER_SEARCH: '커리어 탐색',
  DOCUMENT_PREPARATION: '서류 준비',
  MEETING_PREPARATION: '면접 준비',
  PASS: '합격 후 성장',
};

export const PROGRAM_FILTER_TYPE = {
  CHALLENGE: '챌린지',
  LIVE: 'LIVE 클래스',
  VOD: 'VOD 클래스',
};

export const PROGRAM_TYPE_KEY = {
  CHALLENGE: 'CHALLENGE',
  LIVE: 'LIVE',
  VOD: 'VOD',
};

export const PROGRAM_CLASSIFICATION_KEY = {
  CAREER_SEARCH: 'CAREER_SEARCH',
  DOCUMENT_PREPARATION: 'DOCUMENT_PREPARATION',
  MEETING_PREPARATION: 'MEETING_PREPARATION',
  PASS: 'PASS',
};

export const PROGRAM_STATUS_KEY = {
  PREV: 'PREV',
  PROCEEDING: 'PROCEEDING',
  POST: 'POST',
};

export const PROGRAM_QUERY_KEY = {
  TYPE: 'type',
  CLASSIFICATION: 'classification',
  STATUS: 'status',
};

export const REMINDER_LINK = 'https://forms.gle/u6ePSE2WoRYjxyGS6';