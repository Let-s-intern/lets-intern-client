import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  liveMentoringReservationDetailSchema,
  liveMentoringReservationListSchema,
} from '../liveMentoringSchema';

/**
 * 공유 MSW 핸들러가 `GET /mentor/live-mentoring/reservations/{applicationId}` 를
 * 계약대로 처리하는지 검증한다.
 *
 * 로컬 DB 에는 `FILE` 첨부도 동의 미체크 건도 없다. 목이 유일한 검증 수단이라
 * PRD 4.7 의 다섯 경우가 실제로 응답에 있는지를 여기서 못박는다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fetchDetail = async (applicationId: number) => {
  const res = await fetch(
    `${BASE}/mentor/live-mentoring/reservations/${applicationId}`,
  );
  const body = await res.json();
  return { status: res.status, body };
};

const parseDetail = async (applicationId: number) => {
  const { body } = await fetchDetail(applicationId);
  return liveMentoringReservationDetailSchema.parse(body.data);
};

describe('멘토 1대1 예약 상세 MSW 핸들러', () => {
  it('질문 있음 + 노션 URL 첨부 + 동의함', async () => {
    const detail = await parseDetail(91001);

    expect(detail.questionDeferred).toBe(false);
    expect(detail.questionContent).not.toBeNull();
    expect(detail.attachmentType).toBe('URL');
    expect(detail.mentorShareAgreed).toBe(true);
    expect(detail.attachmentUrl).toContain('notion.so');
  });

  it('질문 있음 + 노션이 아닌 URL 첨부 + 동의함', async () => {
    const detail = await parseDetail(91004);

    expect(detail.attachmentType).toBe('URL');
    expect(detail.mentorShareAgreed).toBe(true);
    expect(detail.attachmentUrl).not.toBeNull();
    expect(detail.attachmentUrl).not.toContain('notion.so');
  });

  it('질문 있음 + 파일 첨부 + 동의함 — 파일명·주소는 응답에 없다', async () => {
    const { body } = await fetchDetail(91005);
    const detail = liveMentoringReservationDetailSchema.parse(body.data);

    expect(detail.attachmentType).toBe('FILE');
    expect(detail.mentorShareAgreed).toBe(true);
    expect(detail.attachmentUrl).toBeNull();
    expect(body.data).not.toHaveProperty('attachmentFileName');
    expect(body.data).not.toHaveProperty('attachmentFileUrl');
  });

  it('질문 있음 + URL 첨부 + 동의 안 함 — 주소가 응답 본문에서 비워져 온다', async () => {
    const { body } = await fetchDetail(91006);
    const detail = liveMentoringReservationDetailSchema.parse(body.data);

    expect(detail.attachmentType).toBe('URL');
    expect(detail.mentorShareAgreed).toBe(false);
    expect(detail.attachmentUrl).toBeNull();
    expect(JSON.stringify(body)).not.toContain('http');
  });

  it('나중에 작성하기 + 첨부 없음', async () => {
    const detail = await parseDetail(91003);

    expect(detail.questionDeferred).toBe(true);
    expect(detail.questionContent).toBeNull();
    expect(detail.attachmentType).toBe('NONE');
    expect(detail.attachmentUrl).toBeNull();
  });

  it('questionUpdatedAt 을 내리지 않는다 — 백엔드 계약과 같다', async () => {
    const { body } = await fetchDetail(91001);
    expect(body.data).not.toHaveProperty('questionUpdatedAt');
  });

  it('예약 정보는 목록과 같은 값이다', async () => {
    const listRes = await fetch(`${BASE}/mentor/live-mentoring/reservations`);
    const { data } = await listRes.json();
    const list = liveMentoringReservationListSchema.parse(data).reservationList;
    const row = list.find((r) => r.applicationId === 91001);
    const detail = await parseDetail(91001);

    expect(detail.menteeName).toBe(row?.menteeName);
    expect(detail.reservationStartAt).toBe(row?.reservationStartAt);
    expect(detail.reservationEndAt).toBe(row?.reservationEndAt);
    expect(detail.durationMinutes).toBe(row?.durationMinutes);
  });

  it('목록의 모든 건에 상세가 있다', async () => {
    const listRes = await fetch(`${BASE}/mentor/live-mentoring/reservations`);
    const { data } = await listRes.json();
    const list = liveMentoringReservationListSchema.parse(data).reservationList;

    for (const row of list) {
      const { status } = await fetchDetail(row.applicationId);
      expect(status).toBe(200);
    }
  });

  it('없는 applicationId 는 404 다', async () => {
    const { status, body } = await fetchDetail(99999);

    expect(status).toBe(404);
    expect(body.code).toBe('LIVE_MENTORING_NOT_FOUND');
  });

  it('목록 경로는 상세 핸들러에 가려지지 않는다', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/reservations`);
    const { data } = await res.json();

    expect(res.status).toBe(200);
    expect(
      liveMentoringReservationListSchema.parse(data).reservationList.length,
    ).toBeGreaterThan(0);
  });
});
