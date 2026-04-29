import type { ChallengeData } from '@/types';
import { MENTORS } from '../mentors';

export const portfolio: ChallengeData = {
  key: 'portfolio',
  menuLabel: '포트폴리오 2주 완성 챌린지',
  fullName: '포트폴리오 2주 완성 챌린지',
  detailUrl: '/challenge/portfolio',
  mentorSectionField: '포트폴리오',
  mentors: [MENTORS.march, MENTORS.dukyang, MENTORS.robo, MENTORS.moa],
  mentorDisplayCount: 4,
  feedbackOptions: [
    {
      tier: 'STANDARD',
      feedbackCount: '1회',
      feedbackDetails: [
        {
          round: '6회차',
          description: '포트폴리오 점검',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope: '피드백 진행 시간 30분 내 장수 제한 없이 피드백',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 마치 멘토 / 카카오 계열사 · 덕양 멘토 / 시리즈B 스타트업 · 로보 멘토 / 토스증권 · 모아 멘토 / 대학내일',
    },
    {
      tier: 'PREMIUM',
      feedbackCount: '2회',
      feedbackDetails: [
        {
          round: '4회차',
          description: '포트폴리오 발전',
          method: '라이브',
          exampleImages: [],
        },
        {
          round: '6회차',
          description: '포트폴리오 점검',
          method: '라이브',
          exampleImages: [],
        },
      ],
      feedbackScope:
        '4회차: 한 경험에 대해 만들어오는 포폴 1-3페이지에 대해 30분 피드백 / 6회차: 피드백 진행 시간 30분 내 장수 제한 없이 피드백',
      method: '1:1 Live',
      mentorInfo:
        '렛츠커리어 현직자 멘토단 · 마치 멘토 / 카카오 계열사 · 덕양 멘토 / 시리즈B 스타트업 · 로보 멘토 / 토스증권 · 모아 멘토 / 대학내일',
    },
  ],
  beforeAfter: null,
  liveMentoring: {
    title: '1:1 LIVE 피드백, 영상으로 미리 확인하세요!',
    subCopy1: '혼자 막막했던 고민들, 멘토님과 실시간으로 해결하세요',
    videoUrl:
      'https://drive.google.com/file/d/1LpYTc7NL1pgtwpfgErzahi-vLJQMmcm2/preview',
    subCopy2: '라이브로 주고 받는 맞춤형 피드백으로, 서류 완성도 UP!',
  },
};
