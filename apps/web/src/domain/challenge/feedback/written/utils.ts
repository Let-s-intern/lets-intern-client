import type { WrittenFeedbackItem } from '@/api/feedback/feedbackSchema';
import type { WrittenFeedbackMission, WrittenFeedbackStatus } from './types';

function resolveStatus(item: WrittenFeedbackItem): WrittenFeedbackStatus {
  if (item.feedbackStatus === 'WAITING') return 'waiting';
  if (item.feedbackStatus === 'CONFIRMED') return 'confirmed';
  return new Date(item.missionEndDate) < new Date() ? 'expired' : 'in_progress';
}

export function toWrittenMission(
  item: WrittenFeedbackItem,
  challengeType: string,
): WrittenFeedbackMission {
  return {
    id: item.attendanceId,
    missionId: item.missionId,
    thumbnail: item.thumbnail,
    title: item.missionTitle,
    status: resolveStatus(item),
    challengeType,
    missionNumber: item.missionTh,
    startDay: item.missionStartDate,
    endDay: item.missionEndDate,
  };
}

export const WRITTEN_FEEDBACK_SECTIONS: {
  status: WrittenFeedbackStatus;
  label: string;
  emptyMessage: string;
}[] = [
  {
    status: 'in_progress',
    label: '진행 전',
    emptyMessage: '제출 전인 미션이 없어요.',
  },
  {
    status: 'waiting',
    label: '진행 중',
    emptyMessage: '제출 완료된 미션이 없어요.',
  },
  {
    status: 'confirmed',
    label: '진행 완료',
    emptyMessage: '피드백 완료된 미션이 없어요.',
  },
  {
    status: 'expired',
    label: '미진행',
    emptyMessage: '기간이 만료된 미션이 없어요.',
  },
];

export const WRITTEN_FEEDBACK_STATUS_LABEL: Record<
  WrittenFeedbackStatus,
  string
> = {
  in_progress: '진행 전',
  waiting: '진행 중',
  confirmed: '진행 완료',
  expired: '기간 만료',
};

export const WRITTEN_FEEDBACK_STATUS_VARIANT: Record<
  WrittenFeedbackStatus,
  'neutral' | 'active' | 'muted'
> = {
  in_progress: 'neutral',
  waiting: 'muted',
  confirmed: 'active',
  expired: 'muted',
};

export const WRITTEN_FEEDBACK_BUTTON_LABEL: Record<
  WrittenFeedbackStatus,
  string
> = {
  in_progress: '미션 제출하기',
  waiting: '미션 제출물 보기',
  confirmed: '피드백 보기',
  expired: '',
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
    feedbackStartDay: mission.startDay,
    feedbackEndDay: mission.endDay,
  };
}
