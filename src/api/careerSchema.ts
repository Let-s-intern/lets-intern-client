import { z } from 'zod';

export type EmployeeType = z.infer<typeof employeeTypeSchema>;
export type UserCareerType = z.infer<typeof userCareerSchema>;
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
  leapYear: z.boolean(),
});

export const userCareerSchema = z.object({
  id: z.number().nullable().optional(),
  company: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
  employmentType: z.string().nullable().optional(),
  employmentTypeOther: z.string().nullable().optional(),
  startDate: dateObjectSchema.nullable().optional(),
  endDate: dateObjectSchema.nullable().optional(),
});

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
