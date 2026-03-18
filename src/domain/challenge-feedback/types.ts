export type ChallengeKey =
  | 'experience'
  | 'resume'
  | 'personal-statement'
  | 'portfolio'
  | 'large-corp'
  | 'marketing'
  | 'hr';

export interface FeedbackDetail {
  /** 회차 번호 */
  round: string;
  /** 회차 설명 (예: "경험 분석") */
  description: string;
  /** 피드백 방식 */
  method: '서면' | '라이브';
  /** 서면 피드백 예시 이미지 (서면일 때만) */
  exampleImages: string[];
}

export interface FeedbackOption {
  /** STANDARD 또는 PREMIUM */
  tier: 'STANDARD' | 'PREMIUM';
  /** 피드백 횟수 (예: "1회", "3회") */
  feedbackCount: string;
  /** 피드백 상세 일정 */
  feedbackDetails: FeedbackDetail[];
  /** 피드백 개수/범위 설명 */
  feedbackScope: string;
  /** 진행 방식 (예: "서면 피드백", "1:1 Live") */
  method: string;
  /** 멘토 정보 텍스트 */
  mentorInfo: string;
}

export interface Mentor {
  nickname: string;
  company: string;
  role: string;
  profileImage: string;
}

export interface BeforeAfter {
  beforeImage: string;
  beforeDescription: string;
  afterImage: string;
  afterDescription: string;
}

export interface LiveMentoring {
  title: string;
  subCopy1: string;
  videoUrl: string;
  subCopy2: string;
}

export interface UserReview {
  image: string;
  alt: string;
}

export interface SuccessStory {
  company: string;
  companyLogo?: string;
  role: string;
  name: string;
  year: string;
}

export interface FeedbackDetailWithTiers extends FeedbackDetail {
  tiers: ('STANDARD' | 'PREMIUM')[];
}

export interface ChallengeData {
  /** URL 쿼리 파라미터에 사용되는 키 */
  key: ChallengeKey;
  /** 메뉴에 표시되는 이름 */
  menuLabel: string;
  /** 챌린지 전체 이름 */
  fullName: string;
  /** 챌린지 상세페이지 URL */
  detailUrl: string;
  /** 멘토 섹션 타이틀에 표시되는 분야명 */
  mentorSectionField: string;
  /** 멘토 목록 */
  mentors: Mentor[];
  /** 멘토 섹션에 표시할 멘토 수 (기본: mentors.length) */
  mentorDisplayCount?: number;
  /** 피드백 옵션 (STANDARD, PREMIUM) */
  feedbackOptions: FeedbackOption[];
  /** 비포에프터 (없으면 null — 해당 섹션 숨김) */
  beforeAfter: BeforeAfter | null;
  /** 라이브 멘토링 (없으면 null — 해당 섹션 숨김) */
  liveMentoring: LiveMentoring | null;
}
