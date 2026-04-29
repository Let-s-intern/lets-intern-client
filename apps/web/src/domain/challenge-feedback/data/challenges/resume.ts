import type { ChallengeData } from '../../types';
import { EXAMPLE_BASE } from '../common';
import { MENTORS } from '../mentors';

export const resume: ChallengeData = {
  key: 'resume',
  menuLabel: '이력서 1주 완성 챌린지',
  fullName: '이력서 1주 완성 챌린지',
  detailUrl: '/challenge/resume',
  mentorSectionField: '이력서',
  mentors: [MENTORS.letscareerTeam],
  mentorDisplayCount: 1,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '1회',
      feedbackDetails: [
        {
          round: '4회차',
          description: '이력서 완성',
          method: '서면',
          exampleImages: [
            `${EXAMPLE_BASE}/resume/round-4-1.png`,
            `${EXAMPLE_BASE}/resume/round-4-2.png`,
          ],
        },
      ],
      feedbackScope: '이력서 1개',
      method: '서면 피드백',
      mentorInfo: '렛츠커리어 취업연구팀 · 렛츠커리어 취업 연구팀',
    },
  ],
  beforeAfter: null,
  liveMentoring: null,
};
