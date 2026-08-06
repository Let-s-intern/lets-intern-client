import { http, HttpResponse } from 'msw';

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

export const accessLogHandlers = [
  http.get(`${BASE}/admin/access-log`, ({ request }) => {
    const url = new URL(request.url);
    const programId = url.searchParams.get('programId');
    const programType = url.searchParams.get('programType');
    const userKeyword = url.searchParams.get('userKeyword');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    const filtered = seedAccessLogs.filter((row) => {
      if (programId && row.programId !== Number(programId)) return false;
      if (programType && row.programType !== programType) return false;
      if (userKeyword) {
        const matched =
          row.userName?.includes(userKeyword) ||
          row.userEmail?.includes(userKeyword);
        if (!matched) return false;
      }
      return true;
    });

    const start = page * size;

    return HttpResponse.json({
      data: {
        accessLogList: filtered.slice(start, start + size),
        pageInfo: {
          pageNum: page,
          pageSize: size,
          totalElements: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / size)),
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
