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

  it('VOD 는 상품 링크가 있는 카드만 남긴다', () => {
    expect(PASS_BENEFIT_VOD_CARDS.every((card) => Boolean(card.url))).toBe(
      true,
    );
    expect(PASS_BENEFIT_VOD_CARDS).toHaveLength(
      MARKETER_VOD.cards.filter((card) => Boolean(card.url)).length,
    );
  });

  /*
   * 링크를 못 받은 카드는 목록에서 빠지되 문구는 데이터에 남아 있어야 한다. 빠졌다고
   * 지워 버리면 링크를 받았을 때 시안을 다시 읽어야 한다 (PRD 7절 C).
   */
  it('링크를 못 받은 쥬디 멘토 VOD 는 화면 목록에 없다', () => {
    const titles = PASS_BENEFIT_VOD_CARDS.map((card) => card.title);
    expect(titles).not.toContain(
      '렛츠커리어 CEO 쥬디 멘토의 마케팅 경험 합격 기준',
    );
  });
});
