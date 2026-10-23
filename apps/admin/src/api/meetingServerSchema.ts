import { z } from 'zod';

/**
 * 회의(Jitsi) 서버 (LC-3439).
 *
 * 라이브 피드백·1대1 회의실 주소는 이 목록의 사용 중 서버와 정확히 같은 base 만 저장된다.
 * 우선순위 숫자가 작을수록 앞이고(0 이 주 서버), 회의실은 뒤 순위(폴백 쪽)로만 옮겨 간다.
 *
 * 서버: `GET/POST/PATCH/DELETE /api/v1/admin/meeting-servers` (`MeetingServerV1AdminController`)
 */
export const meetingServerSchema = z.object({
  meetingServerId: z.number(),
  baseUrl: z.string(),
  priority: z.number(),
  isActive: z.boolean(),
  createDate: z.string().nullable().optional(),
  lastModifiedDate: z.string().nullable().optional(),
});

export type MeetingServer = z.infer<typeof meetingServerSchema>;

/** 목록 응답 `data`. 서버가 우선순위 오름차순으로 내린다. */
export const meetingServerListSchema = z.object({
  meetingServerList: z.array(meetingServerSchema),
});

/** POST 바디. */
export type CreateMeetingServerReq = {
  baseUrl: string;
  priority: number;
  isActive: boolean;
};

/** PATCH 바디. 보낸 값만 바뀐다. */
export type UpdateMeetingServerReq = {
  meetingServerId: number;
} & Partial<CreateMeetingServerReq>;
