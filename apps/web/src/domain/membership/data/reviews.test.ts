import fs from 'node:fs';
import path from 'node:path';
import { IMAGE_REVIEWS, MISSION_REVIEWS } from './reviews';

// 시안(8-0.png) 이전부터 쓰이던 캡처 8종. WebP 반입 규칙의 예외로 명시해 두고,
// 새로 추가되는 캡처만 .webp 를 강제한다.
const LEGACY_RASTER_SOURCES = new Set([
  '/images/membership/review-instagram.jpg',
  '/images/membership/review-companies.png',
  '/images/membership/review-coverletter.png',
  '/images/membership/review-interview.png',
  '/images/membership/review-letsrun.png',
  '/images/membership/review-renewal.jpg',
  '/images/membership/review-community.png',
  '/images/membership/review-mission.png',
]);

const PUBLIC_DIR = path.join(__dirname, '../../../../public');

describe('IMAGE_REVIEWS 캡처 후기', () => {
  it('시안 8-0.png 과 같은 8종이다', () => {
    expect(IMAGE_REVIEWS).toHaveLength(8);
  });

  it('모든 항목에 비어 있지 않은 alt 가 있다', () => {
    for (const review of IMAGE_REVIEWS) {
      expect(review.alt.trim().length).toBeGreaterThan(0);
    }
  });

  it('신규 캡처는 WebP 로만 반입한다 (기존 8종은 예외)', () => {
    for (const review of IMAGE_REVIEWS) {
      if (LEGACY_RASTER_SOURCES.has(review.src)) continue;
      expect(review.src).toMatch(/\.webp$/);
    }
  });

  it('모든 src 가 public 아래에 실제로 존재한다', () => {
    for (const review of IMAGE_REVIEWS) {
      expect(fs.existsSync(path.join(PUBLIC_DIR, review.src))).toBe(true);
    }
  });
});

describe('MISSION_REVIEWS 후기 카드', () => {
  it('6개 이상이다', () => {
    expect(MISSION_REVIEWS.length).toBeGreaterThanOrEqual(6);
  });

  it('모든 카드에 칩·날짜·프로그램·본문·이름이 있다', () => {
    for (const review of MISSION_REVIEWS) {
      expect(review.chip.trim().length).toBeGreaterThan(0);
      expect(review.date).toMatch(/^\d{2}\.\d{2}\.\d{2}$/);
      expect(review.program.trim().length).toBeGreaterThan(0);
      expect(review.body.trim().length).toBeGreaterThan(0);
      expect(review.name.trim().length).toBeGreaterThan(0);
    }
  });

  it('시안 8-2.png 의 6장이 모두 들어 있다', () => {
    const expected = [
      { date: '24.09.03', name: '고○○ 님' },
      { date: '25.02.12', name: '임○○ 님' },
      { date: '25.02.12', name: '신○○ 님' },
      { date: '26.01.28', name: '진○○ 님' },
      { date: '26.02.03', name: '손○○ 님' },
      { date: '26.02.04', name: '홍○○ 님' },
    ];
    for (const item of expected) {
      expect(
        MISSION_REVIEWS.some(
          (review) => review.date === item.date && review.name === item.name,
        ),
      ).toBe(true);
    }
  });
});
