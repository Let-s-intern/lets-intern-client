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
          round: '6회차 이후',
          description: '자기소개서 및 포트폴리오 완성',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 써니 멘토 / 한국타이어 · 덕양 멘토 / 시리즈B 스타트업 · 허태훈 멘토 / 공인노무사 · 알렉스 멘토 / 한화 계열사',
    },
    {
      tier: 'PREMIUM',
      feedbackCount: '2회',
      feedbackDetails: [
        {
          round: '6회차 이후',
          description: '자기소개서 및 포트폴리오 완성',
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
  liveMentoring: {
    title: '1:1 LIVE 피드백, 영상으로 미리 확인하세요!',
    subCopy1: '혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요',
    videoUrl:
      'https://drive.google.com/file/d/1gy0W3n_iNBYd9oVrWuGQ5m-T8MhU2VQ4/preview',
    subCopy2: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
  },
};
