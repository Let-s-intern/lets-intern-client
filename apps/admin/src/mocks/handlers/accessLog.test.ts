import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { accessLogListSchema } from '@/api/accessLog';

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
});
