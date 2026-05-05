import type { WrittenFeedbackMission, WrittenFeedbackStatus } from './types';

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
    categoryLabel: mission.categoryLabel,
    startDay: mission.startDay,
    endDay: mission.endDay,
  };
}
