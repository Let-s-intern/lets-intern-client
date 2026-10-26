import type { VodPass } from '@/api/vodPass';
import dayjs from '@/lib/dayjs';

export interface VodPassSummary {
  startsAt: string;
  endsAt: string;
  remainingDays: number;
  isWatchable: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const hasPeriod = (
  pass: VodPass,
): pass is VodPass & { startsAt: string; endsAt: string } =>
  !!pass.startsAt && !!pass.endsAt;

/**
 * 이용 중·이용 예정 이용권을 하나의 기간으로 합친다 (LC-3507).
 * 이용권은 서버에서 앞 이용권 종료 시각부터 이어 붙으므로, 가장 이른 시작부터 가장 늦은 종료까지가
 * 지금 보유한 이용 기간이다. 남은 일수는 서버 `VodPassPeriodService.remainingDays` 처럼 올림한다.
 */
export function summarizeVodPasses(
  passes: VodPass[],
  now: Date,
): VodPassSummary | null {
  const current = passes
    .filter((pass) => pass.status === 'ACTIVE' || pass.status === 'SCHEDULED')
    .filter(hasPeriod);
  if (current.length === 0) return null;

  const first = current.reduce((a, b) =>
    dayjs(a.startsAt).isBefore(b.startsAt) ? a : b,
  );
  const last = current.reduce((a, b) =>
    dayjs(a.endsAt).isAfter(b.endsAt) ? a : b,
  );
  const remainingMs = dayjs(last.endsAt).valueOf() - now.getTime();

  return {
    startsAt: first.startsAt,
    endsAt: last.endsAt,
    remainingDays: remainingMs <= 0 ? 0 : Math.ceil(remainingMs / DAY_MS),
    isWatchable: current.some((pass) => pass.status === 'ACTIVE'),
  };
}

/** 종료된 이용권 중 가장 늦게 끝난 것. 이용 중·예정 이용권이 없을 때 마지막 기간을 보여주는 데 쓴다. */
export function findLastEndedVodPass(passes: VodPass[]) {
  return passes
    .filter((pass) => pass.status === 'EXPIRED')
    .filter(hasPeriod)
    .reduce<(VodPass & { startsAt: string; endsAt: string }) | undefined>(
      (latest, pass) =>
        !latest || dayjs(pass.endsAt).isAfter(latest.endsAt) ? pass : latest,
      undefined,
    );
}
