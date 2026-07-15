import type { WrittenFeedbackItem } from '@/api/feedback/feedbackSchema';
import type { WrittenFeedbackMission, WrittenFeedbackStatus } from './types';

function computeFeedbackPeriod(missionEndDate: string) {
  const end = new Date(missionEndDate);

  const start = new Date(end);
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const periodEnd = new Date(end);
  periodEnd.setDate(periodEnd.getDate() + 3);
  periodEnd.setHours(23, 59, 59, 999);

  return { start, periodEnd };
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function resolveStatus(item: WrittenFeedbackItem): WrittenFeedbackStatus {
  const submitted = ['PRESENT', 'UPDATED', 'LATE'].includes(
    item.attendanceStatus ?? '',
  );
  const missionEnded = new Date(item.missionEndDate) < new Date();

  if (!submitted) return missionEnded ? 'expired' : 'in_progress';

  if (item.feedbackStatus === 'CONFIRMED') return 'confirmed';

  const { periodEnd } = computeFeedbackPeriod(item.missionEndDate);
  return periodEnd < new Date() ? 'expired' : 'waiting';
}

export function toWrittenMission(
  item: WrittenFeedbackItem,
  challengeType: string,
): WrittenFeedbackMission {
  const { start, periodEnd } = computeFeedbackPeriod(item.missionEndDate);
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
    feedbackPeriodStart: formatDate(start),
    feedbackPeriodEnd: formatDate(periodEnd),
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
    feedbackStartDay: mission.feedbackPeriodStart,
    feedbackEndDay: mission.feedbackPeriodEnd,
  };
}
