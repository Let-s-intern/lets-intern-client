export type MentorItem = {
  challengeMentorId: number;
  userId: number;
  name: string;
  userCareerList: { company: string | null; job: string | null }[];
};

export interface MentorAssignmentRow {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  major: string;
  wishJob: string;
  wishCompany: string;
  pricePlanType: string;
  /** 신청 버전명. 버전 없는 신청은 null */
  versionTitle: string | null;
  matchedMentorId: number | null;
  mentorReassignmentRequired: boolean;
}
