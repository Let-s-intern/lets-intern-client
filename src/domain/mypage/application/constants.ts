export type ApplicationCategory = 'PROGRAM' | 'LIBRARY' | 'GUIDEBOOK';
export type ApplicationProgress = 'ALL' | 'PROCEEDING' | 'PREV' | 'POST';

export const APPLICATION_CATEGORY_OPTIONS: {
  value: ApplicationCategory;
  label: string;
}[] = [
  { value: 'PROGRAM', label: '프로그램' },
  { value: 'LIBRARY', label: '무료 자료집' },
  { value: 'GUIDEBOOK', label: '가이드북' },
];

export const APPLICATION_PROGRESS_OPTIONS: {
  value: ApplicationProgress;
  label: string;
}[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PROCEEDING', label: '참여 중' },
  { value: 'PREV', label: '참여 예정' },
  { value: 'POST', label: '참여 완료' },
];
