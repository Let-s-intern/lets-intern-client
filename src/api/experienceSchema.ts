import { z } from 'zod';

export type UserExperienceType = z.infer<typeof userExperienceSchema>;
export type UserExperienceListType = z.infer<typeof userExperienceListSchema>;
export type ActivityType = z.infer<typeof activitySchema>;
export type CategoryType = z.infer<typeof categorySchema>;
export type UserAttendanceExperience = z.infer<
  typeof userAttendanceExperienceSchema
>['userExperiences'];

const activitySchema = z.enum(['TEAM', 'INDIVIDUAL']);
const categorySchema = z.enum([
  'PROJECT',
  'ACADEMIC',
  'CLUB',
  'EDUCATION',
  'COMPETITION',
  'EXTRACURRICULAR',
  'INTERNSHIP',
  'COMPANY',
  'UNIVERSITY',
  'OTHER',
]);

export const ACTIVITY_TYPE_KR: Record<ActivityType, string> = {
  TEAM: '팀',
  INDIVIDUAL: '개인',
};

export const EXPERIENCE_CATEGORY_KR: Record<CategoryType, string> = {
  PROJECT: '프로젝트',
  ACADEMIC: '학회',
  CLUB: '동아리',
  EDUCATION: '교육',
  COMPETITION: '공모전',
  EXTRACURRICULAR: '대외활동',
  INTERNSHIP: '인턴',
  COMPANY: '회사',
  UNIVERSITY: '대학교',
  OTHER: '기타',
};

export const userExperienceSchema = z.object({
  id: z.number(),
  startDate: z.string().nullable().optional(), // ISO 날짜 문자열 (예: "2025-10-29")
  endDate: z.string().nullable().optional(), // ISO 날짜 문자열 (예: "2025-10-29")
  title: z.string().nullable().optional(),
  activityType: activitySchema.nullable().optional(),
  experienceCategory: categorySchema.nullable().optional(),
  organ: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  situation: z.string().nullable().optional(),
  task: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
  result: z.string().nullable().optional(),
  reflection: z.string().nullable().optional(),
  coreCompetency: z.string().nullable().optional(),
  customCategoryName: z.string().nullable().optional(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
  isAddedByAdmin: z.boolean().nullable().optional(),
  isAdminAdded: z.boolean().nullable().optional(),
});

export const userAttendanceExperienceSchema = z.object({
  userExperiences: z.array(
    z.object({
      id: z.number(),
      startDate: z.string().nullable().optional(), // ISO 날짜 문자열 (예: "2025-10-29")
      endDate: z.string().nullable().optional(), // ISO 날짜 문자열 (예: "2025-10-29")
      title: z.string().nullable().optional(),
      activityType: activitySchema.nullable().optional(),
      experienceCategory: categorySchema.nullable().optional(),
      role: z.string().nullable().optional(),
      situation: z.string().nullable().optional(),
      task: z.string().nullable().optional(),
      action: z.string().nullable().optional(),
      result: z.string().nullable().optional(),
      coreCompetency: z.string().nullable().optional(),
      customCategoryName: z.string().nullable().optional(),
      reflection: z.string().nullable().optional(),
      organ: z.string().nullable().optional(),
      isAdminAdded: z.boolean().nullable().optional(),
    }),
  ),
});

export const userExperienceListSchema = z.object({
  userExperiences: z.array(userExperienceSchema),
  totalElements: z.number().min(0),
  totalPages: z.number().min(0),
  currentPage: z.number().min(0),
});

export interface ExperienceFiltersReq {
  experienceCategories: z.infer<typeof categorySchema>[];
  activityTypes: z.infer<typeof activitySchema>[];
  years: number[];
  coreCompetencies: string[];
}

export interface ExperienceFiltersRes {
  availableCategories: z.infer<typeof categorySchema>[];
  availableActivityTypes: z.infer<typeof activitySchema>[];
  availableYears: number[];
  availableCoreCompetencies: string[];
}

export interface Pageable {
  page: number;
  size: number;
}

export type Sortable = 'LATEST' | 'OLDEST' | 'RECENTLY_EDITED';