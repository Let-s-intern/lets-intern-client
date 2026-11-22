import type { CSSProperties } from 'react';

interface ApplyAccent {
  /** 선택한 항목의 테두리 */
  accent: string;
  /** 신청 영역 배경. 썸네일 색을 아주 옅게 푼 색 */
  tint: string;
}

const DEFAULT_ACCENT: ApplyAccent = { accent: '#4D55F5', tint: '#F5F6FF' };

/** 챌린지 유형별 기본 썸네일 색에 맞춘 신청 영역 색 */
const ACCENT_BY_TYPE: Record<string, ApplyAccent> = {
  PERSONAL_STATEMENT: { accent: '#14BCFF', tint: '#F0FAFF' },
  PERSONAL_STATEMENT_LARGE_CORP: { accent: '#4A76FF', tint: '#F2F5FF' },
  PORTFOLIO: { accent: '#F8AE00', tint: '#FFF9EC' },
  CAREER_START: { accent: '#4D55F5', tint: '#F5F6FF' },
  EXPERIENCE_SUMMARY: { accent: '#F26646', tint: '#FFF6F3' },
  APTITUDE: { accent: '#FF8E36', tint: '#FFF7F0' },
  SNS_CONTENT: { accent: '#4D55F5', tint: '#F5F6FF' },
  MEETING_PREPARATION: { accent: '#32B750', tint: '#F2FBF4' },
  HR: { accent: '#FF5E00', tint: '#FFF6EF' },
  PM: { accent: '#1BC47D', tint: '#EDFAF4' },
  MARKETING: { accent: '#2B3A67', tint: '#F2F4F9' },
};

/**
 * 신청 영역의 CSS 변수. 하위 카드가 `var(--apply-accent)` / `var(--apply-tint)` 로 읽는다.
 * 변수가 없는 곳(다른 화면)에서는 기본 보라로 보인다.
 */
export const getApplyAccentStyle = (
  challengeType?: string | null,
): CSSProperties => {
  const { accent, tint } =
    (challengeType && ACCENT_BY_TYPE[challengeType]) || DEFAULT_ACCENT;
  return {
    '--apply-accent': accent,
    '--apply-tint': tint,
  } as CSSProperties;
};
