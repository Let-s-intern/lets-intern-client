export type ApplicationCategory = 'PROGRAM' | 'LIBRARY' | 'GUIDEBOOK' | 'VOD';
export type ApplicationProgress = 'ALL' | 'PROCEEDING' | 'PREV' | 'POST';

export const APPLICATION_CATEGORY_OPTIONS: {
  value: ApplicationCategory;
  label: string;
}[] = [
  { value: 'PROGRAM', label: '프로그램' },
  { value: 'LIBRARY', label: '무료 자료집' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'VOD', label: 'VOD 클래스' },
];
