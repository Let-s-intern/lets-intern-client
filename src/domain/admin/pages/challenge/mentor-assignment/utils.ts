import { MENTOR_COLORS } from './constants';
import type { MentorItem } from './types';

export const getMentorLabel = (m: MentorItem) => {
  const c = m.userCareerList?.[0];
  if (!c?.company || !c?.job) return m.name;
  return `${m.name} (${c.company}/${c.job})`;
};

export const getMentorColor = (i: number) =>
  MENTOR_COLORS[i % MENTOR_COLORS.length];
