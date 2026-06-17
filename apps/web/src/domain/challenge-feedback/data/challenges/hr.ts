import type { ChallengeData } from '../../types';
import { MENTORS } from '../mentors';

export const hr: ChallengeData = {
  key: 'hr',
  menuLabel: 'HR 서류 완성 챌린지',
  fullName: 'HR 서류 완성 챌린지',
  detailUrl: '/challenge/hr',
  mentorSectionField: 'HR 서류',
  mentors: [
    MENTORS.sunny,
    MENTORS.dukyang,
    MENTORS.taehoon,
    MENTORS.alex,
    MENTORS.gidae,
  ],
  mentorDisplayCount: 5,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '1회',
      feedbackDetails: [
        {
          round: '6회차 이후(멘토 1명)',
          description: '서류 피드백 및 커피챗',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 써니 멘토 / 한국타이어 · 덕양 멘토 / 시리즈B 스타트업 · 허태훈 멘토 / 공인노무사 · 알렉스 멘토 / 한화 계열사 · 기대 멘토 / 100대 외국계 기업',
    },
    {
      tier: 'PREMIUM',
      feedbackCount: '2회',
      feedbackDetails: [
        {
          round: '6회차 이후(멘토 2명)',
          description: '서류 피드백 및 커피챗',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 써니 멘토 / 한국타이어 · 덕양 멘토 / 시리즈B 스타트업 · 허태훈 멘토 / 공인노무사 · 알렉스 멘토 / 한화 계열사 · 기대 멘토 / 100대 외국계 기업',
    },
  ],
  beforeAfter: null,
  liveMentoring: null,
  liveFeedbackGuide: {
    title: '현직자와의 소중한 만남, 커피챗으로도 활용해보세요!',
    subCopy: '실제로 아래와 같은 이야기를 멘토님과 대화해 볼 수 있어요!',
    imageUrl: '/images/challenge-feedback/live-feedback-guide/hr.png',
  },
};
