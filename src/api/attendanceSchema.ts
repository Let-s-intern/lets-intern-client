import { AttendanceResult, AttendanceStatus } from '@/schema';
import { FeedbackStatus } from './challengeSchema';

/** [유저용] 출석 업데이트 PATCH /api/v1/attendance/{id} */
export type PatchAttendanceReq = {
  attendanceId: number | string;
  link?: string;
  review?: string;
  accountType?: string;
  accountNum?: string;
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
  mentorUserId?: number;
  feedback?: string | null;
  feedbackStatus?: FeedbackStatus;
  accountType?: string;
  accountNum?: string;
};
