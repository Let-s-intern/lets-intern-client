import type {
  ChallengeScopeType,
  MentorScopeType,
  DateType,
} from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';

export type ContentType = 'URL' | 'EDITOR' | 'MARKDOWN';

export interface NoticeForm {
  title: string;
  link: string;
  contents: string;
  contentType: ContentType;
  challengeScopeType: ChallengeScopeType;
  mentorScopeType: MentorScopeType;
  challengeId: string;
  challengeMentorId: string;
  dateType: DateType;
  startDate: string;
  endDate: string;
  isFixed: boolean;
}

export type ModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; guideId: number };

export const INITIAL_FORM: NoticeForm = {
  title: '',
  link: '',
  contents: '',
  contentType: 'URL',
  challengeScopeType: 'ALL',
  mentorScopeType: 'ALL_MENTOR',
  challengeId: '',
  challengeMentorId: '',
  dateType: 'INFINITE',
  startDate: '',
  endDate: '',
  isFixed: false,
};

export const DATA_GRID_LOCALE_TEXT = {
  noRowsLabel: '등록된 공지가 없습니다.',
} as const;

export const SCOPE_LABELS: Record<string, string> = {
  ALL: '전체 챌린지',
  SPECIFIC: '특정 챌린지',
};

export const MENTOR_SCOPE_LABELS: Record<string, string> = {
  ALL_MENTOR: '모든 멘토',
  SPECIFIC_MENTOR: '특정 멘토',
};

export const EMPTY_MAP = new Map<number, string>();

/** TEXT 컬럼 기준 DB 용량 한도 (bytes) */
export const DB_LIMIT = 65535;
