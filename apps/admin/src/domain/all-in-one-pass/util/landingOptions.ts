/** 랜딩페이지 구성 선택지 상수 (아이콘·후기 드롭다운). */

/**
 * 추가혜택 아이콘 후보. 실제 아이콘 이미지는 추후 제공되며, 그때 iconKey→이미지 매핑만
 * 교체한다. 지금은 라벨만 플레이스홀더.
 */
export const BENEFIT_ICON_OPTIONS = [
  { key: 'icon1', label: '아이콘 1' },
  { key: 'icon2', label: '아이콘 2' },
  { key: 'icon3', label: '아이콘 3' },
] as const;

export const DEFAULT_BENEFIT_ICON_KEY = BENEFIT_ICON_OPTIONS[0].key;

/** 후기 출처 */
export const REVIEW_SOURCE_OPTIONS = [
  '인스타그램 DM',
  '카카오톡 오픈채팅',
  '챌린지 커뮤니티',
  '기타',
] as const;

/** 후기 결과태그 */
export const REVIEW_RESULT_TAG_OPTIONS = [
  '서류 합격',
  '최종 합격',
  '인턴 합격',
  '면접 준비',
  '취준 루틴',
  '동기부여',
  '콘텐츠 만족',
] as const;
