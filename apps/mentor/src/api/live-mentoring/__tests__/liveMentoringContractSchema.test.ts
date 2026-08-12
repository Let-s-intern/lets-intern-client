import { describe, expect, it } from 'vitest';

import * as liveMentoringSchema from '../liveMentoringSchema';
import {
  liveMentoringOpeningCreateSchema,
  liveMentoringSettingsSchema,
  liveMentoringSlotListSchema,
  liveMentoringSlotSaveRequestSchema,
  openingHistoryItemSchema,
} from '../liveMentoringSchema';

/**
 * LC-3206 계약 정리 — 모집 기간(`feedbackStartDate`/`feedbackEndDate`)이 응답에서 사라졌다.
 *
 * zod 의 `.nullable()` 은 `null` 만 허용하고 `undefined` 는 거부한다. 필드를 남겨 두면
 * 백엔드 배포와 동시에 파싱이 통째로 실패하므로, 필드가 없는 응답이 통과하는지 확인한다.
 */

const SETTINGS_RESPONSE = {
  liveMentoringId: 1,
  nickname: '자소서장인',
  profileImage: null,
  introduction: '한 줄 소개',
  careers: [],
  title: '자소서 실전 첨삭 멘토링',
  status: 'APPROVED',
  categories: ['RESUME'],
  durations: [30, 60],
};

const OPENING_HISTORY_ITEM = {
  openingId: 101,
  status: 'OPEN',
  durationPrices: [{ duration: 30, price: 35000 }],
  openedAt: '2026-09-01T10:00:00',
  closedAt: null,
  closeReason: null,
};

describe('멘토 라이브 멘토링 스키마 — 모집 기간 제거', () => {
  it('설정 응답에 기간 필드가 없어도 파싱된다', () => {
    const parsed = liveMentoringSettingsSchema.parse(SETTINGS_RESPONSE);
    expect(parsed.durations).toEqual([30, 60]);
    expect(parsed).not.toHaveProperty('feedbackStartDate');
    expect(parsed).not.toHaveProperty('feedbackEndDate');
  });

  it('서버가 새로 내려주는 필드(corpImage·description)는 버린다', () => {
    const parsed = liveMentoringSettingsSchema.parse({
      ...SETTINGS_RESPONSE,
      corpImage: 'https://example.test/corp.png',
      description: '회사 소개',
    });
    expect(parsed).not.toHaveProperty('corpImage');
    expect(parsed).not.toHaveProperty('description');
  });

  it('개설 이력 항목에 기간 필드가 없어도 파싱된다', () => {
    const parsed = openingHistoryItemSchema.parse(OPENING_HISTORY_ITEM);
    expect(parsed.openingId).toBe(101);
    expect(parsed).not.toHaveProperty('feedbackStartDate');
  });

  it('개설 요청 바디는 title·categories·durations 세 개뿐이다', () => {
    const parsed = liveMentoringOpeningCreateSchema.parse({
      title: '자소서 실전 첨삭 멘토링',
      categories: ['RESUME'],
      durations: [30],
      feedbackStartDate: '2026-09-01',
      feedbackEndDate: '2026-09-30',
    });
    expect(Object.keys(parsed).sort()).toEqual([
      'categories',
      'durations',
      'title',
    ]);
  });

  it('제출(submit) 스키마는 더 이상 존재하지 않는다', () => {
    // `POST /mentor/live-mentoring/submit` 이 컨트롤러에서 제거됐다.
    expect(liveMentoringSchema).not.toHaveProperty('liveMentoringSubmitSchema');
  });
});

describe('멘토 라이브 멘토링 슬롯 스키마', () => {
  it('서버 응답 예시를 그대로 파싱한다', () => {
    const parsed = liveMentoringSlotListSchema.parse({
      liveMentoringSlotList: [
        {
          slotId: 101,
          startDate: '2026-09-01T10:00:00',
          endDate: '2026-09-01T10:30:00',
          status: 'OPEN',
        },
        {
          slotId: 102,
          startDate: '2026-09-01T11:00:00',
          endDate: '2026-09-01T11:30:00',
          status: 'RESERVED',
        },
      ],
    });
    expect(parsed.liveMentoringSlotList).toHaveLength(2);
    expect(parsed.liveMentoringSlotList[1].status).toBe('RESERVED');
  });

  it('알 수 없는 status 는 거부한다', () => {
    expect(() =>
      liveMentoringSlotListSchema.parse({
        liveMentoringSlotList: [
          {
            slotId: 103,
            startDate: '2026-09-01T10:00:00',
            endDate: '2026-09-01T10:30:00',
            status: 'CLOSED',
          },
        ],
      }),
    ).toThrow();
  });

  it('저장 요청 바디는 래핑 객체가 아니라 배열 그 자체다', () => {
    const parsed = liveMentoringSlotSaveRequestSchema.parse([
      { startDate: '2026-09-01T10:00:00', endDate: '2026-09-01T10:30:00' },
    ]);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].startDate).toBe('2026-09-01T10:00:00');

    expect(() =>
      liveMentoringSlotSaveRequestSchema.parse({
        slots: [
          { startDate: '2026-09-01T10:00:00', endDate: '2026-09-01T10:30:00' },
        ],
      }),
    ).toThrow();
  });
});
