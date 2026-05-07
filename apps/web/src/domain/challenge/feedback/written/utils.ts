import type { WrittenFeedbackMission, WrittenFeedbackStatus } from './types';

export const WRITTEN_FEEDBACK_SECTIONS: {
  status: WrittenFeedbackStatus;
  label: string;
  emptyMessage: string;
}[] = [
  {
    status: 'pending',
    label: '제출 전',
    emptyMessage: '제출 전인 미션이 없어요.',
  },
  {
    status: 'submitted',
    label: '제출 완료',
    emptyMessage: '제출 완료된 미션이 없어요.',
  },
  {
    status: 'done',
    label: '피드백 완료',
    emptyMessage: '피드백 완료된 미션이 없어요.',
  },
];

export const WRITTEN_FEEDBACK_STATUS_LABEL: Record<
  WrittenFeedbackStatus,
  string
> = {
  pending: '제출 필요',
  submitted: '피드백 대기',
  done: '피드백 완료',
};

export const WRITTEN_FEEDBACK_STATUS_VARIANT: Record<
  WrittenFeedbackStatus,
  'neutral' | 'active' | 'done'
> = {
  pending: 'neutral',
  submitted: 'active',
  done: 'done',
};

export const WRITTEN_FEEDBACK_BUTTON_LABEL: Record<
  WrittenFeedbackStatus,
  string
> = {
  pending: '미션 제출하기',
  submitted: '미션 제출물 보기',
  done: '피드백 보기',
};

export function toWrittenCardConfig(mission: WrittenFeedbackMission) {
  return {
    thumbnail: mission.thumbnail,
    title: mission.title,
    description: mission.description,
    badge: {
      label: WRITTEN_FEEDBACK_STATUS_LABEL[mission.status],
      variant: WRITTEN_FEEDBACK_STATUS_VARIANT[mission.status],
    },
    challengeType: mission.challengeType ?? '',
    missionNumber: mission.missionNumber,
    startDay: mission.startDay,
    endDay: mission.endDay,
    reservationStartDay: mission.reservationStartDay,
    reservationEndDay: mission.reservationEndDay,
  };
}
