import { z } from 'zod';

export type EmployeeType = z.infer<typeof employeeTypeSchema>;
export type UserCareerType = z.infer<typeof userCareerSchema>;
export type CareerFormType = z.infer<typeof careerFormSchema>;
export type DateObjectType = z.infer<typeof dateObjectSchema>;

export const employeeTypeSchema = z.enum([
  '정규직',
  '계약직',
  '전환형 인턴',
  '체험형 인턴',
  '프리랜서',
  '파트타임',
  '기타(직접입력)',
]);

export const dateObjectSchema = z.object({
  year: z.number(),
  month: z.string(),
  monthValue: z.number(),
  leapYear: z.boolean(), // 윤년 여부
});

/* -------------------------
 * 유저 커리어 스키마 (API 응답/요청용)
 * 서버와 통신 시 사용되는 기본 스키마
 * ------------------------- */
export const userCareerSchema = z.object({
  id: z.number().nullable().optional(),
  company: z.string(),
  job: z.string(),
  employmentType: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
});

/* -------------------------
 * 커리어 폼 스키마 (UI 유효성 검사용)
 * 사용자 입력값 검증 및 에러 메시지 포함
 * ------------------------- */
export const careerFormSchema = userCareerSchema
  .extend({
    company: z.string().min(1, '기업 이름을 입력해주세요.'),
    job: z.string().min(1, '직무를 입력해주세요.'),
    employmentType: z
      .string()
      .nullable()
      .optional()
      .refine((val) => val !== null && val !== '', {
        message: '고용 형태를 선택해주세요.',
      }),
    employmentTypeOther: z.string().nullable().optional(),
    startDate: z.string().min(1, '시작연도,월을 선택해주세요.'),
  })
  .refine(
    (data) => {
      // employmentType이 '기타(직접입력)'일 때만 employmentTypeOther 검증
      if (data.employmentType === '기타(직접입력)') {
        return (
          data.employmentTypeOther != null && data.employmentTypeOther !== ''
        );
      }
      return true;
    },
    {
      message: '고용 형태를 입력해주세요.',
      path: ['employmentTypeOther'],
    },
  );

export const userCareerListSchema = z.object({
  userCareers: z.array(userCareerSchema),
  pageInfo: z.object({
    pageNum: z.number().min(0),
    pageSize: z.number().min(0),
    totalElements: z.number().min(0),
    totalPages: z.number().min(0),
  }),
});

export interface Pageable {
  page: number;
  size: number;
}
