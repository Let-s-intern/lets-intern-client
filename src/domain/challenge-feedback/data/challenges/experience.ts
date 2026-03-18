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
      feedbackCount: '3회',
      feedbackDetails: [
        {
          round: '2회차',
          description: '대학 교내 활동(일상) 경험 정리',
          method: '서면',
          exampleImages: [
            `${EXAMPLE_BASE}/experience/round-2-1.png`,
            `${EXAMPLE_BASE}/experience/round-2-2.png`,
          ],
        },
        {
          round: '3회차',
          description: '교외 활동 경험 정리',
          method: '서면',
          exampleImages: [
            `${EXAMPLE_BASE}/experience/round-3-1.png`,
            `${EXAMPLE_BASE}/experience/round-3-2.png`,
          ],
        },
        {
          round: '4회차',
          description: '일상 및 커리어 경험 정리',
          method: '서면',
          exampleImages: [`${EXAMPLE_BASE}/experience/round-4-1.png`],
        },
      ],
      feedbackScope: '각 회차별 경험 3개씩',
      method: '서면 피드백',
      mentorInfo: '렛츠커리어 현직자 멘토단 · 닉 멘토 / 삼성 계열사',
    },
  ],
  beforeAfter: null,
  liveMentoring: null,
};
