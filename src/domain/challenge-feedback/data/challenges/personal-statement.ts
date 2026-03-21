import type { ChallengeData } from '../../types';
import { MENTORS } from '../mentors';

export const personalStatement: ChallengeData = {
  key: 'personal-statement',
  menuLabel: '자기소개서 2주 완성 챌린지',
  fullName: '자기소개서 2주 완성 챌린지',
  detailUrl: '/challenge/personal-statement',
  mentorSectionField: '자기소개서',
  mentors: [MENTORS.teamtam, MENTORS.jack],
  mentorDisplayCount: 2,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '1회',
      feedbackDetails: [
        {
          round: '5회차',
          description: '자기소개서 완성',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '피드백 진행 시간 30분 내 문항 제한 없이 피드백',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 팀탐 멘토 / 시리즈C 스타트업 · 잭 멘토 / BGF 리테일',
    },
    {
      tier: 'PREMIUM',
      feedbackCount: '2회',
      feedbackDetails: [
        {
          round: '3회차',
          description: '자기소개서 기초',
          method: '라이브',
          exampleImages: [],
        },
        {
          round: '5회차',
          description: '자기소개서 완성',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope:
        '3회차: 한 문항에 대해 30분 피드백 / 5회차: 피드백 진행 시간 30분 내 문항 제한 없이 피드백',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 팀탐 멘토 / 시리즈C 스타트업 · 잭 멘토 / BGF 리테일',
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
