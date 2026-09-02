import { pageInfo } from '@/schema';
import { z } from 'zod';

/** 서버 `BlogPopupTargetType` 과 같은 값이다. */
export const blogPopupTargetTypeSchema = z.enum(['ALL', 'SELECTED']);

export type BlogPopupTargetType = z.infer<typeof blogPopupTargetTypeSchema>;

const adminBlogPopupListItemSchema = z.object({
  blogPopupId: z.number(),
  title: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  targetType: blogPopupTargetTypeSchema,
  targetBlogCount: z.number().optional().nullable(),
  priority: z.number().optional().nullable(),
  isVisible: z.boolean().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  impressionCount: z.number().optional().nullable(),
  clickCount: z.number().optional().nullable(),
  /** 서버가 계산한 백분율. 소수점 첫째 자리까지다. 화면에서 다시 나누지 않는다. */
  clickRate: z.number().optional().nullable(),
});

export type AdminBlogPopupListItem = z.infer<
  typeof adminBlogPopupListItemSchema
>;

/**
 * `priority` 는 서버가 같은 시각에 추가하는 중이라 아직 응답에 없을 수 있다. 없어도
 * 파싱이 깨지지 않도록 optional·nullable 로 둔다. null 은 "없음" 이고 기본값이다.
 * 값이 작을수록 먼저 노출된다.
 */
export const adminBlogPopupListSchema = z.object({
  blogPopupList: z.array(adminBlogPopupListItemSchema),
  pageInfo,
});

const blogPopupSchema = z.object({
  blogPopupId: z.number(),
  title: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  targetType: blogPopupTargetTypeSchema,
  blogIds: z.array(z.number()),
  triggerRatio: z.number().optional().nullable(),
  priority: z.number().optional().nullable(),
  isVisible: z.boolean().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  impressionCount: z.number().optional().nullable(),
  clickCount: z.number().optional().nullable(),
});

export type AdminBlogPopup = z.infer<typeof blogPopupSchema>;

export const adminBlogPopupSchema = z.object({
  blogPopupInfo: blogPopupSchema,
});

export interface PostAdminBlogPopupReqBody {
  title: string;
  imageUrl: string;
  link: string;
  targetType: BlogPopupTargetType;
  blogIds?: number[];
  triggerRatio?: number;
  /** 1 ~ 99. null 이면 "없음" 이다. */
  priority?: number | null;
  isVisible?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * `blogIds` 를 보내면 노출 대상이 전체 교체된다. 생략하면 서버가 그대로 두고,
 * 빈 배열이면 전부 지운다. 건드리지 않은 경우 키 자체를 빼야 한다.
 */
export interface PatchAdminBlogPopupReqBody {
  blogPopupId: number;
  title?: string;
  imageUrl?: string;
  link?: string;
  targetType?: BlogPopupTargetType;
  blogIds?: number[];
  triggerRatio?: number;
  priority?: number | null;
  isVisible?: boolean;
  startDate?: string;
  endDate?: string;
}
