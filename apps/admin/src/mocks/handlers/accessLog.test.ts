import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  accessLogApplicationDetailSchema,
  accessLogListSchema,
} from '@/api/accessLog';

import { accessLogHandlers } from './accessLog';

const BASE = 'http://localhost/api/v1';
const server = setupServer(...accessLogHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fetchAccessLogs = async (query = '') => {
  const res = await fetch(`${BASE}/admin/access-log${query}`);
  const body = (await res.json()) as { data: unknown };
  return accessLogListSchema.parse(body.data);
};

const rowOf = (list: Awaited<ReturnType<typeof fetchAccessLogs>>, id: number) =>
  list.accessLogList.find((row) => row.applicationId === id);

const idsOf = (list: Awaited<ReturnType<typeof fetchAccessLogs>>) =>
  list.accessLogList.map((row) => row.applicationId);

/** 순서를 보지 않는 단언용. 정렬은 별도 테스트가 본다. */
const sortedIdsOf = (list: Awaited<ReturnType<typeof fetchAccessLogs>>) =>
  [...idsOf(list)].sort();

const DAY_MS = 24 * 60 * 60 * 1000;
const elapsedDays = (value: string) =>
  (Date.now() - new Date(value).getTime()) / DAY_MS;

/** 시드와 같은 방식으로 로컬 날짜를 만든다(UTC 로 밀면 하루가 어긋난다). */
const dateDaysAgo = (days: number) => {
  const date = new Date(Date.now() - days * DAY_MS);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
};

describe('GET /admin/access-log', () => {
  it('응답 전체가 스키마를 통과한다', async () => {
    const parsed = await fetchAccessLogs();

    expect(parsed.accessLogList.length).toBeGreaterThan(0);
    expect(parsed.trackedFrom).toBeTruthy();
  });

  it('집계 시작 시각은 행이 아니라 응답에 한 번만 실린다', async () => {
    const res = await fetch(`${BASE}/admin/access-log`);
    const body = (await res.json()) as {
      data: { accessLogList: Record<string, unknown>[] };
    };

    body.data.accessLogList.forEach((row) => {
      expect(row).not.toHaveProperty('trackedFrom');
    });
  });

  it('정상 이용 건이 대시보드와 미션을 함께 담고 있다', async () => {
    const row = rowOf(await fetchAccessLogs(), 6001);

    expect(row?.daysFromPaymentToFirstAccess).toBe(2);
    expect(row?.targetSummary).toEqual([
      { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
      { targetType: 'MISSION', count: 3 },
    ]);
  });

  it('집계 이전 결제는 결제 시각이 집계 시작보다 앞선다', async () => {
    // 이 케이스를 미이용과 구분하지 못하면 과거 결제가 전부 미이용으로 보인다.
    const parsed = await fetchAccessLogs();
    const row = rowOf(parsed, 6002);

    expect(row?.firstAccessedAt).toBeNull();
    expect(new Date(row!.paidAt!).getTime()).toBeLessThan(
      new Date(parsed.trackedFrom!).getTime(),
    );
  });

  it('미이용 · 7일 이내 건이 있다', async () => {
    const parsed = await fetchAccessLogs();
    const row = rowOf(parsed, 6003);

    expect(row?.firstAccessedAt).toBeNull();
    expect(new Date(row!.paidAt!).getTime()).toBeGreaterThanOrEqual(
      new Date(parsed.trackedFrom!).getTime(),
    );
    expect(elapsedDays(row!.paidAt!)).toBeLessThan(7);
  });

  it('미이용이지만 7일이 지난 대조군이 있다', async () => {
    const parsed = await fetchAccessLogs();
    const row = rowOf(parsed, 6004);

    expect(row?.firstAccessedAt).toBeNull();
    expect(elapsedDays(row!.paidAt!)).toBeGreaterThan(7);
  });

  it('대시보드만 12회인 건이 있다', async () => {
    // "12회"라는 숫자만으로는 판단할 수 없다는 것을 화면에서 확인하기 위한 행이다.
    const row = rowOf(await fetchAccessLogs(), 6005);

    expect(row?.accessCount).toBe(12);
    expect(row?.targetSummary).toEqual([
      { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
    ]);
  });

  it('VOD 와 가이드북은 대상이 프로그램 하나뿐이다', async () => {
    const parsed = await fetchAccessLogs();

    expect(rowOf(parsed, 6006)?.programType).toBe('VOD');
    expect(rowOf(parsed, 6007)?.programType).toBe('GUIDEBOOK');
    [6006, 6007].forEach((id) => {
      expect(rowOf(parsed, id)?.targetSummary).toEqual([
        { targetType: 'PROGRAM', count: 1 },
      ]);
    });
  });

  it('결제 시각을 알 수 없는 건도 목록에 남는다', async () => {
    // 걸러 내면 화면에서 존재 자체가 사라져 운영이 그런 건이 있는지도 모르게 된다.
    const row = rowOf(await fetchAccessLogs(), 6008);

    expect(row).toBeDefined();
    expect(row?.paidAt).toBeNull();
  });

  it('프로그램 타입으로 거른다', async () => {
    const parsed = await fetchAccessLogs('?programType=GUIDEBOOK');

    expect(parsed.accessLogList.map((row) => row.applicationId)).toEqual([
      6007,
    ]);
    expect(parsed.pageInfo.totalElements).toBe(1);
  });

  it('프로그램 ID 로 거른다', async () => {
    const parsed = await fetchAccessLogs('?programId=300');

    expect(parsed.accessLogList.map((row) => row.applicationId)).toEqual([
      6002,
    ]);
  });

  it('유저 이름 부분 일치로 거른다', async () => {
    const parsed = await fetchAccessLogs(
      `?userKeyword=${encodeURIComponent('렛츠')}`,
    );

    expect(parsed.accessLogList.map((row) => row.applicationId)).toEqual([
      6001,
    ]);
  });

  it('유저 이메일 부분 일치로 거른다', async () => {
    const parsed = await fetchAccessLogs('?userKeyword=guide@');

    expect(parsed.accessLogList.map((row) => row.applicationId)).toEqual([
      6007,
    ]);
  });

  it('프로그램 제목 부분 일치로 거른다', async () => {
    // 어드민은 programId 를 외우고 있지 않다. 제목으로 찾을 수 있어야 한다.
    const parsed = await fetchAccessLogs(
      `?programKeyword=${encodeURIComponent('가이드북')}`,
    );

    expect(idsOf(parsed)).toEqual([6007]);
  });

  it('제목 검색과 유저 검색은 AND 로 걸린다', async () => {
    const both = await fetchAccessLogs(
      `?programKeyword=${encodeURIComponent('챌린지')}&userKeyword=${encodeURIComponent('렛츠')}`,
    );
    const 어긋난조합 = await fetchAccessLogs(
      `?programKeyword=${encodeURIComponent('가이드북')}&userKeyword=${encodeURIComponent('렛츠')}`,
    );

    expect(idsOf(both)).toEqual([6001]);
    expect(idsOf(어긋난조합)).toEqual([]);
  });

  it('제목 검색과 프로그램 타입도 AND 로 걸린다', async () => {
    const parsed = await fetchAccessLogs(
      `?programKeyword=${encodeURIComponent('가이드북')}&programType=VOD`,
    );

    expect(idsOf(parsed)).toEqual([]);
  });

  it('결제일 범위로 거른다', async () => {
    const 최근 = await fetchAccessLogs(`?paidFrom=${dateDaysAgo(5)}`);
    const 오래됨 = await fetchAccessLogs(`?paidTo=${dateDaysAgo(25)}`);

    expect(sortedIdsOf(최근)).toEqual([6003]);
    expect(sortedIdsOf(오래됨)).toEqual([6002, 6007]);
  });

  it('결제 시각을 모르는 건은 결제일 범위에서 빠진다', async () => {
    // 날짜를 물었는데 날짜가 없는 행을 끼워 넣으면 범위가 의미를 잃는다.
    const parsed = await fetchAccessLogs(
      `?paidFrom=${dateDaysAgo(365)}&paidTo=${dateDaysAgo(0)}`,
    );

    expect(idsOf(parsed)).not.toContain(6008);
  });

  it('최초 이용일 범위로 거른다', async () => {
    const parsed = await fetchAccessLogs(
      `?firstAccessedFrom=${dateDaysAgo(10)}`,
    );

    // 이용 기록이 없는 건은 최초 이용일로 찾을 수 없다(PRD 5.5.1).
    expect(sortedIdsOf(parsed)).toEqual([6001]);
  });

  it('이용 상태 USED 는 기록이 있는 건만 남긴다', async () => {
    const parsed = await fetchAccessLogs('?usageStatus=USED');

    expect(sortedIdsOf(parsed)).toEqual([6001, 6005, 6006, 6007]);
  });

  it('미이용 목록에 집계 이전 결제가 섞이지 않는다', async () => {
    // 이 화면이 막으려는 사고가 필터 단위에서 재현되는 자리다.
    // 6002 는 집계 시작 이전 결제라 이용 여부를 말할 수 없다.
    const parsed = await fetchAccessLogs('?usageStatus=NOT_USED');

    expect(sortedIdsOf(parsed)).toEqual([6003, 6004]);
    expect(idsOf(parsed)).not.toContain(6002);
  });

  it('집계 이전만 따로 볼 수 있다', async () => {
    const parsed = await fetchAccessLogs('?usageStatus=BEFORE_TRACKING');

    expect(idsOf(parsed)).toEqual([6002]);
  });

  it('결제 시각을 모르는 건은 미이용에도 집계 이전에도 들어가지 않는다', async () => {
    // 판정 근거가 없는 건이 전액 환불 후보 목록에 섞이면 안 된다(PRD 7.4).
    for (const status of ['NOT_USED', 'BEFORE_TRACKING', 'USED']) {
      const parsed = await fetchAccessLogs(`?usageStatus=${status}`);

      expect(idsOf(parsed)).not.toContain(6008);
    }
  });

  it('결제 7일 이내 · 미이용 조합이 실제로 걸러진다', async () => {
    // 이 화면이 존재하는 이유인 질의다(PRD 5.5.3). 프리셋 파라미터 없이 조합으로 만든다.
    const parsed = await fetchAccessLogs(
      `?paidFrom=${dateDaysAgo(7)}&usageStatus=NOT_USED`,
    );

    // 적재 대상이 아닌 LIVE 행은 여기 섞이지 않는다. 전액 환불 후보를 찾는 질의라
    // 기록하지 않는 타입이 들어오면 그게 곧 잘못된 환불 근거가 된다.
    expect(sortedIdsOf(parsed)).toEqual([6003]);
  });

  it('취소 건은 기본 포함이고 끄면 빠진다', async () => {
    const 기본 = await fetchAccessLogs();
    const 제외 = await fetchAccessLogs('?includeCanceled=false');

    expect(idsOf(기본)).toContain(6004);
    expect(idsOf(제외)).not.toContain(6004);
    expect(idsOf(await fetchAccessLogs('?includeCanceled=true'))).toContain(
      6004,
    );
  });

  it('정렬 기준을 바꿀 수 있다', async () => {
    const 기본 = await fetchAccessLogs();
    const 결제최신 = await fetchAccessLogs('?sort=PAID_DESC');
    const 결제오래 = await fetchAccessLogs('?sort=PAID_ASC');

    // 기본은 최근 이용순이다. 6001 의 최근 이용이 가장 최신이다.
    expect(idsOf(기본)[0]).toBe(6001);
    expect(idsOf(결제최신)[0]).toBe(6003);
    expect(idsOf(결제오래)[0]).toBe(6002);
  });

  it('값이 없는 행은 정렬 방향과 무관하게 뒤로 간다', async () => {
    // 결제 시각을 모르는 행이 맨 위에 몰리면 목록이 비어 보인다.
    const 결제오래 = await fetchAccessLogs('?sort=PAID_ASC');

    expect(idsOf(결제오래).at(-1)).toBe(6008);
  });

  it('페이지네이션이 동작한다', async () => {
    const first = await fetchAccessLogs('?page=1&size=3');
    const second = await fetchAccessLogs('?page=2&size=3');

    expect(first.accessLogList).toHaveLength(3);
    expect(first.pageInfo.totalPages).toBe(
      Math.ceil(first.pageInfo.totalElements / 3),
    );
    expect(second.accessLogList[0]?.applicationId).not.toBe(
      first.accessLogList[0]?.applicationId,
    );
  });

  it('적재 대상이 아닌 타입은 목록에 내려오지 않는다', async () => {
    // 서버가 목록 쿼리에서 LIVE·REPORT 를 걸러 낸다. 목이 흉내 내지 않으면
    // 실서버에 없는 행이 보이고, `미이용` 으로 조회했을 때 그 행이 결과에 섞인다.
    const rows = (await fetchAccessLogs()).accessLogList;

    expect(rowOf(await fetchAccessLogs(), 6009)).toBeUndefined();
    expect(rows.some((row) => row.programType === 'LIVE')).toBe(false);
    expect(rows.some((row) => row.programType === 'REPORT')).toBe(false);
  });

  it('미이용으로 걸러도 적재 대상이 아닌 행은 섞이지 않는다', async () => {
    // 이 화면이 막으려는 오류의 필터 단위 재현이다. 기록하지 않는 타입이
    // 미이용 목록에 들어가면 운영이 전액 환불 대상으로 읽는다.
    const rows = (await fetchAccessLogs('?usageStatus=NOT_USED')).accessLogList;

    expect(rows.some((row) => row.programType === 'LIVE')).toBe(false);
  });

  it('단건 조회는 적재 대상이 아닌 신청서도 내려준다', async () => {
    // 목록과 반대다. 존재하는 신청서에 404 를 주는 것이 더 나쁜 거짓말이라
    // 서버가 거르지 않고, 화면이 `집계 대상 아님` 으로 답한다.
    const detail = await fetchAccessLogDetail(6009);

    expect(detail.programType).toBe('LIVE');
    expect(detail.firstAccessedAt).toBeNull();
  });
});

const fetchAccessLogDetail = async (applicationId: number) => {
  const res = await fetch(
    `${BASE}/admin/access-log/application/${applicationId}`,
  );
  const body = (await res.json()) as { data: unknown };
  return accessLogApplicationDetailSchema.parse(body.data);
};

describe('GET /admin/access-log/application/{applicationId}', () => {
  it('PRD 7.3 예시대로 대시보드 한 줄과 미션 세 줄을 내려준다', async () => {
    const detail = await fetchAccessLogDetail(6001);

    expect(detail.details).toHaveLength(4);
    expect(
      detail.details?.map((item) => [item.targetType, item.missionTh]),
    ).toEqual([
      ['CHALLENGE_DASHBOARD', null],
      ['MISSION', 3],
      ['MISSION', 5],
      ['MISSION', 7],
    ]);
  });

  it('미션 줄은 회차와 제목을 함께 담는다', async () => {
    // target_id 숫자만으로는 운영이 무슨 미션인지 알 수 없다(PRD 7.3).
    const detail = await fetchAccessLogDetail(6001);
    const missions = detail.details?.filter(
      (item) => item.targetType === 'MISSION',
    );

    missions?.forEach((item) => {
      expect(item.missionTh).toBeTypeOf('number');
      expect(item.targetTitle).toBeTruthy();
    });
  });

  it('대시보드만 이용한 건은 상세도 한 줄이다', async () => {
    const detail = await fetchAccessLogDetail(6005);

    expect(detail.details).toHaveLength(1);
    expect(detail.details?.[0]?.accessCount).toBe(12);
  });

  it('VOD·가이드북은 펼쳐도 한 줄이다', async () => {
    for (const id of [6006, 6007]) {
      const detail = await fetchAccessLogDetail(id);

      expect(detail.details).toHaveLength(1);
      expect(detail.details?.[0]?.targetType).toBe('PROGRAM');
    }
  });

  it('기록이 없는 건들은 상세도 빈 배열이다', async () => {
    // 왜 비었는지는 상세가 말하지 않는다. 상위 행의 판정이 구분해 준다(PRD 7.4).
    for (const id of [6002, 6003, 6008, 6009]) {
      const detail = await fetchAccessLogDetail(id);

      expect(detail.details).toEqual([]);
    }
  });

  it('없는 신청서는 404 로 답한다', async () => {
    // 빈 상세를 돌려주면 화면이 조회 실패와 내역 없음을 구분할 수 없다.
    const res = await fetch(`${BASE}/admin/access-log/application/999999`);

    expect(res.status).toBe(404);
  });
});

describe('목록과 상세의 정합성', () => {
  /**
   * 목록이 `미션 3건` 이라고 적어 놓고 펼치면 두 줄만 나오는 목은 검증에 쓸 수 없다.
   * 버그인지 목이 틀린 건지 구분할 수 없기 때문이다.
   */
  it('상세 줄의 횟수 합계가 목록의 이용 횟수와 같다', async () => {
    const list = await fetchAccessLogs('?size=100');

    for (const row of list.accessLogList) {
      const detail = await fetchAccessLogDetail(row.applicationId);
      const sum = (detail.details ?? []).reduce(
        (acc, item) => acc + (item.accessCount ?? 0),
        0,
      );

      expect(sum).toBe(row.accessCount ?? 0);
    }
  });

  it('상세의 대상 개수가 목록의 이용 항목 요약과 같다', async () => {
    // targetSummary.count 는 접근 횟수가 아니라 구별되는 대상 개수다(PRD 5.5.1).
    const list = await fetchAccessLogs('?size=100');

    for (const row of list.accessLogList) {
      const detail = await fetchAccessLogDetail(row.applicationId);

      const distinctByType = new Map<string, Set<number | null>>();
      (detail.details ?? []).forEach((item) => {
        const type = item.targetType ?? '';
        const bucket = distinctByType.get(type) ?? new Set();
        bucket.add(item.targetId ?? null);
        distinctByType.set(type, bucket);
      });

      const summary = (row.targetSummary ?? []).map((item) => [
        item.targetType,
        item.count,
      ]);
      const fromDetail = [...distinctByType].map(([type, ids]) => [
        type,
        ids.size,
      ]);

      expect(fromDetail).toEqual(summary);
    }
  });

  it('상세의 요약 필드가 목록 행과 어긋나지 않는다', async () => {
    const list = await fetchAccessLogs('?size=100');

    for (const row of list.accessLogList) {
      const detail = await fetchAccessLogDetail(row.applicationId);

      expect(detail.firstAccessedAt).toBe(row.firstAccessedAt);
      expect(detail.lastAccessedAt).toBe(row.lastAccessedAt);
      expect(detail.paidAt).toBe(row.paidAt);
      expect(detail.daysFromPaymentToFirstAccess).toBe(
        row.daysFromPaymentToFirstAccess,
      );
    }
  });

  it('상세의 최초·최근 이용이 낱개 줄의 범위와 맞는다', async () => {
    const detail = await fetchAccessLogDetail(6001);
    const times = (detail.details ?? []).flatMap((item) => [
      new Date(item.firstAccessedAt!).getTime(),
      new Date(item.lastAccessedAt!).getTime(),
    ]);

    expect(new Date(detail.firstAccessedAt!).getTime()).toBe(
      Math.min(...times),
    );
    expect(new Date(detail.lastAccessedAt!).getTime()).toBe(Math.max(...times));
  });
});

describe('페이지네이션 안정성', () => {
  /*
    정렬이 고유 키로 끝나지 않으면 동률 행의 순서가 조회마다 달라진다. 페이지네이션은
    정렬 결과를 잘라 내므로, 순서가 흔들리면 어떤 행은 두 페이지에 나오고 어떤 행은
    어느 페이지에도 안 나온다. 1페이지와 2페이지가 같아 보인다는 제보로 드러난 결함이다.
  */
  const SORTS = ['LAST_ACCESSED_DESC', 'PAID_DESC', 'PAID_ASC'];

  it.each(SORTS)('%s — 페이지 사이에 겹치는 행이 없다', async (sort) => {
    const first = await fetchAccessLogs(`?sort=${sort}&page=1&size=3`);
    const second = await fetchAccessLogs(`?sort=${sort}&page=2&size=3`);

    const overlap = idsOf(first).filter((id) => idsOf(second).includes(id));

    expect(overlap).toEqual([]);
  });

  it.each(SORTS)('%s — 전 페이지를 이으면 전체와 같다', async (sort) => {
    // 겹침만 보면 누락을 놓친다. 빠진 행은 어느 페이지에도 안 나온다.
    const all = await fetchAccessLogs(`?sort=${sort}&size=100`);
    const total = all.pageInfo.totalElements;

    const collected: number[] = [];
    for (let page = 1; (page - 1) * 3 < total; page += 1) {
      const chunk = await fetchAccessLogs(`?sort=${sort}&page=${page}&size=3`);
      collected.push(...idsOf(chunk));
    }

    expect(collected).toHaveLength(total);
    expect([...collected].sort()).toEqual([...idsOf(all)].sort());
  });

  it.each(SORTS)('%s — 같은 조회를 반복해도 순서가 같다', async (sort) => {
    const once = await fetchAccessLogs(`?sort=${sort}&size=100`);
    const twice = await fetchAccessLogs(`?sort=${sort}&size=100`);

    expect(idsOf(once)).toEqual(idsOf(twice));
  });

  it('정렬을 지정하지 않아도 순서가 정해진다', async () => {
    const first = await fetchAccessLogs('?page=1&size=3');
    const second = await fetchAccessLogs('?page=2&size=3');

    expect(idsOf(first).filter((id) => idsOf(second).includes(id))).toEqual([]);
  });

  it('이용 기록이 없는 건은 최근 이용순에서 뒤로 밀린다', async () => {
    // 서버가 NULL 을 내림차순 뒤로 보내는 것과 같아야 한다.
    const rows = (await fetchAccessLogs('?sort=LAST_ACCESSED_DESC&size=100'))
      .accessLogList;

    const lastAccessedIndexes = rows.map((row) => Boolean(row.lastAccessedAt));
    const firstEmpty = lastAccessedIndexes.indexOf(false);

    if (firstEmpty !== -1) {
      expect(lastAccessedIndexes.slice(firstEmpty)).not.toContain(true);
    }
  });
});

describe('동률 행의 순서 규칙', () => {
  /*
    겹침·누락 테스트만으로는 tie-breaker 가 있는지 알 수 없다. JS 의 Array.sort 는
    안정 정렬이고 시드가 고정 배열이라, 비교자가 0 을 돌려줘도 순서가 그대로 유지된다.
    즉 tie-breaker 를 지워도 그 테스트들은 통과한다.

    그래서 순서 자체를 단언한다. 서버가 쓰는 규칙과 같은 결과여야 한다.
  */

  it('최근 이용순 — 이용 기록이 없는 건끼리는 결제일 최신순이다', async () => {
    const rows = (await fetchAccessLogs('?sort=LAST_ACCESSED_DESC&size=100'))
      .accessLogList;

    const unusedIds = rows
      .filter((row) => !row.lastAccessedAt)
      .map((row) => row.applicationId);

    // 결제일 desc: 6003(2일 전) → 6004(20일) → 6002(90일) → 6008(결제일 없음)
    // tie-breaker 가 없으면 시드 순서(6002, 6003, 6004, 6008)가 그대로 나온다.
    expect(unusedIds).toEqual([6003, 6004, 6002, 6008]);
  });

  it('결제일 정렬은 오름차순과 내림차순이 서로 뒤집힌 결과다', async () => {
    const desc = await fetchAccessLogs('?sort=PAID_DESC&size=100');
    const asc = await fetchAccessLogs('?sort=PAID_ASC&size=100');

    // 결제일을 아는 건만 본다. 없는 건의 자리는 방향과 무관하게 뒤다.
    const known = (list: number[]) => list.filter((id) => id !== 6008);

    expect(known(idsOf(desc))).toEqual([...known(idsOf(asc))].reverse());
  });
});
