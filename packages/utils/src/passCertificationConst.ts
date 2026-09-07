// 합격 인증(pass-certification) 관련 공용 상수
// 스웨거 pass-certification enum 기준. 프로그램 라벨은 백엔드 제공 정식 챌린지명 사용.
// 은행(bankName)은 별도 상수 없이 기존 convertTypeToBank(typeToBank) 재사용.

/** 인증 승인 상태 (statusList) */
export const PASS_CERTIFICATION_STATUS = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
} as const;

export type PassCertificationStatus = keyof typeof PASS_CERTIFICATION_STATUS;

/** 합격 형태 (passType) */
export const PASS_TYPE_LABEL = {
  FULL_TIME: '정규직 신입',
  GENERAL_INTERN: '인턴',
  CONVERSION_INTERN: '전환형 인턴',
  CONTRACT: '계약직',
  ETC: '기타',
} as const;

export type PassType = keyof typeof PASS_TYPE_LABEL;

/** 폼에 노출할 합격 형태 순서 (ETC 선택 시 passTypeEtc 입력) */
export const FORM_PASS_TYPES: PassType[] = [
  'FULL_TIME',
  'GENERAL_INTERN',
  'CONVERSION_INTERN',
  'CONTRACT',
  'ETC',
];

/**
 * 참여 프로그램 (programType).
 * 백엔드 확정: 기존 챌린지 enum만 사용 + 나머지는 ETC(기타 입력)로 흡수.
 * 어드민 표시는 PROGRAM_TYPE_LABEL[type] ?? type 로 fallback (미매핑 enum 방어).
 */
export const PROGRAM_TYPE_LABEL: Record<string, string> = {
  EXPERIENCE_SUMMARY_CHALLENGE: '경험정리 챌린지',
  RESUME_CHALLENGE: '이력서 챌린지',
  PERSONAL_STATEMENT_CHALLENGE: '자기소개서 챌린지',
  PORTFOLIO_CHALLENGE: '포트폴리오 챌린지',
  INTERVIEW_CHALLENGE: '면접 챌린지',
  LARGE_CORP_PERSONAL_STATEMENT_CHALLENGE: '대기업 자기소개서 챌린지',
  MARKETING_DOCUMENT_CHALLENGE: '마케팅 챌린지',
  HR_DOCUMENT_CHALLENGE: 'HR 챌린지',
  PM_DOCUMENT_CHALLENGE: '기획 챌린지',
  ETC: '기타',
};

/** 폼에 노출할 참여 프로그램 순서 (ETC 선택 시 programTypeEtc 입력) */
export const FORM_PROGRAM_TYPES: string[] = [
  'EXPERIENCE_SUMMARY_CHALLENGE',
  'RESUME_CHALLENGE',
  'PERSONAL_STATEMENT_CHALLENGE',
  'PORTFOLIO_CHALLENGE',
  'INTERVIEW_CHALLENGE',
  'LARGE_CORP_PERSONAL_STATEMENT_CHALLENGE',
  'MARKETING_DOCUMENT_CHALLENGE',
  'HR_DOCUMENT_CHALLENGE',
  'PM_DOCUMENT_CHALLENGE',
  'ETC',
];

/** 미매핑 enum도 안 깨지게 라벨 조회 (어드민 표시용) */
export const getProgramTypeLabel = (type: string): string =>
  PROGRAM_TYPE_LABEL[type] ?? type;
