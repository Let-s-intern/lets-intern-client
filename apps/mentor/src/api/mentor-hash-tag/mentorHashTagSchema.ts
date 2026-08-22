import { z } from 'zod';

export const mentorHashTagItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
});

export type MentorHashTagItem = z.infer<typeof mentorHashTagItemSchema>;

/** GET /mentor-hash-tag, GET /mentor-hash-tag/my 공통 응답 */
export const mentorHashTagListSchema = z.object({
  mentorHashTagList: z.array(mentorHashTagItemSchema),
});

/** PUT /mentor-hash-tag/my 요청 바디 — 전달한 목록이 최종 목록이 된다 */
export interface PutMyMentorHashTagReq {
  mentorHashTagIdList: number[];
}
