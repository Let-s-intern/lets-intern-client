import { z } from 'zod';

/*
 * 어드민 멘토 합류 신청 API 의 응답 해석은 이 파일 한 곳에서만 한다.
 * 서버(push 3)와 병렬로 만들어서, 응답 모양이 확정되면 여기만 맞춘다.
 */

export const mentorApplicationStatusSchema = z.enum([
  'CHECKING',
  'REVIEWING',
  'REPLIED',
]);
export type MentorApplicationStatus = z.infer<
  typeof mentorApplicationStatusSchema
>;

export const MENTOR_APPLICATION_STATUS_LABEL: Record<
  MentorApplicationStatus,
  string
> = {
  CHECKING: '확인 중',
  REVIEWING: '검토 중',
  REPLIED: '회신 완료',
};

export const MENTOR_APPLICATION_STATUSES =
  mentorApplicationStatusSchema.options;

const contactMethodSchema = z.enum(['PHONE', 'EMAIL']);
export type MentorApplicationContactMethod = z.infer<
  typeof contactMethodSchema
>;

export const CONTACT_METHOD_LABEL: Record<
  MentorApplicationContactMethod,
  string
> = {
  PHONE: '전화번호',
  EMAIL: '이메일',
};

export const JOB_FIELD_LABEL = {
  MANAGEMENT_STRATEGY: '경영기획·전략',
  MARKETING_BRANDING: '마케팅·브랜딩',
  SALES: '영업·영업관리',
  HR: '인사·HR',
  FINANCE_ACCOUNTING: '재무·회계',
  DEVELOPMENT_IT: '개발·IT',
  DATA_AI: '데이터·AI',
  SERVICE_PLANNING_PM: '서비스기획·PM',
  DESIGN: '디자인',
  PRODUCTION_QUALITY: '생산·품질',
  RESEARCH_DEVELOPMENT: '연구개발(R&D)',
  ETC: '기타',
} as const;

export const MENTORING_TYPE_LABEL = {
  DOCUMENT_REVIEW: '서류 첨삭',
  MOCK_INTERVIEW: '모의 면접',
  CAREER_CONSULTING: '커리어 상담',
  JOB_QNA: '직무 Q&A',
} as const;

type JobField = keyof typeof JOB_FIELD_LABEL;
type MentoringType = keyof typeof MENTORING_TYPE_LABEL;

const jobFieldSchema = z.enum(
  Object.keys(JOB_FIELD_LABEL) as [JobField, ...JobField[]],
);
const mentoringTypeSchema = z.enum(
  Object.keys(MENTORING_TYPE_LABEL) as [MentoringType, ...MentoringType[]],
);

export const MENTOR_APPLICATION_MEMO_MAX_LENGTH = 5000;

/* 목록·상세 응답에 공통으로 있는 항목. 서버 DTO 가 다르므로 각자 이 위에 자기 항목만 더한다 */
const baseFields = {
  id: z.number(),
  submittedAt: z.string(),
  name: z.string(),
  company: z.string(),
  jobTitle: z.string(),
  phoneNum: z.string(),
  email: z.string(),
  preferredContactMethods: z.array(contactMethodSchema),
  status: mentorApplicationStatusSchema,
};

/* 서버 GetAdminMentorApplicationsResponseDto.AdminMentorApplicationResponse */
const listItemSchema = z.object({
  ...baseFields,
  hasAttachment: z.boolean(),
});
export type AdminMentorApplicationListItem = z.infer<typeof listItemSchema>;

/*
 * 목록의 감싸는 키와 페이징은 아직 정해지지 않았다.
 * 배열 그대로, 또는 객체 안의 첫 배열 값(applicationList, content 등)을 목록으로 본다.
 */
export const adminMentorApplicationListSchema = z.preprocess((data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    return Object.values(data).find(Array.isArray) ?? data;
  }
  return data;
}, z.array(listItemSchema));

/* 서버 GetAdminMentorApplicationResponseDto. 목록 전용 hasAttachment 는 없다 */
export const adminMentorApplicationDetailSchema = z.object({
  ...baseFields,
  yearsOfExperience: z.number(),
  jobFields: z.array(jobFieldSchema),
  mentoringTypes: z.array(mentoringTypeSchema),
  introduction: z.string().nullish(),
  motivation: z.string().nullish(),
  snsLinks: z
    .array(z.string())
    .nullish()
    .transform((links) => links ?? []),
  attachmentUrl: z.string().nullish(),
  attachmentName: z.string().nullish(),
  privacyAgreedAt: z.string().nullish(),
  userId: z.number().nullish(),
  expectedReplyDate: z.string().nullish(),
  adminMemo: z.string().nullish(),
});
export type AdminMentorApplicationDetail = z.infer<
  typeof adminMentorApplicationDetailSchema
>;
