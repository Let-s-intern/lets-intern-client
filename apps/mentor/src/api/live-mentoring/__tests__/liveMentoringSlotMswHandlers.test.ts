import { resetLiveMentoringMockState } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 1대1 슬롯 계약을 목 핸들러 수준에서 검증한다.
 *
 * 멘토용 슬롯 조회·저장(`GET`/`PUT /mentor/live-mentoring/slots`)은 사라졌다. 슬롯은
 * 챌린지 라이브 피드백과 같은 `/feedback/mentor/slot` 한 벌로 합쳐졌고, 여기 남은 것은
 * 고객에게 예약 가능 시간을 주는 공개 조회뿐이다.
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

  it('개설을 종료해도 슬롯은 남고, 다시 열면 그대로 돌아온다', async () => {
    /*
     * 회귀 케이스 — 종료가 슬롯을 지우던 시절의 동작이 남아 있으면, 1대1 오픈을
     * 닫는 행위가 그 멘토의 챌린지 가용시간까지 지운다.
     */
    const opened = await openOnce().then((r) => r.json());
    const openingId = opened.data.openings.find(
      (o: { status: string }) => o.status === 'OPEN',
    ).openingId;
    const before = await publicSlots(1);
    expect(before.length).toBeGreaterThan(0);

    await fetch(`${BASE}/mentor/live-mentoring/openings/${openingId}/close`, {
      method: 'PATCH',
    });

    // 활성 개설이 없으므로 고객에게는 보이지 않는다. 삭제된 것이 아니다.
    expect(await publicSlots(1)).toEqual([]);

    await openOnce();
    expect(await publicSlots(1)).toEqual(before);
  });
});

describe('멘토용 1대1 슬롯 엔드포인트 제거', () => {
  it('GET·PUT /mentor/live-mentoring/slots 를 목이 더 이상 처리하지 않는다', async () => {
    /*
     * 목이 사라진 엔드포인트를 계속 응답하면 "테스트는 통과하는데 실서버는 404" 가
     * 된다. `onUnhandledRequest: 'bypass'` 라 처리기가 없으면 실제 네트워크로 나가
     * 실패한다 — 그 실패가 곧 핸들러가 없다는 증거다.
     */
    await expect(
      fetch(`${BASE}/mentor/live-mentoring/slots`),
    ).rejects.toBeDefined();
  });
});
