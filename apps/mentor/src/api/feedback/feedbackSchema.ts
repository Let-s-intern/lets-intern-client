import { z } from 'zod';

/**
 * BE FeedbackSlotStatus enum 1:1 매핑.
 * - OPEN: 멘토가 열어둔 슬롯, 멘티 예약 가능
 * - RESERVED: 멘티가 예약 완료한 슬롯, 멘토는 변경 불가
 */
export const feedbackSlotStatusSchema = z.enum(['OPEN', 'RESERVED']);
export type FeedbackSlotStatus = z.infer<typeof feedbackSlotStatusSchema>;

/**
 * BE FeedbackSlotVo (record) 1:1 매핑.
 * BE는 `LocalDateTime`을 ISO 문자열 형태로 직렬화한다.
 */
export const feedbackSlotSchema = z.object({
  feedbackSlotId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: feedbackSlotStatusSchema,
});
export type FeedbackSlot = z.infer<typeof feedbackSlotSchema>;

/**
 * BE GetMentorFeedbackSlotsResponseDto 응답 매핑.
 * 응답 키는 BE record 기반 camelCase이므로 axios 인터셉터의 snake→camel 변환이 필요 없다.
 */
export const getMentorFeedbackSlotsResponseSchema = z.object({
  feedbackSlotList: z.array(feedbackSlotSchema),
});
export type GetMentorFeedbackSlotsResponse = z.infer<
  typeof getMentorFeedbackSlotsResponseSchema
>;

/**
 * BE CreateFeedbackSlotRequestDto (record) 1:1 매핑.
 * POST 본문은 `Array<{startDate, endDate}>`로 다건 일괄 생성한다.
 */
export const createFeedbackSlotRequestSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
export type CreateFeedbackSlotRequest = z.infer<
  typeof createFeedbackSlotRequestSchema
>;
