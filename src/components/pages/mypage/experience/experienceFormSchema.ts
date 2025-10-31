// TODO: 파일 위치 이동
import { z } from 'zod';

// 기본 정보 섹션
export const basicInfoSchema = z.object({
  experienceName: z.string().optional(),
  experienceCategory: z.string().optional(),
  customCategory: z.string().optional(),
  organization: z.string().optional(),
  roleAndResponsibilities: z.string().optional(),
  type: z.enum(['TEAM', 'INDIVIDUAL']).optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
  year: z.number().optional(),
});

// STAR 섹션
export const starSchema = z.object({
  situation: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
  learnings: z.string().optional(),
});

// 핵심 역량 섹션
export const competenciesSchema = z.object({
  coreCompetency: z.string().optional(),
});

// 최종 스키마 (Compose)
export const experienceFormSchema = basicInfoSchema
  .merge(starSchema)
  .merge(competenciesSchema);

export type ExperienceFormData = z.infer<typeof experienceFormSchema>;

// 섹션별 기본값
export const defaultBasicInfo: z.infer<typeof basicInfoSchema> = {
  experienceName: '',
  experienceCategory: '',
  customCategory: '',
  organization: '',
  roleAndResponsibilities: '',
  type: 'INDIVIDUAL',
  startDate: undefined,
  endDate: undefined,
  year: undefined,
};

export const defaultStar: z.infer<typeof starSchema> = {
  situation: '',
  task: '',
  action: '',
  result: '',
  learnings: '',
};

// 최종 기본값 (합성)
export const defaultFormData: ExperienceFormData = {
  ...defaultBasicInfo,
  ...defaultStar,
  coreCompetency: '',
};
