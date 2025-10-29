// TODO: 파일 위치 이동
import { z } from 'zod';

export const experienceFormSchema = z.object({
  // 기본 정보 (모든 필드 선택)
  experienceName: z.string().optional(),
  experienceCategory: z.string().optional(),
  customCategory: z.string().optional(),
  organization: z.string().optional(),
  roleAndResponsibilities: z.string().optional(),
  type: z.enum(['TEAM', 'INDIVIDUAL']).optional(),
  startYear: z.number().optional(),
  startMonth: z.number().optional(),
  endYear: z.number().optional(),
  endMonth: z.number().optional(),
  year: z.number().optional(),
});

export type ExperienceFormData = z.infer<typeof experienceFormSchema>;

// 기본값
export const defaultFormData: ExperienceFormData = {
  experienceName: '',
  experienceCategory: '',
  customCategory: '',
  organization: '',
  roleAndResponsibilities: '',
  type: 'INDIVIDUAL',
  startYear: undefined,
  startMonth: undefined,
  endYear: undefined,
  endMonth: undefined,
  year: undefined,
};
