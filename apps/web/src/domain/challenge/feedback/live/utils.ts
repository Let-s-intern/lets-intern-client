import type {
  FeedbackInfo,
  LiveFeedbackItem,
} from '@/api/feedback/feedbackSchema';
import type { ChallengeType } from '@/schema';
import { challengeTypeToText } from '@/utils/convert';
import type { LiveFeedbackMission, LiveFeedbackStatus } from './types';

function resolveStatus(
  item: LiveFeedbackItem,
  isMissionSubmitted: boolean,
): LiveFeedbackStatus {
  const isExpired = new Date(item.missionEndDate) < new Date();

  const isAdminConfirmed =
    ['PRESENT', 'UPDATED'].includes(item.attendanceStatus ?? '') &&
    item.attendanceResult === 'PASS';

  if (!item.feedbackId || !isAdminConfirmed) {
    return isExpired ? 'expired' : 'prev';
  }
  if (item.menteeStatus === 'ABSENT') return 'nonParticipation';
  if (item.mentorStatus === 'ABSENT') return 'checkNeeded';
  if (item.menteeStatus === 'PRESENT' && item.mentorStatus === 'PRESENT') {
    return 'completed';
  }
  if (item.feedbackEndDate && new Date(item.feedbackEndDate) < new Date()) {
    return 'nonParticipation';
  }
  return 'reserved';
}

export function toMission(
  item: LiveFeedbackItem,
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

  const isMissionSubmitted = ['PRESENT', 'UPDATED', 'LATE'].includes(
    item.attendanceStatus ?? '',
  );
  const status = resolveStatus(item, isMissionSubmitted);

  return {
    missionId: item.missionId,
    missionTh: item.missionTh,
    thumbnail: item.thumbnail,
    missionTitle: item.missionTitle,
    status,
    challengeType,
    missionStartDate: startDay,
    missionEndDate: endDay,
    feedbackStartDate: feedbackStartDay,
    feedbackEndDate: feedbackEndDay,
    attendanceResult: item.attendanceResult,
    mentorInfo: item.mentorInfo ?? null,
    feedbackId: item.feedbackId,
    isMissionSubmitted,
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
  nonParticipation: '미참여',
  checkNeeded: '확인필요',
};

export const LIVE_FEEDBACK_STATUS_VARIANT: Record<
  LiveFeedbackStatus,
  'neutral' | 'active' | 'muted' | 'error'
> = {
  prev: 'neutral',
  reserved: 'muted',
  completed: 'active',
  expired: 'muted',
  nonParticipation: 'muted',
  checkNeeded: 'error',
};

export function isEntranceActive(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): boolean {
  if (!startDate || !endDate) return false;
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now < end && (start.getTime() - now.getTime()) / 60_000 <= 10;
}

function isInProgress(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): boolean {
  if (!startDate || !endDate) return false;
  const now = new Date();
  return now >= new Date(startDate) && now < new Date(endDate);
}

function formatReservationDateTime(
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

export function toCardConfig(
  mission: LiveFeedbackMission,
  feedbackInfo?: FeedbackInfo | null,
) {
  const inProgress =
    mission.status === 'reserved' &&
    isInProgress(feedbackInfo?.startDate, feedbackInfo?.endDate);

  return {
    thumbnail: mission.thumbnail,
    title: mission.missionTitle,
    badge: {
      label: inProgress
        ? '진행 중'
        : LIVE_FEEDBACK_STATUS_LABEL[mission.status],
      variant: inProgress
        ? ('active' as const)
        : LIVE_FEEDBACK_STATUS_VARIANT[mission.status],
    },
    challengeType:
      challengeTypeToText[mission.challengeType as ChallengeType] ??
      mission.challengeType ??
      '',
    missionNumber: mission.missionTh,
    feedbackStartDay: mission.missionEndDate,
    feedbackEndDay: mission.feedbackEndDate,
    startDay: mission.missionStartDate,
    endDay: mission.missionEndDate,
    reservationDateTime:
      mission.feedbackId != null
        ? formatReservationDateTime(feedbackInfo?.startDate)
        : undefined,
  };
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
