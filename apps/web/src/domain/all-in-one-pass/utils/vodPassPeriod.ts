import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';

const KST = 'Asia/Seoul';

export interface VodPassPeriod {
  startsAt: string;
  endsAt: string;
  /** false 면 이용권은 있지만 아직 시작 전이다 */
  isActive: boolean;
}

type DatedVodPass = VodPass & { startsAt: string; endsAt: string };

const isUsablePass = (pass: VodPass): pass is DatedVodPass =>
  (pass.status === 'ACTIVE' || pass.status === 'SCHEDULED') &&
  pass.startsAt != null &&
  pass.endsAt != null;

/**
 * 지금 쓸 수 있는 이용 기간. 추가 구매분은 앞 이용권 종료 시각에 이어 붙으므로 연속된 구매분을 합친다.
 * 이용 중이거나 시작 예정인 이용권이 없으면 null 이다.
 */
export function getVodPassPeriod(passes: VodPass[]): VodPassPeriod | null {
  const [first, ...rest] = passes
    .filter(isUsablePass)
    .sort((a, b) => dayjs(a.startsAt).diff(b.startsAt));
  if (!first) return null;

  let endsAt = first.endsAt;
  for (const pass of rest) {
    if (dayjs(pass.startsAt).isAfter(endsAt)) break;
    if (dayjs(pass.endsAt).isAfter(endsAt)) endsAt = pass.endsAt;
  }

  return {
    startsAt: first.startsAt,
    endsAt,
    isActive: first.status === 'ACTIVE',
  };
}

/** 마감일까지 남은 날을 한국 날짜 기준으로 센다. */
export function getVodPassDDayLabel(
  endsAt: string,
  now: Date = new Date(),
): string {
  const daysLeft = dayjs(endsAt)
    .tz(KST)
    .startOf('day')
    .diff(dayjs(now).tz(KST).startOf('day'), 'day');
  return daysLeft === 0 ? 'D-Day' : `D-${daysLeft}`;
}
