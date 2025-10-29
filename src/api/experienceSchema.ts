import { z } from "zod";

export type UserExperienceType = z.infer<typeof userExperienceSchema>;
export type UserExperienceListType = z.infer<typeof userExperienceListSchema>;

const activityTypeSchema = z.enum(["TEAM", "INDIVIDUAL"]);

const experienceCategorySchema = z.enum([
  "PROJECT",
  "ACADEMIC",
  "CLUB",
  "EDUCATION",
  "COMPETITION",
  "EXTRACURRICULAR",
  "INTERNSHIP",
  "COMPANY",
  "UNIVERSITY",
  "OTHER",
]);

export const userExperienceSchema = z.object({
  id: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(), // ISO 날짜 문자열 (예: "2025-10-29")
  endDate: z.string().nullable().optional(), // ISO 날짜 문자열 (예: "2025-10-29")
  title: z.string().nullable().optional(),
  activityType: activityTypeSchema.nullable().optional(),
  experienceCategory: experienceCategorySchema.nullable().optional(),
  role: z.string().nullable().optional(),
  situation: z.string().nullable().optional(),
  task: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
  result: z.string().nullable().optional(),
  coreCompetency: z.string().nullable().optional(),
  customCategoryName: z.string().nullable().optional(),
  isAddedByAdmin: z.boolean().nullable().optional(),
  isAdminAdded: z.boolean().nullable().optional(),
});

// 경험 정리 목록 조회 응답 스키마
export const userExperienceListSchema = z.object({
  userExperiences: z.array(userExperienceSchema),
  totalElements: z.number().min(0),
  totalPages: z.number().min(0),
  currentPage: z.number().min(0)
});