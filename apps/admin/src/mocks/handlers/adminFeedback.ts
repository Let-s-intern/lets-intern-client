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

  // 예약 일정 변경 — 기존 예약(feedbackId)을 다른 슬롯(feedbackSlotId)으로 이동.
  // BE 는 path 파라미터만 받는다. 목은 seed 를 in-memory 로 갱신해 변경 결과를 반영한다.
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
      const newSlot = slots.find((s) => s.feedbackSlotId === feedbackSlotId);
      if (!newSlot) {
        return HttpResponse.json(
          { message: 'slot not found' },
          { status: 404 },
        );
      }

      // 기존 예약 시간대를 점유하던 슬롯 → OPEN 으로 전환(다른 멘티가 예약 가능).
      const oldSlot = slots.find(
        (s) =>
          s.startDate === feedback.vo.startDate &&
          s.endDate === feedback.vo.endDate,
      );
      if (oldSlot) oldSlot.status = 'OPEN';
      newSlot.status = 'RESERVED';

      // 예약 일시 갱신 → 목록·상세 GET 이 변경된 일시를 반영.
      feedback.vo.startDate = newSlot.startDate;
      feedback.vo.endDate = newSlot.endDate;
      feedback.detail.startDate = newSlot.startDate;
      feedback.detail.endDate = newSlot.endDate;

      return HttpResponse.json({ data: {} });
    },
  ),

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
];
