import {
  LIVE_MENTOR_CARDS,
  LIVE_MENTOR_DETAILS,
  LIVE_MENTOR_DETAILS_BY_LIVE_MENTORING_ID,
} from '@letscareer/mocks/data/live-mentoring';

import {
  liveMentorDetailSchema,
  liveMentoringOpeningSchema,
} from './liveMentoringSchema';

/**
 * 공유 목 데이터가 공개 계약 스키마로 **실제로** 파싱되는지 검증한다.
 * 손으로 만든 픽스처(`liveMentoringSchema.test.ts`)와 달리 목이 서빙하는 값 그 자체를 본다.
 */
describe('공유 목 데이터 — 공개 상세 계약', () => {
  it('모든 멘토 상세가 공개 상세 스키마로 파싱된다', () => {
    for (const detail of Object.values(LIVE_MENTOR_DETAILS)) {
      expect(() => liveMentorDetailSchema.parse(detail)).not.toThrow();
    }
  });

  it('개설 없는 상품이 한 건 있고, 개설 파생 값이 전부 비어 있다', () => {
    const noOpening = Object.values(LIVE_MENTOR_DETAILS).filter(
      (detail) => detail.openingId === null,
    );
    expect(noOpening).toHaveLength(1);

    const parsed = liveMentorDetailSchema.parse(noOpening[0]);
    expect(parsed.price).toBeNull();
    expect(parsed.feedbackStartDate).toBeNull();
    expect(parsed.feedbackEndDate).toBeNull();
    expect(parsed.durations).toEqual([]);
    expect(parsed.durationPrices).toEqual([]);

    // 상세 콘텐츠는 정상으로 채워진다 — 승인·개설 없이도 상세 페이지가 렌더돼야 한다.
    expect(parsed.liveMentoringId).toBeGreaterThan(0);
    expect(parsed.title).toBeTruthy();
    expect(parsed.categories.length).toBeGreaterThan(0);
    expect(parsed.profile.nickname).toBeTruthy();
    expect(parsed.template.mentoringTypes.items.length).toBeGreaterThan(0);
  });

  it('개설 없는 상품은 공개 목록에 실리지 않는다', () => {
    const listedMentorIds = new Set(
      LIVE_MENTOR_CARDS.map((card) => card.mentorId),
    );
    for (const detail of Object.values(LIVE_MENTOR_DETAILS)) {
      if (detail.openingId === null) {
        expect(listedMentorIds.has(detail.mentorId)).toBe(false);
      }
    }
  });

  it('mentorId 색인과 liveMentoringId 색인이 같은 상세를 가리킨다', () => {
    for (const detail of Object.values(LIVE_MENTOR_DETAILS)) {
      expect(
        LIVE_MENTOR_DETAILS_BY_LIVE_MENTORING_ID[detail.liveMentoringId],
      ).toEqual(detail);
    }
  });

  it('mentorId·liveMentoringId·openingId 가 서로 겹치지 않는다', () => {
    // 세 값이 겹쳐 있으면 잘못된 id 를 넘기는 회귀가 목에서 드러나지 않는다.
    for (const card of LIVE_MENTOR_CARDS) {
      expect(card.liveMentoringId).not.toBe(card.mentorId);
      expect(card.openingId).not.toBe(card.liveMentoringId);
      expect(card.openingId).not.toBe(card.mentorId);
    }
  });
});

describe('공유 목 데이터 — 공개 목록 계약', () => {
  it('카드가 개설 스키마의 식별자 두 개를 모두 갖는다', () => {
    for (const card of LIVE_MENTOR_CARDS) {
      const parsed = liveMentoringOpeningSchema.parse({
        liveMentoringId: card.liveMentoringId,
        openingId: card.openingId,
        mentorId: card.mentorId,
        mentorNickname: card.nickname,
        mentorProfileImage: card.profileImage,
        mentorIntroduction: card.mentoringPoints,
        representativeCareer: null,
        title: '목 상품명',
        categories: card.categories,
        durations: card.durations,
        minimumPrice: card.price,
        feedbackStartDate: card.feedbackStartDate,
        feedbackEndDate: card.feedbackEndDate,
      });
      expect(parsed.liveMentoringId).toBe(card.liveMentoringId);
      expect(parsed.openingId).toBe(card.openingId);
    }
  });
});
