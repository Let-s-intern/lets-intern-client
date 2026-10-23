/**
 * 챌린지 운영 화면 상단 탭. 화면(ChallengeOperationAdminLayout)과 사이드바 메뉴 검색이 함께 읽는다.
 * 라벨·순서를 바꾸면 검색 결과도 같이 바뀐다.
 */
export const CHALLENGE_OPERATION_TABS = [
  { id: 'home', text: '홈' },
  { id: 'register-mission', text: '미션등록' },
  { id: 'attendances', text: '제출확인' },
  { id: 'participants', text: '참여자' },
  { id: 'payback', text: '페이백' },
  { id: 'feedback', text: '피드백' },
] as const;

export const challengeOperationTabPath = (
  programId: string | number | undefined,
  tabId: string,
) => `/challenge/operation/${programId}/${tabId}`;
