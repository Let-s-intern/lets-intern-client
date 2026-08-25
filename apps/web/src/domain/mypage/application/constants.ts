export type ApplicationCategory =
  | 'PROGRAM'
  | 'LIBRARY'
  | 'GUIDEBOOK'
  | 'VOD'
  | 'LAUNCH_ALERT';
export type ApplicationProgress = 'ALL' | 'PROCEEDING' | 'PREV' | 'POST';

export const APPLICATION_CATEGORY_OPTIONS: {
  value: ApplicationCategory;
  label: string;
}[] = [
  { value: 'PROGRAM', label: '프로그램' },
  /*
    멘토링 탭은 없앴다. 1대1 라이브 멘토링을 프로그램 탭에서 함께 보여주므로
    같은 신청이 두 탭에 뜬다.
  */
  { value: 'LIBRARY', label: '무료 자료집' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'VOD', label: 'VOD 클래스' },
  { value: 'LAUNCH_ALERT', label: '출시알림' },
];
