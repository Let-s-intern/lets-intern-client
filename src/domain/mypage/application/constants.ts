export type ApplicationCategory = 'PROGRAM' | 'LIBRARY' | 'GUIDEBOOK';

export const APPLICATION_CATEGORY_OPTIONS: {
  value: ApplicationCategory;
  label: string;
}[] = [
  { value: 'PROGRAM', label: '프로그램' },
  { value: 'LIBRARY', label: '무료 자료집' },
  { value: 'GUIDEBOOK', label: '가이드북' },
];
