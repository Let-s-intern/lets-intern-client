import { describe, expect, it } from 'vitest';

import {
  createFeedbackSlotRequestSchema,
  feedbackSchema,
  feedbackSlotSchema,
  feedbackSlotStatusSchema,
  feedbackStatusSchema,
  getFeedbackDetailResponseSchema,
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

  describe('feedbackStatusSchema', () => {
    it('RESERVED / COMPLETED / CANCELED 만 허용한다', () => {
      expect(feedbackStatusSchema.parse('RESERVED')).toBe('RESERVED');
      expect(feedbackStatusSchema.parse('COMPLETED')).toBe('COMPLETED');
      expect(feedbackStatusSchema.parse('CANCELED')).toBe('CANCELED');
      expect(() => feedbackStatusSchema.parse('OPEN')).toThrow();
    });
  });

  describe('feedbackSchema', () => {
    it('meetingUrl 이 null 인 응답도 파싱한다', () => {
      const parsed = feedbackSchema.parse({
        feedbackId: 42,
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        meetingUrl: null,
        status: 'RESERVED',
      });
      expect(parsed.feedbackId).toBe(42);
      expect(parsed.meetingUrl).toBeNull();
      expect(parsed.status).toBe('RESERVED');
    });

    it('meetingUrl 이 문자열인 응답도 파싱한다', () => {
      const parsed = feedbackSchema.parse({
        feedbackId: 1,
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        meetingUrl: 'https://zep.us/play/abcd',
        status: 'COMPLETED',
      });
      expect(parsed.meetingUrl).toBe('https://zep.us/play/abcd');
    });
  });

  describe('getFeedbackDetailResponseSchema', () => {
    it('feedbackInfo 래퍼를 파싱한다', () => {
      const parsed = getFeedbackDetailResponseSchema.parse({
        feedbackInfo: {
          feedbackId: 7,
          startDate: '2026-05-20T11:00:00',
          endDate: '2026-05-20T11:30:00',
          meetingUrl: null,
          status: 'RESERVED',
        },
      });
      expect(parsed.feedbackInfo.feedbackId).toBe(7);
    });

    it('feedbackInfo 가 없으면 실패한다', () => {
      expect(() => getFeedbackDetailResponseSchema.parse({})).toThrow();
    });
  });
});
