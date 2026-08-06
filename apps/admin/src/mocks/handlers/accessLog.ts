import { http, HttpResponse } from 'msw';

import type { AccessLogRow } from '@/api/accessLog';

import {
  MOCK_TRACKED_FROM,
  seedAccessLogDetails,
  seedAccessLogs,
} from '../seed/accessLog';

/**
 * 이용 로그 조회 MSW 핸들러 (LC-3201).
 *
 * axios 응답 본문이 `{ data: <payload> }` 엔벨로프(`res.data.data`)이므로 `{ data }` 로 감싼다.
 * 경로는 `VITE_SERVER_API` 와 프록시를 고려해 와일드카드로 매칭한다.
 *
 * 읽기 전용 조회라 시드를 변경하지 않는다.
 */

const BASE = '*/api/v1';

/**
 * 취소된 신청서로 취급할 행.
 *
 * 서버 응답에 취소 여부 필드가 아직 없다 — `includeCanceled` 는 서버가 안에서 거르는
 * 조건이고 화면에 컬럼도 없다. 그래서 응답 계약을 지어내지 않고 목 안에서만 표시한다.
 * BE 가 실제 필드를 내리기 시작해도 화면은 바뀔 것이 없다.
 */
const MOCK_CANCELED_APPLICATION_IDS = new Set([6004]);

/**
 * 목록에서 빼는 프로그램 타입.
 *
 * 서버가 목록 쿼리에서 LIVE·REPORT 를 걸러 낸다. 적재 대상이 아니라 이용 여부를 말할 수
 * 없는 타입이라 아예 내려보내지 않는다. 단건 조회는 다르다 — 존재하는 신청서에 404 를
 * 주는 것이 더 나쁜 거짓말이라 거르지 않고, 화면이 `집계 대상 아님` 으로 답한다.
 *
 * 목이 이 차이를 흉내 내지 않으면 목록에 없어야 할 행이 보이고, `미이용` 으로 조회했을 때
 * 그 행이 결과에 섞인다. 목으로 QA 하는 동안 실서버에 없는 상태를 정상으로 보게 된다.
 * 시드에는 LIVE 행을 그대로 둔다 — 단건·환불 모달 경로에서는 서버도 내려주기 때문이다.
 */
const LIST_EXCLUDED_PROGRAM_TYPES = new Set(['LIVE', 'REPORT']);

/** 날짜 범위는 날짜까지만 본다(`2026-08-06T09:00:00` → `2026-08-06`). 경계는 포함이다. */
const dateOf = (value: string | null | undefined) =>
  value?.slice(0, 10) ?? null;

const inDateRange = (
  value: string | null | undefined,
  from: string | null,
  to: string | null,
) => {
  if (!from && !to) return true;

  const date = dateOf(value);
  // 값이 없으면 범위를 걸었을 때 빠진다. 미이용 건은 최초 이용일로 찾을 수 없다.
  if (!date) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
};

/**
 * 이용 상태 판정 (PRD 5.5.2). 화면의 `resolveUsageStatus` 와 같은 규칙이다.
 *
 * 결제 시각을 모르는 건은 어느 쪽에도 넣지 않는다. `미이용` 으로 넣으면
 * 판정 근거가 없는 건이 전액 환불 후보 목록에 섞인다.
 */
const matchesUsageStatus = (row: AccessLogRow, status: string) => {
  const used = Boolean(row.firstAccessedAt);
  if (status === 'USED') return used;
  if (used) return false;
  if (!row.paidAt) return false;

  const beforeTracking = row.paidAt < MOCK_TRACKED_FROM;
  return status === 'BEFORE_TRACKING' ? beforeTracking : !beforeTracking;
};

/** 값이 없는 행은 정렬 방향과 무관하게 뒤로 보낸다. 위에 몰리면 목록이 빈 것처럼 보인다. */
const compareNullable = (
  a: string | null | undefined,
  b: string | null | undefined,
  direction: 1 | -1,
) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a < b ? -direction : a > b ? direction : 0;
};

/** 신청서 ID 는 고유하다. 정렬의 마지막 키로 두면 순서가 한 가지로 정해진다. */
const compareId = (a: AccessLogRow, b: AccessLogRow, direction: 1 | -1) =>
  (a.applicationId - b.applicationId) * direction;

/** 앞 비교가 동률이면 다음으로 넘긴다. */
const chain =
  (...comparators: ((a: AccessLogRow, b: AccessLogRow) => number)[]) =>
  (a: AccessLogRow, b: AccessLogRow) => {
    for (const compare of comparators) {
      const result = compare(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };

/**
 * 정렬은 반드시 **고유 키로 끝난다**(서버와 같은 규칙).
 *
 * 마지막 키가 고유하지 않으면 동률 행들의 순서가 매 조회마다 달라진다. 페이지네이션은
 * 정렬 결과를 잘라 내는 방식이라, 순서가 흔들리면 **어떤 행은 두 페이지에 나오고 어떤 행은
 * 어느 페이지에도 안 나온다.** 실제로 1페이지와 2페이지가 같아 보이는 제보로 드러났다.
 *
 * 목이 이 결함을 함께 갖고 있으면 목으로 개발하는 동안 영원히 보이지 않는다.
 * 실서버에 붙여야만 드러나는 버그를 목이 가려 주는 셈이라 목의 존재 이유와 반대다.
 */
const SORTERS: Record<string, (a: AccessLogRow, b: AccessLogRow) => number> = {
  LAST_ACCESSED_DESC: chain(
    (a, b) => compareNullable(a.lastAccessedAt, b.lastAccessedAt, -1),
    (a, b) => compareNullable(a.paidAt, b.paidAt, -1),
    (a, b) => compareId(a, b, -1),
  ),
  PAID_DESC: chain(
    (a, b) => compareNullable(a.paidAt, b.paidAt, -1),
    (a, b) => compareId(a, b, -1),
  ),
  PAID_ASC: chain(
    (a, b) => compareNullable(a.paidAt, b.paidAt, 1),
    (a, b) => compareId(a, b, 1),
  ),
};

export const accessLogHandlers = [
  http.get(`${BASE}/admin/access-log`, ({ request }) => {
    const url = new URL(request.url);
    const programId = url.searchParams.get('programId');
    const programType = url.searchParams.get('programType');
    const programKeyword = url.searchParams.get('programKeyword');
    const userKeyword = url.searchParams.get('userKeyword');
    const paidFrom = url.searchParams.get('paidFrom');
    const paidTo = url.searchParams.get('paidTo');
    const firstAccessedFrom = url.searchParams.get('firstAccessedFrom');
    const firstAccessedTo = url.searchParams.get('firstAccessedTo');
    const usageStatus = url.searchParams.get('usageStatus');
    const includeCanceled = url.searchParams.get('includeCanceled');
    const sort = url.searchParams.get('sort');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    // 모든 조건은 AND 다. 하나라도 어긋나면 행이 빠진다.
    const filtered = seedAccessLogs.filter((row) => {
      // 서버가 목록에서 빼는 타입은 목도 빼야 한다. 다른 조건보다 먼저 본다.
      if (row.programType && LIST_EXCLUDED_PROGRAM_TYPES.has(row.programType)) {
        return false;
      }
      if (programId && row.programId !== Number(programId)) return false;
      if (programType && row.programType !== programType) return false;
      // 제목이 없는 행은 제목으로 찾을 수 없다. 걸러지는 것이 맞다.
      if (programKeyword && !row.programTitle?.includes(programKeyword))
        return false;
      if (userKeyword) {
        const matched =
          row.userName?.includes(userKeyword) ||
          row.userEmail?.includes(userKeyword);
        if (!matched) return false;
      }
      if (!inDateRange(row.paidAt, paidFrom, paidTo)) return false;
      if (
        !inDateRange(row.firstAccessedAt, firstAccessedFrom, firstAccessedTo)
      ) {
        return false;
      }
      if (usageStatus && !matchesUsageStatus(row, usageStatus)) return false;
      // 기본은 포함이다. 취소돼도 분쟁은 이어진다.
      if (
        includeCanceled === 'false' &&
        MOCK_CANCELED_APPLICATION_IDS.has(row.applicationId)
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered].sort(
      SORTERS[sort ?? ''] ?? SORTERS.LAST_ACCESSED_DESC,
    );

    const start = page * size;

    return HttpResponse.json({
      data: {
        accessLogList: sorted.slice(start, start + size),
        pageInfo: {
          pageNum: page,
          pageSize: size,
          totalElements: sorted.length,
          totalPages: Math.max(1, Math.ceil(sorted.length / size)),
        },
        // 집계 시작 시각은 행이 아니라 응답에 한 번만 실린다.
        trackedFrom: MOCK_TRACKED_FROM,
      },
    });
  }),

  /**
   * 행을 펼쳤을 때만 호출되는 단건 조회 (PRD 5.5).
   *
   * 없는 신청서는 404 로 답한다. 빈 상세를 돌려주면 화면이 조회 실패와 내역 없음을
   * 구분할 수 없고, 실패가 `내역 없음` 으로 보이는 것이 이 기능에서 가장 위험한 오독이다.
   */
  http.get(
    `${BASE}/admin/access-log/application/:applicationId`,
    ({ params }) => {
      const detail = seedAccessLogDetails[Number(params.applicationId)];

      if (!detail) return new HttpResponse(null, { status: 404 });

      return HttpResponse.json({ data: detail });
    },
  ),
];
