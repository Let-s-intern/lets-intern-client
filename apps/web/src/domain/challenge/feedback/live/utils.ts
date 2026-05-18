import type { LiveFeedbackItem } from '@/api/feedback/feedbackSchema';
import type { LiveFeedbackMission, LiveFeedbackStatus } from './types';

const FEEDBACK_STATUS_MAP: Record<string, LiveFeedbackStatus> = {
  RESERVED: 'reserved',
  CANCELED: 'canceled',
  CHANGED: 'changed',
  DONE: 'done',
  EXPIRED: 'expired',
};

export function toMission(
  item: LiveFeedbackItem,
  index: number,
  challengeType: string,
): LiveFeedbackMission {
  const startDay = item.missionStartDate.slice(0, 10);
  const endDay = item.missionEndDate.slice(0, 10);
  const status: LiveFeedbackStatus =
    item.feedbackId == null
      ? 'prev'
      : (FEEDBACK_STATUS_MAP[item.feedbackStatus ?? ''] ?? 'prev');

  return {
    id: index,
    thumbnail: item.thumbnail,
    title: item.missionTitle,
    status,
    challengeType,
    missionNumber: item.missionTh,
    startDay,
    endDay,
    reservationStartDay: startDay,
    reservationEndDay: endDay,
    assignedMentor: item.mentorInfo ?? null,
    reservationInfo: null,
  };
}

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

// 데모/전시용 — 2028-12-31 까지는 라이브 피드백 입장 버튼을 항상 활성 상태로 둔다.
// BE 연동 시점에 원래 윈도우(예약 시각 10분 전 ~ 30분 후)로 복원할 것.
const DEMO_ENTRANCE_OPEN_UNTIL = new Date('2028-12-31T23:59:59');

export function isEntranceActive(
  scheduledDate: string | null | undefined,
  scheduledTime: string | null | undefined,
): boolean {
  if (new Date() < DEMO_ENTRANCE_OPEN_UNTIL) return true;

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
