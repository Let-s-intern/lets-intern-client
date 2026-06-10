import { describe, expect, it } from 'vitest';

import {
  feedbackAdminVoSchema,
  feedbackDetailAdminVoSchema,
  feedbackSlotVoSchema,
  getAdminFeedbackDetailResponseSchema,
  getAdminFeedbacksResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
} from './feedbackSchema';

describe('feedbackAdminVoSchema', () => {
  it('정상 예약 행을 파싱한다', () => {
    const data = {
      feedbackId: 1,
      programTitle: '면접 준비 챌린지 2기',
      mentorId: 101,
      mentorName: '쥬디',
      menteeName: '홍길동',
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      createDate: '2026-05-20T10:00:00',
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
      status: 'RESERVED',
    };
    const result = feedbackAdminVoSchema.parse(data);
    expect(result.feedbackId).toBe(1);
    expect(result.status).toBe('RESERVED');
  });

  it('programTitle 누락 시 빈 문자열로 기본값 처리한다', () => {
    const data = {
      feedbackId: 2,
      mentorId: 101,
      mentorName: '쥬디',
      menteeName: '김철수',
      startDate: '2026-06-02T18:00:00',
      endDate: '2026-06-02T18:30:00',
      createDate: '2026-05-21T09:00:00',
      mentorStatus: 'PRESENT',
      menteeStatus: 'ABSENT',
      status: 'COMPLETED',
    };
    const result = feedbackAdminVoSchema.parse(data);
    expect(result.programTitle).toBe('');
  });

  it('잘못된 status 는 거부한다', () => {
    const data = {
      feedbackId: 3,
      programTitle: '',
      mentorName: '쥬디',
      menteeName: '이영희',
      startDate: '2026-06-03T17:00:00',
      endDate: '2026-06-03T17:30:00',
      createDate: '2026-05-22T11:00:00',
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
      status: 'UNKNOWN',
    };
    expect(() => feedbackAdminVoSchema.parse(data)).toThrow();
  });
});

describe('getAdminFeedbacksResponseSchema', () => {
  it('feedbackList 배열을 파싱한다', () => {
    const result = getAdminFeedbacksResponseSchema.parse({
      feedbackList: [
        {
          feedbackId: 1,
          programTitle: '챌린지',
          mentorId: 101,
          mentorName: '멘토',
          menteeName: '멘티',
          startDate: '2026-06-01T17:00:00',
          endDate: '2026-06-01T17:30:00',
          createDate: '2026-05-20T10:00:00',
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
          status: 'RESERVED',
        },
      ],
    });
    expect(result.feedbackList).toHaveLength(1);
  });

  it('빈 목록도 파싱한다', () => {
    const result = getAdminFeedbacksResponseSchema.parse({ feedbackList: [] });
    expect(result.feedbackList).toHaveLength(0);
  });
});

describe('feedbackDetailAdminVoSchema', () => {
  it('nullable 필드가 null 이어도 파싱한다', () => {
    const data = {
      feedbackId: 10,
      programTitle: '자기소개서 1주 완성 챌린지 27기',
      mentorName: '쥬디',
      mentorEmail: null,
      menteeName: '홍길동',
      menteeEmail: null,
      menteePhoneNum: null,
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      createDate: '2026-05-20T10:00:00',
      preQuestion: null,
      meetingUrl: null,
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
    };
    const result = getAdminFeedbackDetailResponseSchema.parse({
      feedbackInfo: data,
    });
    expect(result.feedbackInfo.mentorEmail).toBeNull();
    expect(result.feedbackInfo.meetingUrl).toBeNull();
  });

  it('값이 채워진 상세도 파싱한다', () => {
    const result = feedbackDetailAdminVoSchema.parse({
      feedbackId: 11,
      programTitle: '챌린지',
      mentorName: '쥬디',
      mentorEmail: 'mentor@test.com',
      menteeName: '홍길동',
      menteeEmail: 'mentee@test.com',
      menteePhoneNum: '01012345678',
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      createDate: '2026-05-20T10:00:00',
      preQuestion: '면접 팁이 궁금합니다',
      meetingUrl: 'https://meet.example.com/abc',
      mentorStatus: 'PRESENT',
      menteeStatus: 'PRESENT',
    });
    expect(result.preQuestion).toBe('면접 팁이 궁금합니다');
  });
});

describe('feedbackSlotVoSchema', () => {
  it('OPEN/RESERVED 슬롯을 파싱한다', () => {
    const result = getMentorFeedbackSlotsResponseSchema.parse({
      feedbackSlotList: [
        {
          feedbackSlotId: 1,
          startDate: '2026-06-01T17:00:00',
          endDate: '2026-06-01T17:30:00',
          status: 'OPEN',
        },
        {
          feedbackSlotId: 2,
          startDate: '2026-06-01T18:00:00',
          endDate: '2026-06-01T18:30:00',
          status: 'RESERVED',
        },
      ],
    });
    expect(result.feedbackSlotList).toHaveLength(2);
    expect(result.feedbackSlotList[1].status).toBe('RESERVED');
  });

  it('잘못된 슬롯 상태는 거부한다', () => {
    expect(() =>
      feedbackSlotVoSchema.parse({
        feedbackSlotId: 3,
        startDate: '2026-06-01T17:00:00',
        endDate: '2026-06-01T17:30:00',
        status: 'CLOSED',
      }),
    ).toThrow();
  });
});
