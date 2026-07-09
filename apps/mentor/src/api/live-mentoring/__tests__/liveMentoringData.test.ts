import {
  LIVE_MENTOR_CARDS,
  LIVE_MENTOR_DETAILS,
  OPEN_STATUS_ROWS,
  PRICE_BY_DURATION,
  REVIEWS_BY_MENTOR,
  SETTLEMENT_ROWS,
} from '@letscareer/mocks';
import { describe, expect, it } from 'vitest';

/**
 * 공유 목 데이터(@letscareer/mocks)의 형상·개수·가격 매핑을 검증한다.
 * web/mentor 양 앱이 동일 계약을 바라보는 SSOT이므로 여기서 회귀를 막는다.
 */
describe('1대1 라이브 멘토링 공유 목 데이터', () => {
  it('멘토 카드는 12명 이상이라 size=9 기준 2페이지 이상이다', () => {
    expect(LIVE_MENTOR_CARDS.length).toBeGreaterThanOrEqual(12);
    expect(Math.ceil(LIVE_MENTOR_CARDS.length / 9)).toBeGreaterThanOrEqual(2);
  });

  it('가격은 진행시간 고정 매핑(30→35,000 / 50→60,000)을 따른다', () => {
    expect(PRICE_BY_DURATION[30]).toBe(35000);
    expect(PRICE_BY_DURATION[50]).toBe(60000);
    for (const card of LIVE_MENTOR_CARDS) {
      expect(card.price).toBe(PRICE_BY_DURATION[card.durationMin]);
    }
  });

  it('카테고리·진행시간·평점 분포가 다양하다', () => {
    const categories = new Set(LIVE_MENTOR_CARDS.map((c) => c.category));
    expect(categories).toEqual(
      new Set(['PERSONAL_STATEMENT', 'RESUME', 'PORTFOLIO']),
    );

    const durations = new Set(LIVE_MENTOR_CARDS.map((c) => c.durationMin));
    expect(durations).toEqual(new Set([30, 50]));

    for (const card of LIVE_MENTOR_CARDS) {
      expect(card.rating).toBeGreaterThanOrEqual(0);
      expect(card.rating).toBeLessThanOrEqual(5);
    }
    // 후기 수 분포: 0건과 100건 이상이 모두 존재
    expect(LIVE_MENTOR_CARDS.some((c) => c.reviewCount === 0)).toBe(true);
    expect(LIVE_MENTOR_CARDS.some((c) => c.reviewCount >= 100)).toBe(true);
  });

  it('렌더 케이스 커버: 모자이크·프로필 비노출이 섞여 있다', () => {
    expect(
      LIVE_MENTOR_CARDS.some((c) => c.mosaicEnabled && c.mosaicBlur > 0),
    ).toBe(true);
    expect(LIVE_MENTOR_CARDS.some((c) => !c.mosaicEnabled)).toBe(true);
    expect(LIVE_MENTOR_CARDS.some((c) => c.profileVisible === false)).toBe(
      true,
    );
    expect(LIVE_MENTOR_CARDS.some((c) => c.profileImage === null)).toBe(true);
  });

  it('모든 카드에 대응하는 상세(+템플릿/프로필)가 존재한다', () => {
    for (const card of LIVE_MENTOR_CARDS) {
      const detail = LIVE_MENTOR_DETAILS[card.mentorId];
      expect(detail).toBeDefined();
      expect(detail.mentorId).toBe(card.mentorId);
      expect(detail.price).toBe(card.price);
      expect(detail.template.category).toBe(card.category);
      // 편집 불가 영역은 기본 템플릿에서 채워진다
      expect(detail.template.faq.length).toBeGreaterThan(0);
      expect(detail.template.process.length).toBeGreaterThan(0);
      expect(detail.template.submissionSpec.title).toBeTruthy();
      // 체크리스트 3-모드 enum 검증
      for (const item of detail.template.checklist) {
        expect(['SHOWN', 'HIDDEN', 'CUSTOM']).toContain(item.mode);
      }
    }
  });

  it('카테고리별 기본 템플릿 기본값이 서로 다르다', () => {
    const psTitle = LIVE_MENTOR_DETAILS[1].template.submissionSpec.title; // PERSONAL_STATEMENT
    const portfolioDetail = Object.values(LIVE_MENTOR_DETAILS).find(
      (d) => d.category === 'PORTFOLIO',
    );
    expect(portfolioDetail).toBeDefined();
    expect(portfolioDetail?.template.submissionSpec.title).not.toBe(psTitle);
  });

  it('후기는 멘토별로 존재하며 점수는 1~5 범위다', () => {
    for (const reviews of Object.values(REVIEWS_BY_MENTOR)) {
      for (const review of reviews) {
        expect(review.score).toBeGreaterThanOrEqual(1);
        expect(review.score).toBeLessThanOrEqual(5);
      }
    }
  });

  it('정산행/오픈현황행 상태 enum이 스펙과 일치한다', () => {
    for (const row of SETTLEMENT_ROWS) {
      expect(['PENDING', 'PAID']).toContain(row.status);
      expect(row.grossAmount).toBeGreaterThanOrEqual(0);
    }
    for (const row of OPEN_STATUS_ROWS) {
      expect(['OPEN', 'CLOSED']).toContain(row.status);
      expect(row.price).toBe(PRICE_BY_DURATION[row.durationMin]);
    }
  });
});
