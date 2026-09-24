import { feedbackDetailSchema, feedbackStatusSchema } from './feedbackSchema';

describe('feedbackStatusSchema', () => {
  /*
    서버 FeedbackStatus 는 RESERVED·COMPLETED·CANCELED 세 값이다. CANCELED 가 빠져
    있으면 취소된 세션의 상세 파싱이 통째로 던져 입장 화면이 "일정 확인 중" 에서
    멈춘다. 멘토·어드민 앱 스키마에는 이미 세 값이 다 있다.
  */
  it('서버 enum 세 값을 모두 받는다', () => {
    expect(feedbackStatusSchema.parse('RESERVED')).toBe('RESERVED');
    expect(feedbackStatusSchema.parse('COMPLETED')).toBe('COMPLETED');
    expect(feedbackStatusSchema.parse('CANCELED')).toBe('CANCELED');
  });

  it('서버에 없는 값은 거른다', () => {
    expect(() => feedbackStatusSchema.parse('OPEN')).toThrow();
  });
});

describe('feedbackDetailSchema', () => {
  it('취소된 세션의 상세를 파싱한다', () => {
    const parsed = feedbackDetailSchema.parse({
      feedbackInfo: {
        feedbackId: 1,
        startDate: '2026-06-13T10:00:00+09:00',
        endDate: '2026-06-13T11:00:00+09:00',
        meetingUrl: null,
        status: 'CANCELED',
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
        score: null,
        review: null,
      },
    });
    expect(parsed.feedbackInfo.status).toBe('CANCELED');
  });

  it('미제출 상태(attendanceStatus)를 읽는다', () => {
    const parsed = feedbackDetailSchema.parse({
      feedbackInfo: {
        feedbackId: 1,
        startDate: '2026-06-13T10:00:00+09:00',
        endDate: '2026-06-13T11:00:00+09:00',
        meetingUrl: null,
        status: 'RESERVED',
        mentorStatus: 'PENDING',
        menteeStatus: 'PENDING',
        score: null,
        review: null,
        attendanceStatus: 'ABSENT',
      },
    });
    expect(parsed.feedbackInfo.attendanceStatus).toBe('ABSENT');
  });
});
