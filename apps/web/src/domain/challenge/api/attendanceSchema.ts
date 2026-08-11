import { FeedbackStatus } from '@/api/challenge/challengeSchema';
import { AttendanceResult, AttendanceStatus } from '@/schema';
import { z } from 'zod';

/** [유저용] 출석 업데이트 PATCH /api/v1/attendance/{id} */
export type PatchAttendanceReq = {
  attendanceId: number | string;
  link?: string;
  review?: string;
  preQuestion?: string;
  accountType?: string;
  accountNum?: string;
  userExperienceIds?: number[];
};

/** [멘토용] 출석 업데이트 /api/v1/attendance/{attendanceId}/mentor */
export type PatchAttendanceMentorReq = {
  attendanceId: number | string;
  feedback?: string | null;
  feedbackStatus?: FeedbackStatus;
};

/** [어드민] 출석 업데이트 /api/v2/admin/attendance/{attendanceId} */
export type PatchAdminAttendanceReq = {
  attendanceId: number | string;
  link?: string;
  status?: AttendanceStatus;
  result?: AttendanceResult;
  comments?: string;
  review?: string;
  reviewIsVisible?: boolean;
  preQuestion?: string;
  mentorUserId?: number | null;
  challengeMentorId?: number | null;
  feedback?: string | null;
  feedbackStatus?: FeedbackStatus;
  accountType?: string;
  accountNum?: string;
};

export const contentSchema = z.object({
  id: z.number(),
  /**
   * 이 자료가 **이 미션에 붙어 있다**는 사실의 식별자 (LC-3201).
   *
   * `id` 는 자료 자체의 번호라 어느 미션에서 열었는지 말해 주지 못한다. 자료는 공용
   * 라이브러리라 같은 자료가 여러 미션에 붙어, 자료 번호만 기록하면 3회차에서 연 것과
   * 7회차에서 연 것이 한 행으로 합쳐진다.
   *
   * 서버 배포 전 응답에는 없으므로 nullish 다. 그때는 호출부가 `id` 로 대신 남긴다.
   */
  missionContentsId: z.number().nullish(),
  title: z.string().nullish(),
  link: z.string().nullish(),
});

export type Content = z.infer<typeof contentSchema>;
