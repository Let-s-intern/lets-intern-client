import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';
import type { Dayjs } from 'dayjs';

/** 지금 이용 중인 VOD 이용권의 요약 (LC-3438) */
export interface VodPassHolding {
  /** 지금 이용 중인 이용권 */
  current: VodPass;
  /** 이어 붙은 이용권까지 합친 마지막 종료 시각 */
  endsAt: string;
  /** 이용 중인 이용권 뒤에 예약된 이용권이 이어져 있는가 */
  hasScheduled: boolean;
}

/**
 * 이용 중(`ACTIVE`)인 이용권이 있으면 요약을 돌려준다. 없으면 null 이다.
 *
 * 이용권은 앞선 이용권이 끝난 시각에 다음 것이 이어서 시작되므로(`SCHEDULED`),
 * 남은 기간은 이용 중인 이용권의 종료일이 아니라 이어진 이용권의 마지막 종료일까지로 본다.
 * 서버가 챌린지 레거시 시청 권한은 목록에 주지 않아 그 권한만 가진 사용자는 null 이다.
 */
export function summarizeVodPassHolding(
  passes: VodPass[],
  now: Dayjs = dayjs(),
): VodPassHolding | null {
  const current = passes.find(
    (pass) =>
      pass.status === 'ACTIVE' &&
      pass.endsAt &&
      dayjs(pass.endsAt).isAfter(now),
  );
  if (!current?.endsAt) {
    return null;
  }

  const upcoming = passes
    .filter(
      (pass) => pass.status === 'SCHEDULED' && pass.startsAt && pass.endsAt,
    )
    .sort((a, b) => dayjs(a.startsAt).valueOf() - dayjs(b.startsAt).valueOf());

  let endsAt = current.endsAt;
  let hasScheduled = false;
  for (const pass of upcoming) {
    const startsAt = dayjs(pass.startsAt);
    if (
      !startsAt.isAfter(dayjs(endsAt)) &&
      dayjs(pass.endsAt).isAfter(endsAt)
    ) {
      endsAt = pass.endsAt as string;
      hasScheduled = true;
    }
  }

  return { current, endsAt, hasScheduled };
}

/**
 * 남은 기간 문구. 달력 날짜 기준으로 개월과 일을 센다.
 * 예: `2개월 12일 남음`, `12일 남음`, `오늘 종료`
 */
export function formatVodPassRemaining(
  endsAt: string,
  now: Dayjs = dayjs(),
): string {
  // 시각이 아니라 날짜로 센다. 종료일이 1월 14일이면 11월 1일 기준 2개월 13일이다
  const today = now.startOf('day');
  const end = dayjs(endsAt).startOf('day');
  const months = end.diff(today, 'month');
  const days = end.diff(today.add(months, 'month'), 'day');

  if (months === 0 && days === 0) {
    return '오늘 종료';
  }
  if (months === 0) {
    return `${days}일 남음`;
  }
  return days === 0 ? `${months}개월 남음` : `${months}개월 ${days}일 남음`;
}

/** 이용 기간 문구. 예: `2026.10.16 ~ 2027.01.14` */
export function formatVodPassPeriod(startsAt: string, endsAt: string): string {
  return `${dayjs(startsAt).format('YYYY.MM.DD')} ~ ${dayjs(endsAt).format('YYYY.MM.DD')}`;
}
