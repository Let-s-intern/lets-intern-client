'use client';

import { createContext, useContext } from 'react';
import type { MentorItem } from './types';

interface MentorMatchContextValue {
  matchedMentors: Record<number, number>;
  mentors: MentorItem[];
  handleSingleMatch: (
    applicationId: number,
    challengeMentorId: number,
  ) => Promise<void>;
  isPending: boolean;
  getMentorColor: (mentorIndex: number) => {
    bg: string;
    text: string;
    border: string;
  };
}

export const MentorMatchContext = createContext<MentorMatchContextValue>({
  matchedMentors: {},
  mentors: [],
  handleSingleMatch: async () => {},
  isPending: false,
  getMentorColor: () => ({ bg: '', text: '', border: '' }),
});

export const useMentorMatchContext = () => useContext(MentorMatchContext);
