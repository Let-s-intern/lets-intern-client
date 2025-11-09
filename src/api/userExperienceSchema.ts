import { z } from 'zod';

/** GET /api/v1/user-experience/filters - 유저 경험 필터 조회 응답 */
export const userExperienceFiltersSchema = z.object({
  availableCategories: z.array(z.string()),
  availableActivityTypes: z.array(z.string()),
  availableYears: z.array(z.number()),
  availableCoreCompetencies: z.array(z.string()),
});

export type UserExperienceFilters = z.infer<typeof userExperienceFiltersSchema>;

/** POST /api/v1/user-experience/search - 검색 요청 */
export const userExperienceSearchRequestSchema = z.object({
  experienceCategories: z.array(z.string()).optional(),
  activityTypes: z.array(z.string()).optional(),
  years: z.array(z.number()).optional(),
  coreCompetencies: z.array(z.string()).optional(),
  sortType: z.enum(['LATEST', 'OLDEST', 'RECENTLY_EDITED']).optional(),
});

export type UserExperienceSearchRequest = z.infer<
  typeof userExperienceSearchRequestSchema
>;

/** 개별 유저 경험 데이터 */
export const userExperienceSchema = z.object({
  id: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  title: z.string(),
  activityType: z.string(),
  experienceCategory: z.string(),
  role: z.string(),
  organ: z.string(),
  situation: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
  coreCompetency: z.string(),
  customCategoryName: z.string().nullable(),
  reflection: z.string(),
  createDate: z.string(),
  lastModifiedDate: z.string(),
  isAddedByAdmin: z.boolean(),
});

export type UserExperience = z.infer<typeof userExperienceSchema>;

/** POST /api/v1/user-experience/search - 검색 응답 */
export const userExperienceSearchResponseSchema = z.object({
  userExperiences: z.array(userExperienceSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
});

export type UserExperienceSearchResponse = z.infer<
  typeof userExperienceSearchResponseSchema
>;
