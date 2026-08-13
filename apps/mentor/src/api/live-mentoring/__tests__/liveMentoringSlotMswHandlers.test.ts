import { resetLiveMentoringMockState } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * LC-3206 슬롯 계약을 목 핸들러 수준에서 검증한다.
 *
 * 저장은 전체 치환이고, 삭제 대상에 `RESERVED` 가 하나라도 있으면 저장 전체가 실패한다.
 * 이 규칙을 목이 재현하지 않으면 "테스트는 통과하는데 실서버에서만 409" 가 된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  resetLiveMentoringMockState();
});
afterAll(() => server.close());

type Slot = {
  slotId: number;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'RESERVED';
};

/** 오늘 기준 상대 시각을 `LocalDateTime` 문자열로 만든다. */
const dateTimeFromToday = (
  offsetDays: number,
  hour: number,
  minute: number,
): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, minute, 0, 0);
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
};

const getMySlots = async (query = ''): Promise<Slot[]> => {
  const res = await fetch(`${BASE}/mentor/live-mentoring/slots${query}`);
  const { data } = await res.json();
  return data.liveMentoringSlotList;
};

const putMySlots = (slots: { startDate: string; endDate: string }[]) =>
  fetch(`${BASE}/mentor/live-mentoring/slots`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slots),
  });

/** 현재 슬롯 전체를 저장 payload 형태로 바꾼다. */
const asPayload = (slots: Slot[]) =>
  slots.map(({ startDate, endDate }) => ({ startDate, endDate }));

/** 저장 payload 에 담을 수 있는 슬롯(미래) 만 추린다. */
const futureOnly = (slots: Slot[]) => {
  const now = new Date().toISOString().slice(0, 19);
  return slots.filter((slot) => slot.startDate > now);
};

describe('GET /mentor/live-mentoring/slots', () => {
  it('시작 시각 오름차순으로 내려준다', async () => {
    const slots = await getMySlots();
    expect(slots.length).toBeGreaterThan(0);
    const sorted = [...slots].sort((a, b) =>
      a.startDate.localeCompare(b.startDate),
    );
    expect(slots).toEqual(sorted);
  });

  it('statusList 로 상태를 거른다', async () => {
    const reserved = await getMySlots('?statusList=RESERVED');
    expect(reserved.length).toBeGreaterThan(0);
    expect(reserved.every((slot) => slot.status === 'RESERVED')).toBe(true);
  });

  it('startDate·endDate 로 기간을 거른다', async () => {
    const from = dateTimeFromToday(8, 0, 0);
    const filtered = await getMySlots(`?startDate=${from}`);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((slot) => slot.startDate >= from)).toBe(true);

    const to = dateTimeFromToday(0, 0, 0);
    const past = await getMySlots(`?endDate=${to}`);
    expect(past.every((slot) => slot.startDate <= to)).toBe(true);
  });
});

describe('PUT /mentor/live-mentoring/slots — 전체 치환', () => {
  it('예약된 슬롯을 payload 에 포함하면 저장되고 slotId·상태가 유지된다', async () => {
    const before = futureOnly(await getMySlots());
    const added = {
      startDate: dateTimeFromToday(9, 15, 0),
      endDate: dateTimeFromToday(9, 15, 30),
    };

    const res = await putMySlots([...asPayload(before), added]);
    expect(res.status).toBe(200);

    const after = await getMySlots();
    expect(after).toHaveLength(before.length + 1);

    const reservedBefore = before.filter((slot) => slot.status === 'RESERVED');
    for (const slot of reservedBefore) {
      const kept = after.find((each) => each.startDate === slot.startDate);
      expect(kept?.slotId).toBe(slot.slotId);
      expect(kept?.status).toBe('RESERVED');
    }
    expect(
      after.find((slot) => slot.startDate === added.startDate)?.status,
    ).toBe('OPEN');
  });

  it('예약된 슬롯이 payload 에서 빠지면 409 LIVE_MENTORING_SLOT_LOCKED 로 전체 실패', async () => {
    const before = await getMySlots();
    const withoutReserved = futureOnly(before).filter(
      (slot) => slot.status !== 'RESERVED',
    );
    expect(withoutReserved.length).toBeLessThan(futureOnly(before).length);

    const res = await putMySlots(asPayload(withoutReserved));
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_SLOT_LOCKED');

    // 전체 실패다 — 요청에 남아 있던 OPEN 슬롯도 지워지지 않아야 한다.
    const after = await getMySlots();
    expect(after).toEqual(before);
  });

  it('같은 시작 시각이 겹치면 409 LIVE_MENTORING_SLOT_CONFLICT', async () => {
    const duplicated = {
      startDate: dateTimeFromToday(9, 16, 0),
      endDate: dateTimeFromToday(9, 16, 30),
    };
    const before = futureOnly(await getMySlots());

    const res = await putMySlots([
      ...asPayload(before),
      duplicated,
      duplicated,
    ]);
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_SLOT_CONFLICT');
  });

  it('30분 단위·길이·미래 조건을 어기면 400 LIVE_MENTORING_INVALID_SLOT_TIME', async () => {
    const cases = [
      // 분이 00·30 이 아니다
      {
        startDate: dateTimeFromToday(9, 10, 15),
        endDate: dateTimeFromToday(9, 10, 45),
      },
      // 길이가 30분이 아니다
      {
        startDate: dateTimeFromToday(9, 10, 0),
        endDate: dateTimeFromToday(9, 11, 0),
      },
      // 과거 시각이다
      {
        startDate: dateTimeFromToday(-1, 10, 0),
        endDate: dateTimeFromToday(-1, 10, 30),
      },
    ];

    for (const invalid of cases) {
      const res = await putMySlots([invalid]);
      expect(res.status).toBe(400);
      expect((await res.json()).code).toBe('LIVE_MENTORING_INVALID_SLOT_TIME');
    }
  });
});

describe('GET /live-mentoring/mentors/:mentorId/slots — 공개 조회', () => {
  const openOnce = () =>
    fetch(`${BASE}/mentor/live-mentoring/openings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '자소서 실전 첨삭 멘토링',
        categories: ['PERSONAL_STATEMENT'],
        durations: [30],
      }),
    });

  const publicSlots = async (mentorId: number): Promise<Slot[]> => {
    const res = await fetch(`${BASE}/live-mentoring/mentors/${mentorId}/slots`);
    const { data } = await res.json();
    return data.liveMentoringSlotList;
  };

  it('활성 개설이 있으면 미래의 OPEN 슬롯만 내려준다', async () => {
    await openOnce();
    const slots = await publicSlots(1);
    const now = new Date().toISOString().slice(0, 19);

    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((slot) => slot.status === 'OPEN')).toBe(true);
    expect(slots.every((slot) => slot.startDate > now)).toBe(true);
  });

  it('활성 개설이 없으면 빈 배열이다', async () => {
    // 목 기본 상태는 DRAFT — 활성 개설이 없다.
    expect(await publicSlots(1)).toEqual([]);
  });

  it('개설을 종료하면 슬롯이 전부 삭제된다', async () => {
    const opened = await openOnce().then((r) => r.json());
    const openingId = opened.data.openings.find(
      (o: { status: string }) => o.status === 'OPEN',
    ).openingId;
    expect((await publicSlots(1)).length).toBeGreaterThan(0);

    await fetch(`${BASE}/mentor/live-mentoring/openings/${openingId}/close`, {
      method: 'PATCH',
    });

    expect(await publicSlots(1)).toEqual([]);
    expect(await getMySlots()).toEqual([]);
  });
});
