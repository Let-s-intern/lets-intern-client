export { getMentorColor } from '../mentor-colors';
import type { MentorItem } from './types';

export const getMentorLabel = (m: MentorItem) => {
  const c = m.userCareerList?.[0];
  if (!c?.company || !c?.job) return m.name;
  return `${m.name} (${c.company}/${c.job})`;
};
