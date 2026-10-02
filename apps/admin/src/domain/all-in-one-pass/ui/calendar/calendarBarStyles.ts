import { ChallengeType } from '@/schema';

export type BarKind = 'CHALLENGE' | 'SEMINAR' | 'MILESTONE';

const KIND_CLASS: Record<BarKind, string> = {
  CHALLENGE: 'bg-primary-10 text-neutral-0',
  SEMINAR: 'bg-secondary-10 text-neutral-0',
  MILESTONE: 'bg-primary-20 text-neutral-0',
};

// 챌린지 타입별 막대 색상 (카테고리 구분용 팔레트: 연한 배경 + 진한 글자)
const CHALLENGE_TYPE_CLASS: Record<ChallengeType, string> = {
  CAREER_START: 'bg-[#EAECFF] text-[#4C56C9]',
  DOCUMENT_PREPARATION: 'bg-[#DCF5F0] text-[#0E8A78]',
  MEETING_PREPARATION: 'bg-[#FEF0D9] text-[#B5730E]',
  ETC: 'bg-[#ECEEF1] text-[#5B6472]',
  PERSONAL_STATEMENT: 'bg-[#E0EEFC] text-[#1D6FCC]',
  PORTFOLIO: 'bg-[#F0E6FB] text-[#7A3EC0]',
  PERSONAL_STATEMENT_LARGE_CORP: 'bg-[#FCE4EC] text-[#C2306A]',
  MARKETING: 'bg-[#FDE8DE] text-[#C6551F]',
  EXPERIENCE_SUMMARY: 'bg-[#E4F6E4] text-[#2E8B39]',
  HR: 'bg-[#DEF3F7] text-[#1287A0]',
  PM: 'bg-[#FCE6E6] text-[#C43A3A]',
};

/** 막대 색상 클래스 (챌린지는 타입별, 그 외는 유형별) */
export const barClass = (kind: BarKind, challengeType?: ChallengeType) =>
  kind === 'CHALLENGE' && challengeType
    ? CHALLENGE_TYPE_CLASS[challengeType]
    : KIND_CLASS[kind];
