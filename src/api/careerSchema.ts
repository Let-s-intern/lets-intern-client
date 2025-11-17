import { z } from 'zod';

export type EmployeeType = z.infer<typeof employeeTypeSchema>;
export type UserCareerType = z.infer<typeof userCareerSchema>;

export const employeeTypeSchema = z.enum([
  '정규직',
  '계약직',
  '전환형 인턴',
  '체험형 인턴',
  '프리랜서',
  '파트타임',
  '기타(직접입력)',
]);

export const userCareerSchema = z.object({
  id: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  employeeType: employeeTypeSchema.nullable().optional(),
  employeeTypeOther: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});
