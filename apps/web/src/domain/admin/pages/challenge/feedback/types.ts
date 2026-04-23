export interface AttendanceRow {
  id: number | string;
  userId?: number | null;
  challengeMentorId: number | null;
  mentorName: string | null;
  missionTitle: string;
  missionRound: number | string;
  name: string;
  major?: string | null;
  wishJob?: string | null;
  wishCompany?: string | null;
  link?: string | null;
  feedback?: string | null;
  feedbackPageLink: string;
  feedbackStatus: string;
  status: string;
}
