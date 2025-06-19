import { AttendanceResult, AttendanceStatus } from '@/schema';
import { FeedbackStatus } from './challengeSchema';

/** PATCH /api/v1/attendance/{id} */
export type PatchAttendanceReq = {
  attendanceId: number | string;
  link?: string;
  status?: AttendanceStatus;
  result?: AttendanceResult;
  comments?: string;
  review?: string;
  reviewIsVisible?: boolean;
  mentorUserId?: number;
  feedback?: string;
  feedbackStatus?: FeedbackStatus;
};
