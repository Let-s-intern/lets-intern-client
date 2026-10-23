export { getMentorColor } from '../mentor-colors';
import type { MentorAssignmentRow, MentorItem } from './types';

export const getMentorLabel = (m: MentorItem) => {
  const c = m.userCareerList?.[0];
  if (!c?.company || !c?.job) return m.name;
  return `${m.name} (${c.company}/${c.job})`;
};

/** 멘토 재배정이 필요한 행을 위로 올린다. 나머지 순서는 그대로 둔다 (설계안 D7) */
export const sortReassignmentRequiredFirst = (rows: MentorAssignmentRow[]) => [
  ...rows.filter((row) => row.mentorReassignmentRequired),
  ...rows.filter((row) => !row.mentorReassignmentRequired),
];
