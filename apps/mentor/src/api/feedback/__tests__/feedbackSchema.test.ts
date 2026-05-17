import { describe, expect, it } from 'vitest';

import {
  createFeedbackSlotRequestSchema,
  feedbackSlotSchema,
  feedbackSlotStatusSchema,
  getMentorFeedbackSlotsResponseSchema,
} from '../feedbackSchema';

describe('feedbackSchema', () => {
  describe('feedbackSlotStatusSchema', () => {
    it('OPEN / RESERVED 만 허용한다', () => {
      expect(feedbackSlotStatusSchema.parse('OPEN')).toBe('OPEN');
      expect(feedbackSlotStatusSchema.parse('RESERVED')).toBe('RESERVED');
      expect(() => feedbackSlotStatusSchema.parse('CANCELED')).toThrow();
    });
  });

  describe('feedbackSlotSchema', () => {
    it('BE FeedbackSlotVo 모양을 그대로 파싱한다', () => {
      const parsed = feedbackSlotSchema.parse({
        feedbackSlotId: 1,
        startDate: '2026-05-20T10:00:00',
        endDate: '2026-05-20T10:30:00',
        status: 'OPEN',
      });
      expect(parsed.feedbackSlotId).toBe(1);
      expect(parsed.status).toBe('OPEN');
    });

    it('feedbackSlotId 가 number 가 아니면 실패한다', () => {
      expect(() =>
        feedbackSlotSchema.parse({
          feedbackSlotId: '1',
          startDate: '2026-05-20T10:00:00',
          endDate: '2026-05-20T10:30:00',
          status: 'OPEN',
        }),
      ).toThrow();
    });
  });

  describe('getMentorFeedbackSlotsResponseSchema', () => {
    it('빈 배열을 허용한다', () => {
      const parsed = getMentorFeedbackSlotsResponseSchema.parse({
        feedbackSlotList: [],
      });
      expect(parsed.feedbackSlotList).toEqual([]);
    });

    it('다건 슬롯을 파싱한다', () => {
      const parsed = getMentorFeedbackSlotsResponseSchema.parse({
        feedbackSlotList: [
          {
            feedbackSlotId: 1,
            startDate: '2026-05-20T10:00:00',
            endDate: '2026-05-20T10:30:00',
            status: 'OPEN',
          },
          {
            feedbackSlotId: 2,
            startDate: '2026-05-20T11:00:00',
            endDate: '2026-05-20T11:30:00',
            status: 'RESERVED',
          },
        ],
      });
      expect(parsed.feedbackSlotList).toHaveLength(2);
      expect(parsed.feedbackSlotList[1].status).toBe('RESERVED');
    });

    it('feedbackSlotList 필드가 없으면 실패한다', () => {
      expect(() =>
        getMentorFeedbackSlotsResponseSchema.parse({}),
      ).toThrow();
    });
  });

  describe('createFeedbackSlotRequestSchema', () => {
    it('startDate / endDate 만 허용한다', () => {
      const parsed = createFeedbackSlotRequestSchema.parse({
        startDate: '2026-05-20T10:00:00',
        endDate: '2026-05-20T10:30:00',
      });
      expect(parsed.startDate).toBe('2026-05-20T10:00:00');
    });

    it('필수 필드가 빠지면 실패한다', () => {
      expect(() =>
        createFeedbackSlotRequestSchema.parse({
          startDate: '2026-05-20T10:00:00',
        }),
      ).toThrow();
    });
  });
});
