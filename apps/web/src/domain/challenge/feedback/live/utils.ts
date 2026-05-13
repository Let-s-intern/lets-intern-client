import type { LiveFeedbackMission, LiveFeedbackStatus } from './types';

export const LIVE_FEEDBACK_SECTIONS: {
  statuses: LiveFeedbackStatus[];
  label: string;
  emptyMessage: string;
}[] = [
  {
    statuses: ['prev', 'canceled'],
    label: '예약 필요',
    emptyMessage: '예약 필요한 미션이 없어요.',
  },
  {
    statuses: ['reserved', 'changed'],
    label: '예약 완료',
    emptyMessage: '예약 완료된 미션이 없어요.',
  },
  {
    statuses: ['done'],
    label: '피드백 완료',
    emptyMessage: '피드백 완료된 미션이 없어요.',
  },
  {
    statuses: ['expired'],
    label: '기간 만료',
    emptyMessage: '기간이 만료된 미션이 없어요.',
  },
];

export const LIVE_FEEDBACK_BUTTON_LABELS: Partial<
  Record<LiveFeedbackStatus, { buttonLabel: string; openLabel: string }>
> = {
  prev: { buttonLabel: '예약 신청 보기', openLabel: '예약 신청 닫기' },
  canceled: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
  reserved: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
  changed: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
  done: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
};

export const LIVE_FEEDBACK_STATUS_LABEL: Record<LiveFeedbackStatus, string> = {
  prev: '예약 전',
  canceled: '예약 취소',
  reserved: '예약 완료',
  changed: '예약 변경',
  done: '피드백 완료',
  expired: '예약 종료',
};

export const LIVE_FEEDBACK_STATUS_VARIANT: Record<
  LiveFeedbackStatus,
  'neutral' | 'active' | 'muted' | 'canceled'
> = {
  prev: 'neutral',
  canceled: 'canceled',
  reserved: 'muted',
  changed: 'active',
  done: 'muted',
  expired: 'muted',
};

export function formatReservationDateTime(
  dateStr: string | null | undefined,
  time: string | null | undefined,
): string | null {
  if (!dateStr || !time) return null;
  const date = new Date(dateStr);
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const [hour, minute] = time.split(':').map(Number);
  const totalEnd = hour * 60 + minute + 30;
  const endTime = `${String(Math.floor(totalEnd / 60)).padStart(2, '0')}:${String(totalEnd % 60).padStart(2, '0')}`;

  return `${yy}.${mm}.${dd} ${time}~${endTime}`;
}

export function toCardConfig(mission: LiveFeedbackMission) {
  const showDateTime =
    mission.status === 'reserved' || mission.status === 'changed';

  return {
    thumbnail: mission.thumbnail,
    title: mission.title,
    description: mission.description,
    badge: {
      label: LIVE_FEEDBACK_STATUS_LABEL[mission.status],
      variant: LIVE_FEEDBACK_STATUS_VARIANT[mission.status],
    },
    challengeType: mission.challengeType ?? '',
    missionNumber: mission.missionNumber,
    startDay: mission.startDay,
    endDay: mission.endDay,
    reservationStartDay: mission.reservationStartDay,
    reservationEndDay: mission.reservationEndDay,
    reservationDateTime: showDateTime
      ? formatReservationDateTime(
          mission.reservationInfo?.scheduledDate,
          mission.reservationInfo?.scheduledTime,
        )
      : undefined,
  };
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isEntranceActive(
  scheduledDate: string | null | undefined,
  scheduledTime: string | null | undefined,
): boolean {
  if (!scheduledDate || !scheduledTime) return false;
  const [hour, minute] = scheduledTime.split(':').map(Number);
  const start = new Date(scheduledDate);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const now = new Date();

  return now < end && (start.getTime() - now.getTime()) / 60_000 <= 10;
}

export function formatReservationTime(
  dateStr: string | null | undefined,
  time: string | null | undefined,
): string | null {
  if (!dateStr || !time) return null;
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const dow = DOW[date.getDay()];

  const [hour, minute] = time.split(':').map(Number);
  const totalEnd = hour * 60 + minute + 30;
  const endTime = `${String(Math.floor(totalEnd / 60)).padStart(2, '0')}:${String(totalEnd % 60).padStart(2, '0')}`;

  return `${month}월 ${day}일 (${dow})  ${time}~${endTime}`;
}
