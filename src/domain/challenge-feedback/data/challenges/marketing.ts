import type { ChallengeData } from '../../types';
import { EXAMPLE_BASE } from '../common';
import { MENTORS } from '../mentors';

export const marketing: ChallengeData = {
  key: 'marketing',
  menuLabel: '마케팅 서류 완성 챌린지',
  fullName: '마케팅 서류 완성 챌린지',
  detailUrl: '/challenge/marketing',
  mentorSectionField: '마케팅 서류',
  mentors: [MENTORS.joan, MENTORS.moa, MENTORS.roy, MENTORS.irin, MENTORS.bin],
  mentorDisplayCount: 5,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '1회',
      feedbackDetails: [
        {
          round: '8회차',
          description: '포트폴리오 완성',
          method: '서면',
          exampleImages: [`${EXAMPLE_BASE}/marketing/round-8-1.png`],
        },
      ],
      feedbackScope: '원하는 서류 1종',
      method: '서면 피드백',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 조앤 멘토 / 놀유니버스 · 모아 멘토 / 대학내일 · 로이 멘토 / 클래스101 외',
    },
    {
      tier: 'PREMIUM',
      feedbackCount: '2회',
      feedbackDetails: [
        {
          round: '3회차',
          description: '경험 분석',
          method: '서면',
          exampleImages: [`${EXAMPLE_BASE}/marketing/round-3-1.png`],
        },
        {
          round: '8회차',
          description: '포트폴리오 완성',
          method: '서면',
          exampleImages: [`${EXAMPLE_BASE}/marketing/round-8-1.png`],
        },
      ],
      feedbackScope: '3회차: 경험 분석 / 8회차: 원하는 서류 1종',
      method: '서면 피드백',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 조앤 멘토 / 놀유니버스 · 모아 멘토 / 대학내일 · 로이 멘토 / 클래스101 외',
    },
  ],
  beforeAfter: {
    beforeImage: '/images/challenge-feedback/before-after/before.png',
    beforeDescription: '캡쳐된 이미지로 나열된 평범한 포트폴리오',
    afterImage: '/images/challenge-feedback/before-after/after.png',
    afterDescription: '문제와 해결 전략, 성과까지 핵심 역량이 돋보이는 포트폴리오',
  },
  liveMentoring: null,
};
