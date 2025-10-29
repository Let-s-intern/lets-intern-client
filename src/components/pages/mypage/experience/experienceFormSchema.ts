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
  // 경험 상세 작성 (STAR)
  situation: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
  learnings: z.string().optional(),
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
  situation: '',
  task: '',
  action: '',
  result: '',
  learnings: '',
};
