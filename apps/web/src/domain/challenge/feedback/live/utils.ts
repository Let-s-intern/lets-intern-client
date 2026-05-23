import type { LiveFeedbackItem } from '@/api/feedback/feedbackSchema';
import type { LiveFeedbackMission, LiveFeedbackStatus } from './types';

const FEEDBACK_STATUS_MAP: Record<string, LiveFeedbackStatus> = {
  RESERVED: 'reserved',
  COMPLETED: 'completed',
};

export function toMission(
  item: LiveFeedbackItem,
  index: number,
  challengeType: string,
): LiveFeedbackMission {
  const startDay = item.missionStartDate.slice(0, 10);
  const endDay = item.missionEndDate.slice(0, 10);
  const feedbackStartDay = endDay;
  const feedbackEndDay = new Date(
    new Date(item.missionEndDate).getTime() + 3 * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .slice(0, 10);

  let status: LiveFeedbackStatus = 'prev';
  if (item.feedbackId == null) {
    status = new Date(item.missionEndDate) < new Date() ? 'expired' : 'prev';
  } else {
    status = FEEDBACK_STATUS_MAP[item.feedbackStatus ?? ''] ?? 'prev';
  }

  return {
    id: index,
    thumbnail: item.thumbnail,
    title: item.missionTitle,
    status,
    challengeType,
    missionNumber: item.missionTh,
    startDay,
    endDay,
    feedbackStartDay,
    feedbackEndDay,
    assignedMentor: item.mentorInfo ?? null,
    reservationInfo: null,
  };
}

export const LIVE_FEEDBACK_BUTTON_LABELS: Partial<
  Record<LiveFeedbackStatus, { buttonLabel: string; openLabel: string }>
> = {
  prev: { buttonLabel: '예약 신청 하기', openLabel: '예약 신청 닫기' },
  reserved: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
  completed: { buttonLabel: '피드백 내역 보기', openLabel: '피드백 내역 닫기' },
};

export const LIVE_MISSION_BUTTON_LABEL: Partial<
  Record<LiveFeedbackStatus, string>
> = {
  prev: '미션 제출하기',
  reserved: '제출된 미션 보기',
  completed: '제출된 미션 보기',
};

export const LIVE_FEEDBACK_STATUS_LABEL: Record<LiveFeedbackStatus, string> = {
  prev: '진행 전',
  reserved: '진행 예정',
  completed: '진행 완료',
  expired: '기간 만료',
};

export const LIVE_FEEDBACK_STATUS_VARIANT: Record<
  LiveFeedbackStatus,
  'neutral' | 'active' | 'muted'
> = {
  prev: 'neutral',
  reserved: 'muted',
  completed: 'active',
  expired: 'muted',
};

export function formatReservationDateTime(
  isoDateTime: string | null | undefined,
): string | null {
  if (!isoDateTime) return null;
  const date = new Date(isoDateTime);
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hour = date.getHours();
  const minute = date.getMinutes();
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const totalEnd = hour * 60 + minute + 30;
  const endTime = `${String(Math.floor(totalEnd / 60)).padStart(2, '0')}:${String(totalEnd % 60).padStart(2, '0')}`;

  return `${yy}.${mm}.${dd} ${time}~${endTime}`;
}

export function isInProgress(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): boolean {
  if (!startDate || !endDate) return false;
  const now = new Date();
  return now >= new Date(startDate) && now < new Date(endDate);
}

export function toCardConfig(mission: LiveFeedbackMission) {
  const inProgress =
    mission.status === 'reserved' &&
    isInProgress(
      mission.reservationInfo?.startDate,
      mission.reservationInfo?.endDate,
    );

  return {
    thumbnail: mission.thumbnail,
    title: mission.title,
    badge: {
      label: inProgress
        ? '진행 중'
        : LIVE_FEEDBACK_STATUS_LABEL[mission.status],
      variant: inProgress
        ? 'active'
        : LIVE_FEEDBACK_STATUS_VARIANT[mission.status],
    },
    challengeType: mission.challengeType ?? '',
    missionNumber: mission.missionNumber,
    feedbackStartDay: mission.feedbackStartDay,
    feedbackEndDay: mission.feedbackEndDay,
    startDay: mission.startDay,
    endDay: mission.endDay,
    reservationDateTime:
      mission.status === 'reserved' || mission.status === 'completed'
        ? formatReservationDateTime(mission.reservationInfo?.startDate)
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
  startDate: string | null | undefined,
  endDate?: string | null,
): boolean {
  if (new Date() < DEMO_ENTRANCE_OPEN_UNTIL) return true;

  if (!startDate) return false;
  const start = new Date(startDate);
  const end = endDate
    ? new Date(endDate)
    : new Date(start.getTime() + 30 * 60 * 1000);
  const now = new Date();

  return now < end && (start.getTime() - now.getTime()) / 60_000 <= 10;
}

export function formatReservationTime(
  isoDateTime: string | null | undefined,
): string | null {
  if (!isoDateTime) return null;
  const date = new Date(isoDateTime);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const dow = DOW[date.getDay()];
  const hour = date.getHours();
  const minute = date.getMinutes();
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const totalEnd = hour * 60 + minute + 30;
  const endTime = `${String(Math.floor(totalEnd / 60)).padStart(2, '0')}:${String(totalEnd % 60).padStart(2, '0')}`;

  return `${month}월 ${day}일 (${dow}) ${time}~${endTime}`;
}
