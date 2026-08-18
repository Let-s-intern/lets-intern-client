import type { ChallengeMentorVo } from '@/api/user/user';

/**
 * 그리드에 음영으로 깔 챌린지 기간 한 구간.
 * `startDate`·`endDate` 는 서버가 준 `LocalDateTime` 문자열 그대로다.
 */
export interface ChallengePeriod {
  challengeId: number;
  title: string;
  /** `"2026-09-01T00:00:00"` */
  startDate: string;
  /** `"2026-09-21T23:59:59"` */
  endDate: string;
}

/**
 * 응답에서 음영 대상 기간만 추린다.
 *
 * `GET /challenge-mentor` 는 종료된 챌린지까지 전부 주는데, 서버가 1대1 예약 가능
 * 목록에서 슬롯을 뺄 때 쓰는 `findActiveMyChallengeMentorVosByMentorId` 는
 * `challenge.startDate <= now <= challenge.endDate` 인 것만 본다. 그 조건이 곧
 * `programStatusType === 'PROCEEDING'` 이다.
 *
 * 걸러내지 않으면 화면이 서버보다 넓게 막힌 것처럼 보인다 — 멘토는 1대1 신청이 안
 * 들어온다고 오해하지만 실제로는 들어온다.
 */
export const toActiveChallengePeriods = (
  challenges: ChallengeMentorVo[],
): ChallengePeriod[] =>
  challenges
    .filter((challenge) => challenge.programStatusType === 'PROCEEDING')
    .map((challenge) => ({
      challengeId: challenge.challengeId,
      title: challenge.title,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
    }));

/**
 * 기간 목록을 그리드 셀 키(`"YYYY-MM-DD|HH:mm"`) 집합으로 펼친다.
 *
 * **보이는 주의 날짜만** 펼친다. 챌린지 하나가 몇 주씩 이어지므로 전 구간을 펼치면
 * 셀 수천 개가 나오고, 챌린지가 여러 개면 그만큼 곱해진다. 그리드가 실제로 그리는
 * 셀만 담으면 최대 `days × times` 개다.
 *
 * 판정은 셀의 **시작 시각**이 `startDate` 이상 `endDate` 이하인지로 한다. 서버의
 * 챌린지 기간 판정(`challenge.startDate <= slot.startDate <= challenge.endDate`)과
 * 같은 식이라 경계 셀의 포함 여부가 화면과 서버에서 일치한다.
 *
 * 여러 챌린지가 겹치면 합집합이다.
 */
/**
 * 경계값을 `LocalDateTime` 으로 맞춘다.
 *
 * 서버는 `LocalDateTime` 을 주지만 날짜만 오는 경로가 있어(목 시드가 그렇다) 그대로
 * 사전순 비교하면 종료일 당일이 통째로 빠진다 — `"2026-05-08T09:00" <= "2026-05-08"`
 * 이 거짓이기 때문이다. 시작은 그날 00:00, 종료는 그날 23:59:59 로 읽는다.
 */
const normalizeBound = (value: string, kind: 'start' | 'end'): string =>
  value.includes('T')
    ? value
    : `${value}T${kind === 'start' ? '00:00:00' : '23:59:59'}`;

export const toChallengePeriodCellKeys = (
  periods: ChallengePeriod[],
  /** 보이는 주의 날짜 `"YYYY-MM-DD"` 목록 */
  days: string[],
  /** 그리드의 시간 행 `"HH:mm"` 목록 */
  times: string[],
): Set<string> => {
  const keys = new Set<string>();
  if (periods.length === 0) return keys;

  const bounds = periods.map((period) => ({
    start: normalizeBound(period.startDate, 'start'),
    end: normalizeBound(period.endDate, 'end'),
  }));

  for (const date of days) {
    for (const time of times) {
      // `LocalDateTime` 문자열은 자리수가 고정이라 사전순 비교가 시각순 비교와 같다.
      const cellStart = `${date}T${time}:00`;
      const covered = bounds.some(
        (bound) => bound.start <= cellStart && cellStart <= bound.end,
      );
      if (covered) keys.add(`${date}|${time}`);
    }
  }

  return keys;
};
