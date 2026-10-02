import { CHALLENGE_ITEMS } from './challengeModalItems';
import { GUIDEBOOK_ITEMS } from './guidebooks';
import { MARKETER_VOD } from './marketerVod';
import { MENTORING_COUPON } from './mentoringCoupon';
import {
  PASS_BENEFIT_SOURCES,
  PASS_BENEFIT_VOD_CARDS,
  PASS_BENEFITS_MODALS,
} from './passBenefitModals';

describe('PASS_BENEFITS_MODALS (개편 시안 6)', () => {
  it('혜택은 4종이고 배지 번호가 시안대로 01~04 다', () => {
    expect(PASS_BENEFITS_MODALS).toHaveLength(4);
    expect(PASS_BENEFITS_MODALS.map((entry) => entry.modal.badge)).toEqual([
      'PASS BENEFIT 01',
      'PASS BENEFIT 02',
      'PASS BENEFIT 03',
      'PASS BENEFIT 04',
    ]);
  });

  /*
   * 모달 본문 목록을 여기에 다시 적으면 상품이 바뀔 때 두 곳이 어긋난다. 참조인지를
   * 동등성이 아니라 **동일성**(toBe)으로 못박는다 — 복사본이면 통과하면 안 된다.
   */
  it('각 모달이 기존 데이터를 그대로 가리킨다', () => {
    expect(PASS_BENEFIT_SOURCES.challenge).toBe(CHALLENGE_ITEMS);
    expect(PASS_BENEFIT_SOURCES.guidebook).toBe(GUIDEBOOK_ITEMS);
    expect(PASS_BENEFIT_SOURCES.mentoring).toBe(MENTORING_COUPON);
  });

  it('챌린지는 10종, 가이드북은 7종이다', () => {
    expect(PASS_BENEFIT_SOURCES.challenge).toHaveLength(10);
    // 시안 6-2 배지는 `6 GUIDE BOOK` 이지만 제목도 카드도 7종이다
    expect(PASS_BENEFIT_SOURCES.guidebook).toHaveLength(7);
    expect(PASS_BENEFITS_MODALS[1].modal.eyebrow).toBe('7 GUIDE BOOK');
  });

  /*
   * 네 강의 모두 상세 주소를 받았다. 주소가 빠진 카드가 다시 들어오면 버튼 없는 카드가
   * 조용히 섞이므로 여기서 막는다.
   */
  it('VOD 4종이 모두 상세 주소를 가진다', () => {
    expect(PASS_BENEFIT_VOD_CARDS).toHaveLength(4);
    expect(PASS_BENEFIT_VOD_CARDS.every((card) => Boolean(card.url))).toBe(
      true,
    );
    expect(MARKETER_VOD.title).toContain('4종');
  });

  it('카드 순서가 시안과 같다', () => {
    expect(PASS_BENEFIT_VOD_CARDS.map((card) => card.banner)).toEqual([
      'vod-seminar-1.png',
      'vod-seminar-3.png',
      'vod-seminar-2.png',
      'vod-seminar-4.png',
    ]);
  });
});
