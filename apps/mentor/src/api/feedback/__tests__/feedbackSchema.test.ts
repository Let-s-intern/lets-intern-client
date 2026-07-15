import { describe, expect, it } from 'vitest';

import {
  attendanceStatusSchema,
  createFeedbackSlotRequestSchema,
  feedbackAttendanceStatusSchema,
  feedbackDetailMentorSchema,
  feedbackMentorSchema,
  feedbackSchema,
  feedbackSlotSchema,
  feedbackSlotStatusSchema,
  feedbackStatusSchema,
  getFeedbackDetailResponseSchema,
  getMentorFeedbackDetailResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
  getMentorFeedbacksResponseSchema,
  updateFeedbackByMentorRequestSchema,
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
      expect(() => getMentorFeedbackSlotsResponseSchema.parse({})).toThrow();
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

  describe('attendanceStatusSchema', () => {
    it('PRESENT / UPDATED / LATE / ABSENT 만 허용한다', () => {
      expect(attendanceStatusSchema.parse('PRESENT')).toBe('PRESENT');
      expect(attendanceStatusSchema.parse('UPDATED')).toBe('UPDATED');
      expect(attendanceStatusSchema.parse('LATE')).toBe('LATE');
      expect(attendanceStatusSchema.parse('ABSENT')).toBe('ABSENT');
      expect(() => attendanceStatusSchema.parse('PENDING')).toThrow();
    });
  });

  describe('feedbackAttendanceStatusSchema', () => {
    it('PENDING / PRESENT / ABSENT 만 허용한다', () => {
      expect(feedbackAttendanceStatusSchema.parse('PENDING')).toBe('PENDING');
      expect(feedbackAttendanceStatusSchema.parse('PRESENT')).toBe('PRESENT');
      expect(feedbackAttendanceStatusSchema.parse('ABSENT')).toBe('ABSENT');
      expect(() => feedbackAttendanceStatusSchema.parse('UPDATED')).toThrow();
    });
  });

  describe('feedbackMentorSchema', () => {
    it('멘토 목록 item 을 파싱한다', () => {
      const parsed = feedbackMentorSchema.parse({
        feedbackId: 1,
        startDate: '2026-05-20T10:00:00',
        endDate: '2026-05-20T10:30:00',
        meetingUrl: null,
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
        status: 'RESERVED',
        programTitle: '자소서 챌린지 7기',
        menteeName: '이지수',
      });
      expect(parsed.menteeName).toBe('이지수');
      expect(parsed.menteeStatus).toBe('PENDING');
      expect(parsed.status).toBe('RESERVED');
    });

    it('필수 필드(menteeName)가 빠지면 실패한다', () => {
      expect(() =>
        feedbackMentorSchema.parse({
          feedbackId: 1,
          startDate: '2026-05-20T10:00:00',
          endDate: '2026-05-20T10:30:00',
          meetingUrl: null,
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
          status: 'RESERVED',
          programTitle: '자소서 챌린지 7기',
        }),
      ).toThrow();
    });
  });

  describe('getMentorFeedbacksResponseSchema', () => {
    it('빈 feedbackList 를 허용한다', () => {
      const parsed = getMentorFeedbacksResponseSchema.parse({
        feedbackList: [],
      });
      expect(parsed.feedbackList).toEqual([]);
    });

    it('feedbackList 필드가 없으면 실패한다', () => {
      expect(() => getMentorFeedbacksResponseSchema.parse({})).toThrow();
    });
  });

  describe('feedbackDetailMentorSchema', () => {
    it('멘토 상세(희망정보·attendanceUrl·사전질문)를 파싱한다', () => {
      const parsed = feedbackDetailMentorSchema.parse({
        feedbackId: 7,
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        meetingUrl: null,
        status: 'RESERVED',
        programTitle: '자소서 챌린지 7기',
        attendanceUrl: 'https://example.com/submission/7',
        attendanceStatus: 'PRESENT',
        menteeName: '이지수',
        menteeWishField: '기획 / PM / PO',
        menteeWishIndustry: 'IT · 플랫폼',
        menteeWishCompany: 'Toss',
        preQuestion: '자기소개서 피드백을 받고 싶습니다.',
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
      });
      expect(parsed.attendanceUrl).toBe('https://example.com/submission/7');
      expect(parsed.attendanceStatus).toBe('PRESENT');
      expect(parsed.menteeWishCompany).toBe('Toss');
    });

    it('nullable 희망정보/사전질문이 null 이어도 파싱한다', () => {
      const parsed = feedbackDetailMentorSchema.parse({
        feedbackId: 8,
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        meetingUrl: null,
        status: 'RESERVED',
        programTitle: '자소서 챌린지 7기',
        attendanceUrl: '',
        attendanceStatus: 'ABSENT',
        menteeName: '이지수',
        menteeWishField: null,
        menteeWishIndustry: null,
        menteeWishCompany: null,
        preQuestion: null,
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
      });
      expect(parsed.menteeWishField).toBeNull();
      expect(parsed.preQuestion).toBeNull();
    });

    it('missionStartDate/EndDate 가 없어도 파싱한다 (forward-compatible, BE 미반영)', () => {
      const parsed = feedbackDetailMentorSchema.parse({
        feedbackId: 10,
        startDate: '2026-05-20T11:00:00',
        endDate: '2026-05-20T11:30:00',
        meetingUrl: null,
        status: 'RESERVED',
        programTitle: '자소서 챌린지 7기',
        attendanceUrl: '',
        attendanceStatus: 'PRESENT',
        menteeName: '이지수',
        menteeWishField: null,
        menteeWishIndustry: null,
        menteeWishCompany: null,
        preQuestion: null,
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
      });
      expect(parsed.missionStartDate).toBeUndefined();
      expect(parsed.missionEndDate).toBeUndefined();
    });

    it('missionStartDate/EndDate 가 채워진 응답도 파싱한다 (BE 반영 후)', () => {
      const parsed = feedbackDetailMentorSchema.parse({
        feedbackId: 11,
        startDate: '2026-07-10T10:00:00',
        endDate: '2026-07-10T10:30:00',
        meetingUrl: null,
        status: 'RESERVED',
        programTitle: '기필코 경험정리 챌린지 21기',
        attendanceUrl: '',
        attendanceStatus: 'PRESENT',
        menteeName: '이지수',
        menteeWishField: null,
        menteeWishIndustry: null,
        menteeWishCompany: null,
        preQuestion: null,
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
        missionStartDate: '2026-07-12T00:00:00',
        missionEndDate: '2026-07-15T23:59:59',
      });
      expect(parsed.missionStartDate).toBe('2026-07-12T00:00:00');
      expect(parsed.missionEndDate).toBe('2026-07-15T23:59:59');
    });

    it('missionStartDate/EndDate 가 null 이어도 파싱한다 (미션 없는 라이브)', () => {
      const parsed = feedbackDetailMentorSchema.parse({
        feedbackId: 12,
        startDate: '2026-07-10T10:00:00',
        endDate: '2026-07-10T10:30:00',
        meetingUrl: null,
        status: 'RESERVED',
        programTitle: '자소서 챌린지 7기',
        attendanceUrl: '',
        attendanceStatus: 'ABSENT',
        menteeName: '이지수',
        menteeWishField: null,
        menteeWishIndustry: null,
        menteeWishCompany: null,
        preQuestion: null,
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
        missionStartDate: null,
        missionEndDate: null,
      });
      expect(parsed.missionStartDate).toBeNull();
      expect(parsed.missionEndDate).toBeNull();
    });

    it('attendanceStatus 가 라이브 enum 값이면 실패한다', () => {
      expect(() =>
        feedbackDetailMentorSchema.parse({
          feedbackId: 9,
          startDate: '2026-05-20T11:00:00',
          endDate: '2026-05-20T11:30:00',
          meetingUrl: null,
          status: 'RESERVED',
          programTitle: '자소서 챌린지 7기',
          attendanceUrl: '',
          attendanceStatus: 'PENDING',
          menteeName: '이지수',
          menteeWishField: null,
          menteeWishIndustry: null,
          menteeWishCompany: null,
          preQuestion: null,
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
        }),
      ).toThrow();
    });
  });

  describe('getMentorFeedbackDetailResponseSchema', () => {
    it('feedbackInfo 래퍼를 파싱한다', () => {
      const parsed = getMentorFeedbackDetailResponseSchema.parse({
        feedbackInfo: {
          feedbackId: 7,
          startDate: '2026-05-20T11:00:00',
          endDate: '2026-05-20T11:30:00',
          meetingUrl: null,
          status: 'RESERVED',
          programTitle: '자소서 챌린지 7기',
          attendanceUrl: '',
          attendanceStatus: 'ABSENT',
          menteeName: '이지수',
          menteeWishField: null,
          menteeWishIndustry: null,
          menteeWishCompany: null,
          preQuestion: null,
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
        },
      });
      expect(parsed.feedbackInfo.feedbackId).toBe(7);
    });
  });

  describe('updateFeedbackByMentorRequestSchema', () => {
    it('menteeStatus 만 허용한다', () => {
      const parsed = updateFeedbackByMentorRequestSchema.parse({
        menteeStatus: 'PRESENT',
      });
      expect(parsed.menteeStatus).toBe('PRESENT');
    });

    it('menteeStatus 가 없으면 실패한다', () => {
      expect(() => updateFeedbackByMentorRequestSchema.parse({})).toThrow();
    });
  });
});
