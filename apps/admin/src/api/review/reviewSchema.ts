import { z } from 'zod';

export interface PostBlogBonusRequest {
  missionId: number;
  url: string;
  accountType: string;
  accountNum: string;
}

export const blogBonusSchema = z.object({
  blogReviewId: z.number(),
  attendanceId: z.number(),
  message: z.string().nullish(),
});
