import {
  getLowestPrice,
  LIVE_MENTOR_CARDS,
  LIVE_MENTOR_DETAILS,
  OPENING_HISTORY,
  PRICE_BY_DURATION,
  REVIEWS_BY_MENTOR,
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

  it('가격은 진행시간 고정 매핑(30→35,000 / 60→60,000)을 따르며 여러 진행시간이면 최저가다', () => {
    expect(PRICE_BY_DURATION[30]).toBe(35000);
    expect(PRICE_BY_DURATION[60]).toBe(60000);
    for (const card of LIVE_MENTOR_CARDS) {
      expect(card.price).toBe(getLowestPrice(card.durations));
    }
  });

  it('카테고리·진행시간·평점 분포가 다양하다', () => {
    const categories = new Set(LIVE_MENTOR_CARDS.flatMap((c) => c.categories));
    expect(categories).toEqual(
      new Set(['PERSONAL_STATEMENT', 'RESUME', 'PORTFOLIO']),
    );

    const durations = new Set(LIVE_MENTOR_CARDS.flatMap((c) => c.durations));
    expect(durations).toEqual(new Set([30, 60]));

    // 다중 타입·진행시간 오픈 케이스가 존재한다
    expect(LIVE_MENTOR_CARDS.some((c) => c.categories.length > 1)).toBe(true);
    expect(LIVE_MENTOR_CARDS.some((c) => c.durations.length > 1)).toBe(true);

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
      // 템플릿 카테고리는 상품 카테고리(다중)를 그대로 따른다
      expect(detail.template.categories).toEqual(card.categories);
      // 멘토 편집 영역은 기본값이 채워진다
      expect(detail.template.intro.oneLiner).toBeTruthy();
      expect(detail.template.mentoringTypes.items.length).toBeGreaterThan(0);
      // 참여 중인 챌린지가 존재한다
      expect(detail.challenges.length).toBeGreaterThan(0);
      expect(detail.challenges[0].title).toBeTruthy();
      // 노출 토글 섹션은 boolean 을 갖는다
      for (const section of [
        detail.template.strategy,
        detail.template.video,
        detail.template.results,
      ]) {
        expect(typeof section.visible).toBe('boolean');
      }
    }
  });

  it('후기는 멘토별로 존재하며 점수는 1~5 범위다', () => {
    for (const reviews of Object.values(REVIEWS_BY_MENTOR)) {
      for (const review of reviews) {
        expect(review.score).toBeGreaterThanOrEqual(1);
        expect(review.score).toBeLessThanOrEqual(5);
      }
    }
  });

  it('개설이력 상태 enum이 스펙과 일치한다', () => {
    // 활성 개설은 최대 1건이다(서버 `LiveMentoring.addOpening` 제약).
    expect(
      OPENING_HISTORY.filter((o) => o.status === 'OPEN').length,
    ).toBeLessThanOrEqual(1);
    for (const opening of OPENING_HISTORY) {
      expect(['OPEN', 'CLOSED']).toContain(opening.status);
      // 가격은 서버 고정 정책이라 진행시간에서 결정된다.
      for (const { duration, price } of opening.durationPrices) {
        expect(price).toBe(PRICE_BY_DURATION[duration]);
      }
      // 종료된 개설은 종료일시·사유가 함께 있어야 한다.
      if (opening.status === 'CLOSED') {
        expect(opening.closedAt).toBeTruthy();
        expect(opening.closeReason).toBeTruthy();
      } else {
        expect(opening.closedAt).toBeNull();
        expect(opening.closeReason).toBeNull();
      }
    }
  });
});
