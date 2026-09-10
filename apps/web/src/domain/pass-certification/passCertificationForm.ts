/** 합격 인증 폼 상태 (react-hook-form) */
export interface PassCertificationFormValues {
  // 1. 기본 정보
  name: string;
  phoneNum: string;
  email: string;
  accountNumber: string;
  bankName: string; // 은행 코드 (KB, TOSS ... — typeToBank 키)
  // 2. 합격 정보
  companyName: string;
  jobName: string;
  passType: string; // PassType enum
  passTypeEtc: string; // passType === 'ETC' 일 때만
  certificationImage: File | null; // 제출 시 presigned 업로드 → certificationImageUrl
  // 3. 합격 후기
  programTypeList: string[];
  programTypeEtc: string; // 'ETC' 포함 시만
  programFeedback: string;
  privacyAgree: boolean;
  virtuousCycleAgree: boolean;
}

export const passCertificationDefaultValues: PassCertificationFormValues = {
  name: '',
  phoneNum: '',
  email: '',
  accountNumber: '',
  bankName: '',
  companyName: '',
  jobName: '',
  passType: '',
  passTypeEtc: '',
  certificationImage: null,
  programTypeList: [],
  programTypeEtc: '',
  programFeedback: '',
  privacyAgree: false,
  virtuousCycleAgree: false,
};

/** 스텝별 검증 대상 필드 (다음으로 이동 시 trigger) */
export const STEP_FIELDS: (keyof PassCertificationFormValues)[][] = [
  ['name', 'phoneNum', 'email', 'accountNumber', 'bankName'],
  ['companyName', 'jobName', 'passType', 'passTypeEtc', 'certificationImage'],
  ['programTypeList', 'programTypeEtc', 'privacyAgree'],
];

/** 데스크톱 가로 스텝퍼 라벨 (3단계) */
export const STEP_LABELS = ['기본 정보', '합격 정보', '합격 후기'] as const;

/** 모바일 뱃지 스텝퍼 라벨 (데스크톱 3단계 + 제출 완료) */
export const MOBILE_STEP_LABELS = [...STEP_LABELS, '제출 완료'] as const;
