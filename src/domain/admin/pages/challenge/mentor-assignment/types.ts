export type MentorItem = {
  challengeMentorId: number;
  userId: number;
  name: string;
  userCareerList: { company: string | null; job: string | null }[];
};
