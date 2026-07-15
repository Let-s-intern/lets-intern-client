import type {
  FeedbackInfo,
  LiveFeedbackItem,
} from '@/api/feedback/feedbackSchema';
import type { ChallengeType } from '@/schema';
import { challengeTypeToText } from '@/utils/convert';
import type { LiveFeedbackMission, LiveFeedbackStatus } from './types';

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function resolveStatus(item: LiveFeedbackItem): LiveFeedbackStatus {
  const isExpired = new Date(item.missionEndDate) < new Date();
  const validSubmission =
    ['PRESENT', 'UPDATED'].includes(item.attendanceStatus ?? '') &&
    item.attendanceResult === 'PASS';

  // 피드백 세션이 존재하면 출석 결과를 우선 확인 (attendanceResult와 무관)
  if (item.feedbackId) {
    const sessionEnded =
      !!item.feedbackEndDate && new Date(item.feedbackEndDate) < new Date();

    // 어드민 확인완료(PASS)된 미션 제출이 없으면 세션 불참은 기간 만료로 처리
    if (item.menteeStatus === 'ABSENT') {
      return validSubmission ? 'nonParticipation' : 'expired';
    }
    if (item.mentorStatus === 'ABSENT') return 'checkNeeded';
    // 양쪽 모두 PRESENT여도 세션이 끝나기 전이면 'completed'로 보지 않는다.
    // 멘토가 라이브 중 출석을 미리 체크해도 멘티의 입장 버튼이 닫혀 못 들어가는
    // 문제를 막기 위함 — 종료 시각이 지난 뒤에야 '진행 완료(회고)'로 전환한다.
    if (
      sessionEnded &&
      item.menteeStatus === 'PRESENT' &&
      item.mentorStatus === 'PRESENT'
    ) {
      return 'completed';
    }
    if (sessionEnded) {
      return validSubmission ? 'nonParticipation' : 'expired';
    }
  }

  // 진행 예정: 정상제출 + 어드민 확인완료인 경우에만
  const isAdminConfirmed =
    ['PRESENT', 'UPDATED'].includes(item.attendanceStatus ?? '') &&
    item.attendanceResult === 'PASS';

  if (item.feedbackId && isAdminConfirmed) return 'reserved';

  return isExpired ? 'expired' : 'prev';
}

export function toMission(
  item: LiveFeedbackItem,
  challengeType: string,
): LiveFeedbackMission {
  const end = new Date(item.missionEndDate);

  const slotStart = new Date(end);
  slotStart.setDate(slotStart.getDate() + 2);
  slotStart.setHours(0, 0, 0, 0);

  const slotEnd = new Date(end);
  slotEnd.setDate(slotEnd.getDate() + 4);
  slotEnd.setHours(23, 59, 59, 999);

  const feedbackStartDay = formatLocalDate(slotStart);
  const feedbackEndDay = formatLocalDate(slotEnd);

  const isMissionSubmitted = ['PRESENT', 'UPDATED', 'LATE'].includes(
    item.attendanceStatus ?? '',
  );
  const status = resolveStatus(item);

  return {
    missionId: item.missionId,
    missionTh: item.missionTh,
    thumbnail: item.thumbnail,
    missionTitle: item.missionTitle,
    status,
    challengeType,
    missionStartDate: item.missionStartDate,
    missionEndDate: item.missionEndDate,
    slotRangeStart: feedbackStartDay,
    slotRangeEnd: feedbackEndDay,
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
  completed: 'muted',
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
    feedbackStartDay: mission.slotRangeStart,
    feedbackEndDay: mission.slotRangeEnd,
    startDay: mission.missionStartDate.slice(0, 10),
    endDay: mission.missionEndDate.slice(0, 10),
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
