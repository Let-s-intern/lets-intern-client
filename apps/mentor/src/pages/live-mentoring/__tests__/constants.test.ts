import {
  getLowestPrice as mockGetLowestPrice,
  LIVE_MENTORING_CATEGORIES as MOCK_CATEGORIES,
  LIVE_MENTORING_DURATIONS as MOCK_DURATIONS,
} from '@letscareer/mocks';
import { describe, expect, it } from 'vitest';

import {
  cardPriceLabel,
  durationsLabel,
  getLowestPrice,
  LIVE_MENTORING_CATEGORIES,
  LIVE_MENTORING_DURATIONS,
} from '../constants';

/**
 * 가격·선택지 상수를 목 패키지에서 앱으로 옮겼다. 목을 끄면 화면이 따라 사라지지 않게 하려는 것이고,
 * 표시 결과는 이전과 **같아야** 한다. 목 패키지 값은 목 데이터 생성용으로 남아 있으므로
 * 여기서 두 구현을 맞대어 고정한다.
 */
describe('live-mentoring constants — 목 패키지에서 이전한 가격 계산', () => {
  it('선택지 목록이 목 패키지와 같다', () => {
    expect(LIVE_MENTORING_CATEGORIES).toEqual(MOCK_CATEGORIES);
    expect(LIVE_MENTORING_DURATIONS).toEqual(MOCK_DURATIONS);
  });

  it('진행시간 조합별 최저가가 목 패키지 계산과 일치한다', () => {
    const combinations = [[], [30], [60], [30, 60], [60, 30]] as const;

    for (const durations of combinations) {
      expect(getLowestPrice(durations)).toBe(
        mockGetLowestPrice([...durations]),
      );
    }
  });

  it('고정가는 30분 35,000원 / 60분 60,000원이다', () => {
    expect(getLowestPrice([30])).toBe(35000);
    expect(getLowestPrice([60])).toBe(60000);
  });

  it('여러 개를 고르면 순서와 무관하게 최저가를 고른다', () => {
    expect(getLowestPrice([60, 30])).toBe(35000);
  });

  it('아무것도 고르지 않으면 0이다', () => {
    expect(getLowestPrice([])).toBe(0);
  });

  it('라벨 포맷이 이전과 같다', () => {
    expect(durationsLabel([30, 60])).toBe('30분 / 60분');
    expect(cardPriceLabel([30], 35000)).toBe('35,000원');
    // 여러 진행시간이면 최저가라는 뜻으로 물결을 붙인다
    expect(cardPriceLabel([30, 60], 35000)).toBe('35,000원~');
  });
});
