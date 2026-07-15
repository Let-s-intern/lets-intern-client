/**
 * 멘토별 색상 매핑.
 *
 * 예약 캘린더·멘토 스케줄에서 멘토를 시각적으로 구분하기 위해
 * 멘토명을 안정적으로 고정 팔레트에 매핑한다(같은 멘토명 -> 항상 같은 색).
 */

export interface MentorColor {
  /** 블록 배경 */
  bg: string;
  /** 블록 테두리 */
  border: string;
  /** 블록 텍스트 */
  text: string;
}

/** 멘토 구분용 팔레트(테일윈드 임의값 회피, 고정 클래스). */
export const MENTOR_COLOR_PALETTE: MentorColor[] = [
  { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' },
  { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' },
  { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800' },
  { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
  { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-800' },
  { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-800' },
];

/** 문자열을 팔레트 인덱스로 해싱한다(결정적). */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** 멘토명 기준 색상 반환. 같은 이름은 항상 같은 색을 받는다. */
export function getMentorColor(mentorName: string): MentorColor {
  const index = hashString(mentorName) % MENTOR_COLOR_PALETTE.length;
  return MENTOR_COLOR_PALETTE[index];
}
