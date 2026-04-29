import type { ChallengeData } from '@/types';
import { EXAMPLE_BASE } from '../common';
import { MENTORS } from '../mentors';

export const largeCorp: ChallengeData = {
  key: 'large-corp',
  menuLabel: '대기업 완성 챌린지',
  fullName: '대기업 완성 챌린지',
  detailUrl: '/challenge/large-corp',
  mentorSectionField: '대기업 서류',
  mentors: [
    MENTORS.hailey,
    MENTORS.julia,
    MENTORS.jussaem,
    MENTORS.matthew,
    MENTORS.ifssaem,
    MENTORS.doan,
    MENTORS.jack,
  ],
  mentorDisplayCount: 7,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '2회',
      feedbackDetails: [
        {
          round: '3회차',
          description: '경험 분석',
          method: '서면',
          exampleImages: [
            `${EXAMPLE_BASE}/large-corp/round-3-1.png`,
            `${EXAMPLE_BASE}/large-corp/round-3-2.png`,
          ],
        },
        {
          round: '6회차',
          description: '자기소개서 완성',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '',
      method: '• 3회차: 서면 피드백\n• 6회차: 1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 헤일리 멘토 / 현대자동차 · 줄리아 멘토 / 현대자동차 · 쥬쌤 멘토 / SK하이닉스 · 매튜 멘토 / 현대모비스 · 이프쌤 멘토 / SK이노베이션 계열사 · 도안 멘토 / 국내 은행 · 잭 멘토 / BGF 리테일',
    },
    {
      tier: 'PREMIUM',
      feedbackCount: '4회',
      feedbackDetails: [
        {
          round: '3회차',
          description: '경험 분석',
          method: '서면',
          exampleImages: [
            `${EXAMPLE_BASE}/large-corp/round-3-1.png`,
            `${EXAMPLE_BASE}/large-corp/round-3-2.png`,
          ],
        },
        {
          round: '4회차',
          description: '직무 역량 답변',
          method: '서면',
          exampleImages: [`${EXAMPLE_BASE}/large-corp/round-4-1.png`],
        },
        {
          round: '5회차',
          description: '지원동기 답변',
          method: '서면',
          exampleImages: [`${EXAMPLE_BASE}/large-corp/round-5-1.png`],
        },
        {
          round: '6회차',
          description: '자기소개서 완성',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '',
      method: '• 3/4/5회차: 서면 피드백\n• 6회차: 1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 헤일리 멘토 / 현대자동차 · 줄리아 멘토 / 현대자동차 · 쥬쌤 멘토 / SK하이닉스 · 매튜 멘토 / 현대모비스 · 이프쌤 멘토 / SK이노베이션 계열사 · 도안 멘토 / 국내 은행 · 잭 멘토 / BGF 리테일',
    },
  ],
  beforeAfter: null,
  liveMentoring: null,
};
