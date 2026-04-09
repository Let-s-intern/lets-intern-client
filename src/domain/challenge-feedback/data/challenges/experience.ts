import type { ChallengeData } from '../../types';
import { EXAMPLE_BASE } from '../common';
import { MENTORS } from '../mentors';

export const experience: ChallengeData = {
  key: 'experience',
  menuLabel: '기필코 경험정리 챌린지',
  fullName: '기필코 경험정리 챌린지',
  detailUrl: '/challenge/experience-summary',
  mentorSectionField: '경험정리',
  mentors: [MENTORS.nick],
  mentorDisplayCount: 1,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '1회',
      feedbackDetails: [
        {
          round: '5회차',
          description: '경험 최종 정리',
          method: '서면',
          exampleImages: [
            `${EXAMPLE_BASE}/experience/round-2-1.png`,
            `${EXAMPLE_BASE}/experience/round-2-2.png`,
            `${EXAMPLE_BASE}/experience/round-3-1.png`,
            `${EXAMPLE_BASE}/experience/round-3-2.png`,
            `${EXAMPLE_BASE}/experience/round-4-1.png`,
          ],
        },
      ],
      feedbackScope: '',
      method: '서면 피드백',
      mentorInfo: '렛츠커리어 현직자 멘토단 · 닉 멘토 / 삼성 계열사',
    },
  ],
  beforeAfter: null,
  liveMentoring: null,
};
