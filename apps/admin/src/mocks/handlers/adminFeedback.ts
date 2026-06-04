import { http, HttpResponse } from 'msw';

import {
  seedFeedbacks,
  seedHistoryByFeedbackId,
  seedSlotsByMentorId,
} from '../seed/feedback';

/**
 * LIVE 피드백(예약) MSW 핸들러.
 *
 * BE LC-3065-feat 계약(base `/api/v1`)을 목으로 제공한다.
 * axios 응답 본문은 `{ data: <payload> }` 엔벨로프(`res.data.data`)이므로
 * 모든 응답을 `{ data }` 로 감싼다.
 *
 * 경로는 `VITE_SERVER_API`(dev=`/api/v1`) 상대 경로 + 프록시를 고려해
 * 와일드카드(BASE 상수)로 매칭한다.
 */

const BASE = '*/api/v1';

/** 숫자 배열 쿼리(challengeIdList 등) 파싱 */
function getNumberList(url: URL, key: string): number[] {
  return url.searchParams
    .getAll(key)
    .flatMap((v) => v.split(','))
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isFinite(n));
}

/** ISO 문자열 비교(LocalDateTime, 동일 포맷 가정) */
function isWithin(
  target: string,
  start: string | null,
  end: string | null,
): boolean {
  if (start && target < start) return false;
  if (end && target > end) return false;
  return true;
}

export const adminFeedbackHandlers = [
  // 전체 예약 목록 (필터 반영)
  http.get(`${BASE}/admin/feedback`, ({ request }) => {
    const url = new URL(request.url);

    const challengeIdList = getNumberList(url, 'challengeIdList');
    const mentorIdList = getNumberList(url, 'mentorIdList');
    const menteeIdList = getNumberList(url, 'menteeIdList');
    const feedbackStartDate = url.searchParams.get('feedbackStartDate');
    const feedbackEndDate = url.searchParams.get('feedbackEndDate');
    const createStartDate = url.searchParams.get('createStartDate');
    const createEndDate = url.searchParams.get('createEndDate');

    const filtered = seedFeedbacks.filter((item) => {
      if (
        challengeIdList.length > 0 &&
        !challengeIdList.includes(item.challengeId)
      ) {
        return false;
      }
      if (mentorIdList.length > 0 && !mentorIdList.includes(item.mentorId)) {
        return false;
      }
      if (menteeIdList.length > 0 && !menteeIdList.includes(item.menteeId)) {
        return false;
      }
      if (!isWithin(item.vo.startDate, feedbackStartDate, feedbackEndDate)) {
        return false;
      }
      if (!isWithin(item.vo.createDate, createStartDate, createEndDate)) {
        return false;
      }
      return true;
    });

    return HttpResponse.json({
      data: {
        feedbackList: filtered.map((item) => ({
          ...item.vo,
          // 예약 이동 횟수 = 변경 내역 길이 (목 전용, BE 미제공)
          rescheduleCount: (seedHistoryByFeedbackId[item.vo.feedbackId] ?? [])
            .length,
        })),
      },
    });
  }),

  // 예약 상세
  http.get(`${BASE}/admin/feedback/:feedbackId`, ({ params }) => {
    const feedbackId = Number(params.feedbackId);
    const found = seedFeedbacks.find(
      (item) => item.vo.feedbackId === feedbackId,
    );

    if (!found) {
      return HttpResponse.json(
        { message: 'feedback not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: { feedbackInfo: found.detail } });
  }),

  // 예약 변경 내역
  http.get(`${BASE}/admin/feedback/:feedbackId/history`, ({ params }) => {
    const feedbackId = Number(params.feedbackId);
    const historyList = seedHistoryByFeedbackId[feedbackId] ?? [];
    return HttpResponse.json({ data: { historyList } });
  }),

  // 멘토 슬롯 (범위·상태 필터)
  http.get(`${BASE}/admin/feedback/slot/:mentorId`, ({ params, request }) => {
    const mentorId = Number(params.mentorId);
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const statusList = url.searchParams
      .getAll('statusList')
      .flatMap((v) => v.split(','))
      .map((v) => v.trim())
      .filter(Boolean);

    const slots = seedSlotsByMentorId[mentorId] ?? [];
    const filtered = slots.filter((slot) => {
      if (!isWithin(slot.startDate, startDate, endDate)) return false;
      if (statusList.length > 0 && !statusList.includes(slot.status)) {
        return false;
      }
      return true;
    });

    return HttpResponse.json({ data: { feedbackSlotList: filtered } });
  }),

  // 예약 일시 변경 (다른 OPEN 슬롯으로 이동)
  // BE: POST /admin/feedback/{feedbackId}/slot/{feedbackSlotId} (바디 없음, SuccessResponse<null>)
  // 목 동작: 대상 슬롯이 OPEN 이 아니면 슬롯 경합(409)으로 응답해 실패 플로우를 검증할 수 있게 한다.
  http.post(
    `${BASE}/admin/feedback/:feedbackId/slot/:feedbackSlotId`,
    ({ params }) => {
      const feedbackId = Number(params.feedbackId);
      const feedbackSlotId = Number(params.feedbackSlotId);

      const feedback = seedFeedbacks.find(
        (item) => item.vo.feedbackId === feedbackId,
      );
      if (!feedback) {
        return HttpResponse.json(
          { message: 'feedback not found' },
          { status: 404 },
        );
      }

      const slots = seedSlotsByMentorId[feedback.mentorId] ?? [];
      const target = slots.find((s) => s.feedbackSlotId === feedbackSlotId);

      if (!target) {
        return HttpResponse.json(
          { message: 'slot not found' },
          { status: 404 },
        );
      }
      if (target.status !== 'OPEN') {
        // 다른 곳에서 먼저 예약됨 — 슬롯 경합
        return HttpResponse.json(
          { message: '이미 예약된 시간대입니다.' },
          { status: 409 },
        );
      }

      // 성공: BE 는 SuccessResponse<null> 반환. (목 상태는 무변경 — invalidate 후 재조회로 충분)
      return HttpResponse.json({ data: null });
    },
  ),
];
