import { describe, expect, it } from 'vitest';

import {
  CreateReviewV2ReqSchema,
  LiveApplicantListSchema,
  LiveApplicationFormSchema,
  LiveContentSchema,
  LiveHistorySchema,
  LiveMentorContentSchema,
  LiveMentorPasswordSchema,
  LiveReviewListSchema,
  LiveThumbnailSchema,
  LiveTitleSchema,
  ReviewV2ItemSchema,
  ReviewV2ListSchema,
} from '../../schema';

/**
 * 본 테스트는 PRD-서면라이브 분리 Push 1 의 신규 Zod 스키마가
 * BE 응답을 안전하게 파싱하는지 확인한다. (safeParse 스모크 테스트)
 *
 * BE Swagger 응답 형태가 일부 미확정이라 보수적으로 .passthrough() 또는
 * z.unknown().optional() 로 정의되어 있다. 본 테스트는 대표 mock JSON 으로
 * 파싱이 성공/실패하는지 검증한다.
 */

describe('LiveTitleSchema / LiveThumbnailSchema', () => {
  it('LiveTitleSchema: title 단건 응답을 파싱한다', () => {
    const result = LiveTitleSchema.safeParse({ title: '실전 직무 Live' });
    expect(result.success).toBe(true);
  });

  it('LiveTitleSchema: title 이 누락되어도 파싱한다 (optional)', () => {
    const result = LiveTitleSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('LiveThumbnailSchema: thumbnail/desktopThumbnail 응답을 파싱한다', () => {
    const result = LiveThumbnailSchema.safeParse({
      thumbnail: 'https://cdn.example.com/m.png',
      desktopThumbnail: 'https://cdn.example.com/d.png',
    });
    expect(result.success).toBe(true);
  });

  it('LiveThumbnailSchema: 둘 다 null 이어도 파싱한다', () => {
    const result = LiveThumbnailSchema.safeParse({
      thumbnail: null,
      desktopThumbnail: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('LiveContentSchema', () => {
  it('알려진 키 + 추가 키 모두 통과한다 (passthrough)', () => {
    const result = LiveContentSchema.safeParse({
      desc: '<p>본문</p>',
      shortDesc: '한 줄 설명',
      criticalNotice: '주의사항',
      extraField: 'BE 가 추후 추가할 수 있는 필드',
    });
    expect(result.success).toBe(true);
  });
});

describe('LiveApplicationFormSchema', () => {
  it('priceList 가 포함된 신청폼 응답을 파싱한다', () => {
    const data = {
      applied: false,
      name: '홍길동',
      email: 'hong@example.com',
      contactEmail: 'hong@example.com',
      phoneNumber: '010-0000-0000',
      startDate: '2026-05-01T00:00:00',
      endDate: '2026-05-30T23:59:59',
      deadline: '2026-04-25T23:59:59',
      priceList: [
        {
          priceId: 1,
          price: 100000,
          discount: 0,
          accountNumber: '110-000-000000',
          deadline: '2026-04-25T23:59:59',
          accountType: 'KAKAO',
          livePriceType: 'CHARGE',
        },
      ],
    };
    const result = LiveApplicationFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('priceList 가 비어있어도 파싱한다', () => {
    const result = LiveApplicationFormSchema.safeParse({ priceList: [] });
    expect(result.success).toBe(true);
  });
});

describe('LiveHistorySchema', () => {
  it('applied/applicationId 응답을 파싱한다', () => {
    const result = LiveHistorySchema.safeParse({
      applied: true,
      applicationId: 123,
    });
    expect(result.success).toBe(true);
  });

  it('빈 객체도 파싱한다 (BE 응답 미확정 대응)', () => {
    const result = LiveHistorySchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('LiveMentorPasswordSchema', () => {
  it('mentorPassword 응답을 파싱한다', () => {
    const result = LiveMentorPasswordSchema.safeParse({
      mentorPassword: 'abcd1234',
    });
    expect(result.success).toBe(true);
  });
});

describe('LiveMentorContentSchema', () => {
  it('mentorNotificationSchema 와 동일하게 동작한다', () => {
    const data = {
      liveMentorVo: {
        id: 1,
        title: '직무 Live',
        participationCount: 10,
        mentorName: '홍길동',
        zoomLink: 'https://zoom.us/j/123',
        zoomPassword: 'abcd',
        place: '온라인',
        startDate: '2026-05-01T19:00:00',
        endDate: '2026-05-01T21:00:00',
      },
      questionList: ['Q1', 'Q2'],
      motivateList: ['M1'],
      reviewList: [{ questionType: 'PREV', answer: '기대됩니다' }],
    };
    const result = LiveMentorContentSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('LiveApplicantListSchema', () => {
  it('applicationList 와 pageInfo 를 파싱한다', () => {
    const data = {
      applicationList: [
        {
          applicationId: 1,
          userId: 100,
          name: '홍길동',
          email: 'hong@example.com',
          contactEmail: 'hong@example.com',
          phoneNumber: '010-0000-0000',
          isConfirmed: true,
          paybackStatus: 'WAITING',
          createDate: '2026-05-01T00:00:00',
        },
      ],
      pageInfo: {
        pageNum: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      },
    };
    const result = LiveApplicantListSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('LiveReviewListSchema', () => {
  it('reviewList 응답을 파싱한다', () => {
    const data = {
      reviewList: [
        {
          id: 1,
          applicationId: 99,
          userId: 100,
          programTitle: '실전 직무 Live',
          programType: 'LIVE',
          name: '홍길동',
          nps: 9,
          npsAns: '추천합니다',
          npsCheckAns: true,
          content: '좋았어요',
          programDetail: 'LIVE 1기',
          score: 5,
          isVisible: true,
          createdDate: '2026-05-01T00:00:00',
        },
      ],
    };
    const result = LiveReviewListSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('ReviewV2ItemSchema / ReviewV2ListSchema', () => {
  it('ReviewV2ItemSchema 가 v2 응답을 파싱한다', () => {
    const result = ReviewV2ItemSchema.safeParse({
      id: 1,
      programType: 'CHALLENGE',
      programId: 10,
      programTitle: '챌린지 1기',
      name: '홍길동',
      nps: 9,
      npsAns: '추천합니다',
      npsCheckAns: true,
      score: 5,
      content: '좋았어요',
      isVisible: true,
      createdDate: '2026-05-01T00:00:00',
    });
    expect(result.success).toBe(true);
  });

  it('ReviewV2ListSchema 가 4가지 programType 을 모두 파싱한다', () => {
    const types = ['CHALLENGE', 'MISSION', 'LIVE', 'REPORT'] as const;
    for (const programType of types) {
      const result = ReviewV2ListSchema.safeParse({
        reviewList: [{ id: 1, programType, content: 'ok' }],
      });
      expect(result.success).toBe(true);
    }
  });

  it('ReviewV2ItemSchema 가 알 수 없는 programType 은 거부한다', () => {
    const result = ReviewV2ItemSchema.safeParse({
      id: 1,
      programType: 'UNKNOWN',
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateReviewV2ReqSchema', () => {
  it('정상 요청을 파싱한다', () => {
    const result = CreateReviewV2ReqSchema.safeParse({
      programType: 'LIVE',
      programId: 1,
      nps: 9,
      npsAns: '추천합니다',
      npsCheckAns: true,
      score: 5,
      content: '좋았어요',
    });
    expect(result.success).toBe(true);
  });

  it('MISSION 은 작성 비대상이므로 거부한다', () => {
    const result = CreateReviewV2ReqSchema.safeParse({
      programType: 'MISSION',
      programId: 1,
      nps: 9,
      npsAns: '추천합니다',
      npsCheckAns: true,
      score: 5,
      content: '좋았어요',
    });
    expect(result.success).toBe(false);
  });

  it('필수 필드가 빠지면 거부한다', () => {
    const result = CreateReviewV2ReqSchema.safeParse({
      programType: 'LIVE',
      programId: 1,
    });
    expect(result.success).toBe(false);
  });
});
