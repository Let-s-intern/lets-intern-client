import type { LiveFeedbackMission, LiveFeedbackStatus } from './types';

export const LIVE_FEEDBACK_SECTIONS: {
  status: LiveFeedbackStatus;
  label: string;
  emptyMessage: string;
}[] = [
  {
    status: 'prev',
    label: '예약 전',
    emptyMessage: '예약 전인 미션이 없어요.',
  },
  {
    status: 'reserved',
    label: '예약 완료',
    emptyMessage: '예약 완료된 미션이 없어요.',
  },
  {
    status: 'done',
    label: '피드백 완료',
    emptyMessage: '피드백 완료된 미션이 없어요.',
  },
];

export const LIVE_FEEDBACK_BUTTON_LABELS: Record<
  LiveFeedbackStatus,
  { buttonLabel: string; openLabel: string }
> = {
  prev: { buttonLabel: '예약 신청 보기', openLabel: '예약 신청 닫기' },
  reserved: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
  done: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
};

export const LIVE_FEEDBACK_STATUS_LABEL: Record<LiveFeedbackStatus, string> = {
  prev: '예약 전',
  reserved: '예약 완료',
  done: '참여 완료',
};

export const LIVE_FEEDBACK_STATUS_VARIANT: Record<
  LiveFeedbackStatus,
  'neutral' | 'active' | 'done'
> = {
  prev: 'neutral',
  reserved: 'active',
  done: 'done',
};

export function toCardConfig(mission: LiveFeedbackMission) {
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
  };
}

export function formatDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year.slice(2)}.${month}.${day}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
}

export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  return `${fmt(weekStart)} – ${fmt(end)}`;
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatReservationTime(dateStr: string, time: string): string {
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
