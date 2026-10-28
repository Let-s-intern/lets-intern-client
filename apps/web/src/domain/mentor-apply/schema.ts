import { z } from 'zod';

import { toPhoneDigits } from './utils/formatPhone';

/*
  멘토 신청 요청 계약의 원본. 서버 enum 이름이 바뀌면 여기 상수만 고친다.
  POST /api/v1/mentor-application (multipart: `request` JSON + 선택 `file` PDF)
  첨부는 새 파일(`file`) 또는 서류 정리 문서(`userDocumentId`) 중 하나만 보낸다.
*/

export const CONTACT_METHOD_OPTIONS = [
  { value: 'PHONE', label: '전화번호' },
  { value: 'EMAIL', label: '이메일' },
] as const;

export const JOB_FIELD_OPTIONS = [
  { value: 'MANAGEMENT_STRATEGY', label: '경영기획·전략' },
  { value: 'MARKETING_BRANDING', label: '마케팅·브랜딩' },
  { value: 'SALES', label: '영업·영업관리' },
  { value: 'HR', label: '인사·HR' },
  { value: 'FINANCE_ACCOUNTING', label: '재무·회계' },
  { value: 'DEVELOPMENT_IT', label: '개발·IT' },
  { value: 'DATA_AI', label: '데이터·AI' },
  { value: 'SERVICE_PLANNING_PM', label: '서비스기획·PM' },
  { value: 'DESIGN', label: '디자인' },
  { value: 'PRODUCTION_QUALITY', label: '생산·품질' },
  { value: 'RESEARCH_DEVELOPMENT', label: '연구개발(R&D)' },
  { value: 'ETC', label: '기타' },
] as const;

export const MENTORING_TYPE_OPTIONS = [
  { value: 'DOCUMENT_REVIEW', label: '서류 첨삭' },
  { value: 'MOCK_INTERVIEW', label: '모의 면접' },
  { value: 'CAREER_CONSULTING', label: '커리어 상담' },
  { value: 'JOB_QNA', label: '직무 Q&A' },
] as const;

export type ContactMethod = (typeof CONTACT_METHOD_OPTIONS)[number]['value'];
export type JobField = (typeof JOB_FIELD_OPTIONS)[number]['value'];
export type MentoringType = (typeof MENTORING_TYPE_OPTIONS)[number]['value'];

export const MAX_YEARS_OF_EXPERIENCE = 60;
export const MAX_TEXT_LENGTH = 1000;
/** 서버 컬럼 길이. 성함·소속·직무 */
export const MAX_SHORT_TEXT_LENGTH = 255;
export const MAX_SNS_LINK_LENGTH = 2048;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const SNS_LINK_COUNT = 3;

const values = <T extends readonly { value: string }[]>(options: T) =>
  options.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];

const isPdf = (file: File) =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const required = (message: string) => z.string().trim().min(1, message);

const requiredShortText = (message: string) =>
  required(message).max(
    MAX_SHORT_TEXT_LENGTH,
    `${MAX_SHORT_TEXT_LENGTH}자 이내로 입력해 주세요.`,
  );

const optionalText = z
  .string()
  .max(MAX_TEXT_LENGTH, `${MAX_TEXT_LENGTH}자 이내로 입력해 주세요.`);

export const mentorApplyFormSchema = z.object({
  name: requiredShortText('성함을 입력해 주세요.'),
  company: requiredShortText('소속을 입력해 주세요.'),
  jobTitle: requiredShortText('직무를 입력해 주세요.'),
  yearsOfExperience: required('연차를 입력해 주세요.').refine(
    (v) => /^\d+$/.test(v) && Number(v) <= MAX_YEARS_OF_EXPERIENCE,
    `연차는 0~${MAX_YEARS_OF_EXPERIENCE} 사이 숫자로 입력해 주세요.`,
  ),
  phoneNum: required('전화번호를 입력해 주세요.').refine(
    (v) => /^\d{10,11}$/.test(toPhoneDigits(v)),
    '숫자 10~11자리로 입력해 주세요.',
  ),
  email:
    required('이메일을 입력해 주세요.').email('올바른 이메일 형식이 아닙니다.'),
  preferredContactMethods: z
    .array(z.enum(values(CONTACT_METHOD_OPTIONS)))
    .min(1, '선호 연락 수단을 선택해 주세요.'),
  jobFields: z
    .array(z.enum(values(JOB_FIELD_OPTIONS)))
    .min(1, '멘토링 가능 분야를 선택해 주세요.'),
  mentoringTypes: z
    .array(z.enum(values(MENTORING_TYPE_OPTIONS)))
    .min(1, '가능한 멘토링 형태를 선택해 주세요.'),
  introduction: optionalText,
  motivation: optionalText,
  attachment: z
    .custom<File>()
    .nullable()
    .refine((file) => !file || isPdf(file), 'PDF 파일만 첨부해 주세요.')
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      '10MB 이하 파일만 첨부해 주세요.',
    ),
  /**
   * 서류 정리에서 고른 PDF. 고르면 `attachment` 는 비운다.
   * 목록이 내려가면 react-hook-form 이 제출 때 값을 지워 undefined 가 되므로 nullish 로 받는다
   */
  userDocumentId: z.number().nullish(),
  snsLinks: z
    .array(
      z
        .string()
        .trim()
        .max(
          MAX_SNS_LINK_LENGTH,
          `${MAX_SNS_LINK_LENGTH}자 이내로 입력해 주세요.`,
        )
        .refine(
          (v) => v === '' || isHttpUrl(v),
          '올바른 주소를 입력해 주세요.',
        ),
    )
    .max(SNS_LINK_COUNT),
  privacyAgreed: z
    .boolean()
    .refine((v) => v, '개인정보 수집·이용에 동의해 주세요.'),
});

export type MentorApplyFormValues = z.infer<typeof mentorApplyFormSchema>;

export const mentorApplyDefaultValues: MentorApplyFormValues = {
  name: '',
  company: '',
  jobTitle: '',
  yearsOfExperience: '',
  phoneNum: '',
  email: '',
  preferredContactMethods: [],
  jobFields: [],
  mentoringTypes: [],
  introduction: '',
  motivation: '',
  attachment: null,
  userDocumentId: null,
  snsLinks: Array(SNS_LINK_COUNT).fill(''),
  privacyAgreed: false,
};

/** 에러가 났을 때 스크롤할 순서. 화면에 놓인 순서와 같다. */
export const MENTOR_APPLY_FIELD_ORDER: (keyof MentorApplyFormValues)[] = [
  'name',
  'company',
  'jobTitle',
  'yearsOfExperience',
  'phoneNum',
  'email',
  'preferredContactMethods',
  'jobFields',
  'mentoringTypes',
  'introduction',
  'motivation',
  'attachment',
  'snsLinks',
  'privacyAgreed',
];

/** `request` 파트의 JSON */
export interface MentorApplicationRequest {
  name: string;
  company: string;
  jobTitle: string;
  yearsOfExperience: number;
  phoneNum: string;
  email: string;
  preferredContactMethods: ContactMethod[];
  jobFields: JobField[];
  mentoringTypes: MentoringType[];
  introduction?: string;
  motivation?: string;
  snsLinks: string[];
  privacyAgreed: boolean;
  userDocumentId?: number;
}

/** 검증을 통과한 폼 값을 요청 계약으로 바꾼다. 빈 선택 항목은 보내지 않는다. */
export function toMentorApplicationRequest(
  values: MentorApplyFormValues,
): MentorApplicationRequest {
  return {
    name: values.name.trim(),
    company: values.company.trim(),
    jobTitle: values.jobTitle.trim(),
    yearsOfExperience: Number(values.yearsOfExperience),
    phoneNum: toPhoneDigits(values.phoneNum),
    email: values.email.trim(),
    preferredContactMethods: values.preferredContactMethods,
    jobFields: values.jobFields,
    mentoringTypes: values.mentoringTypes,
    introduction: values.introduction.trim() || undefined,
    motivation: values.motivation.trim() || undefined,
    snsLinks: values.snsLinks.map((v) => v.trim()).filter(Boolean),
    privacyAgreed: values.privacyAgreed,
    userDocumentId: values.userDocumentId ?? undefined,
  };
}
