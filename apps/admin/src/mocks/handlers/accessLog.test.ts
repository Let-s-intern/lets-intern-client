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

const DAY_MS = 24 * 60 * 60 * 1000;
const elapsedDays = (value: string) =>
  (Date.now() - new Date(value).getTime()) / DAY_MS;

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

  it('페이지네이션이 동작한다', async () => {
    const first = await fetchAccessLogs('?page=0&size=3');
    const second = await fetchAccessLogs('?page=1&size=3');

    expect(first.accessLogList).toHaveLength(3);
    expect(first.pageInfo.totalPages).toBe(
      Math.ceil(first.pageInfo.totalElements / 3),
    );
    expect(second.accessLogList[0]?.applicationId).not.toBe(
      first.accessLogList[0]?.applicationId,
    );
  });

  it('적재 대상이 아닌 타입의 신청서도 행으로 내려온다', async () => {
    // 목록이 신청서 기준 left join 이라 LIVE 도 행이 된다. 화면이 이 행을 `미이용` 이
    // 아니라 `집계 대상 아님` 으로 표시하는지 확인하려면 목에 실물이 있어야 한다.
    const row = rowOf(await fetchAccessLogs(), 6009);

    expect(row?.programType).toBe('LIVE');
    expect(row?.firstAccessedAt).toBeNull();
    expect(elapsedDays(row!.paidAt!)).toBeLessThan(7);
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
