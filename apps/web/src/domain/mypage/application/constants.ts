export type ApplicationCategory =
  | 'PROGRAM'
  | 'MENTORING'
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
    1대1 라이브 멘토링은 프로그램 탭에도 함께 보이고, 이 탭에서는 멘토링만 모아 본다(LC-3301).
  */
  { value: 'MENTORING', label: '1:1 LIVE 멘토링' },
  { value: 'LIBRARY', label: '무료 자료집' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'VOD', label: 'VOD 클래스' },
  { value: 'LAUNCH_ALERT', label: '출시알림' },
];

/*
  멘토링 탭은 출시 플래그가 켜졌거나 내 멘토링 신청이 있을 때만 연다.
  출시 전 모든 회원에게 빈 탭을 보이지 않으면서, 이미 신청한 멘티는 탭을 잃지 않는다.
*/
export const filterMentoringCategory = <
  T extends { value: ApplicationCategory },
>(
  options: T[],
  showMentoring: boolean,
): T[] =>
  showMentoring
    ? options
    : options.filter((option) => option.value !== 'MENTORING');
