import type { WrittenFeedbackMission } from './written/types';

export const DUMMY_WRITTEN_FEEDBACK_MISSIONS: WrittenFeedbackMission[] = [
  {
    id: 1,
    thumbnail: '',
    title: '프로그램 n주차 미션, 서면 피드백',
    status: 'pending',
    challengeType: '경험정리',
    missionNumber: 1,
    startDay: '2026-06-01',
    endDay: '2026-06-28',
  },
  {
    id: 2,
    thumbnail: '',
    title: '프로그램 n주차 미션',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명',
    status: 'submitted',
    challengeType: 'HR',
    missionNumber: 2,
    startDay: '2026-05-04',
    endDay: '2026-05-31',
  },
  {
    id: 3,
    thumbnail: '',
    title: '프로그램 n주차 서면 피드백 프로그램 n주차 미션',
    description:
      '미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명 미션설명',
    status: 'done',
    challengeType: '대기업 자소서',
    missionNumber: 3,
    startDay: '2026-04-01',
    endDay: '2026-04-30',
  },
];
