import { describe, expect, it } from 'vitest';

import {
  dateDaysAgo,
  describeUsageFilters,
  hasAdvancedFilter,
  readUsageFilters,
  toAccessLogListParams,
  type UsageFilterState,
} from '../usageFilterParams';

const read = (query: string) => readUsageFilters(new URLSearchParams(query));

const EMPTY: UsageFilterState = {
  programKeyword: '',
  userKeyword: '',
  programType: '',
  paidFrom: '',
  paidTo: '',
  firstAccessedFrom: '',
  firstAccessedTo: '',
  usageStatus: '',
  includeCanceled: true,
  sort: 'LAST_ACCESSED_DESC',
};

describe('readUsageFilters', () => {
  it('조건이 없으면 기본값을 준다', () => {
    expect(read('')).toEqual(EMPTY);
  });

  it('URL 의 조건을 그대로 읽는다', () => {
    expect(
      read(
        'programKeyword=챌린지&userKeyword=김렛츠&programType=CHALLENGE' +
          '&paidFrom=2026-07-01&paidTo=2026-08-06' +
          '&firstAccessedFrom=2026-07-02&firstAccessedTo=2026-08-05' +
          '&usageStatus=NOT_USED&includeCanceled=false&sort=PAID_ASC',
      ),
    ).toEqual({
      programKeyword: '챌린지',
      userKeyword: '김렛츠',
      programType: 'CHALLENGE',
      paidFrom: '2026-07-01',
      paidTo: '2026-08-06',
      firstAccessedFrom: '2026-07-02',
      firstAccessedTo: '2026-08-05',
      usageStatus: 'NOT_USED',
      includeCanceled: false,
      sort: 'PAID_ASC',
    });
  });

  it('취소 건은 기본으로 포함한다', () => {
    // 취소돼도 분쟁은 이어진다. 기본이 제외면 분쟁 건이 화면에서 사라진다.
    expect(read('').includeCanceled).toBe(true);
    expect(read('includeCanceled=true').includeCanceled).toBe(true);
    expect(read('includeCanceled=false').includeCanceled).toBe(false);
  });

  it('모르는 이용 상태·정렬 값은 버린다', () => {
    // 손으로 고친 주소나 옛 링크가 걸리지도 않은 조건을 걸린 것처럼 보이게 하면 안 된다.
    const filters = read('usageStatus=NOT_TRACKED&sort=RANDOM');

    expect(filters.usageStatus).toBe('');
    expect(filters.sort).toBe('LAST_ACCESSED_DESC');
  });

  it('공백만 있는 검색어는 조건으로 치지 않는다', () => {
    expect(read('programKeyword=%20%20').programKeyword).toBe('');
  });
});

describe('toAccessLogListParams', () => {
  it('빈 조건은 넘기지 않는다', () => {
    expect(toAccessLogListParams(EMPTY, 0, 20)).toEqual({
      programKeyword: undefined,
      userKeyword: undefined,
      programType: undefined,
      paidFrom: undefined,
      paidTo: undefined,
      firstAccessedFrom: undefined,
      firstAccessedTo: undefined,
      usageStatus: undefined,
      includeCanceled: true,
      sort: 'LAST_ACCESSED_DESC',
      page: 0,
      size: 20,
    });
  });

  it('걸린 조건을 전부 실어 보낸다', () => {
    const params = toAccessLogListParams(
      {
        ...EMPTY,
        programKeyword: '챌린지',
        userKeyword: '김렛츠',
        programType: 'CHALLENGE',
        paidFrom: '2026-07-01',
        usageStatus: 'NOT_USED',
        includeCanceled: false,
        sort: 'PAID_DESC',
      },
      2,
      20,
    );

    expect(params).toMatchObject({
      programKeyword: '챌린지',
      userKeyword: '김렛츠',
      programType: 'CHALLENGE',
      paidFrom: '2026-07-01',
      usageStatus: 'NOT_USED',
      includeCanceled: false,
      sort: 'PAID_DESC',
      page: 2,
    });
  });
});

describe('describeUsageFilters', () => {
  it('조건이 없으면 아무것도 만들지 않는다', () => {
    expect(describeUsageFilters(EMPTY)).toEqual([]);
  });

  it('걸린 조건을 사람이 읽을 문장으로 편다', () => {
    const chips = describeUsageFilters({
      ...EMPTY,
      programKeyword: '챌린지',
      userKeyword: '김렛츠',
      programType: 'LIVE',
      usageStatus: 'BEFORE_TRACKING',
      includeCanceled: false,
    });

    expect(chips.map((chip) => chip.label)).toEqual([
      '프로그램: 챌린지',
      '유저: 김렛츠',
      '프로그램 타입: 라이브',
      '이용 상태: 기록 없음 (집계 이전)',
      '취소 건 제외',
    ]);
  });

  it('이용 상태 문구가 판정 표기와 같다', () => {
    // 필터 라벨과 표의 표기가 다르면 같은 값인지 알 수 없다.
    // 특히 `미이용` 과 `집계 이전` 이 한 문구로 뭉개지면 안 된다.
    const notUsed = describeUsageFilters({ ...EMPTY, usageStatus: 'NOT_USED' });
    const before = describeUsageFilters({
      ...EMPTY,
      usageStatus: 'BEFORE_TRACKING',
    });

    expect(notUsed[0].label).toBe('이용 상태: 미이용');
    expect(before[0].label).toBe('이용 상태: 기록 없음 (집계 이전)');
  });

  it('날짜 범위는 한 칩으로 묶고 함께 지운다', () => {
    const [chip] = describeUsageFilters({
      ...EMPTY,
      paidFrom: '2026-07-01',
      paidTo: '2026-08-06',
    });

    expect(chip.label).toBe('결제일: 2026-07-01 ~ 2026-08-06');
    expect(chip.clears).toEqual(['paidFrom', 'paidTo']);
  });

  it('한쪽만 있는 범위도 말이 되게 적는다', () => {
    expect(
      describeUsageFilters({ ...EMPTY, paidFrom: '2026-07-01' })[0].label,
    ).toBe('결제일: 2026-07-01 이후');
    expect(
      describeUsageFilters({ ...EMPTY, firstAccessedTo: '2026-08-06' })[0]
        .label,
    ).toBe('최초 이용일: 2026-08-06 이전');
  });
});

describe('hasAdvancedFilter', () => {
  it('접어 둔 자리에 조건이 없으면 false', () => {
    expect(hasAdvancedFilter(EMPTY)).toBe(false);
    expect(
      hasAdvancedFilter({ ...EMPTY, programKeyword: '챌린지', paidFrom: 'x' }),
    ).toBe(false);
  });

  it('접어 둔 조건이 하나라도 걸려 있으면 true', () => {
    const cases: Partial<UsageFilterState>[] = [
      { programType: 'CHALLENGE' },
      { firstAccessedFrom: '2026-07-01' },
      { firstAccessedTo: '2026-07-01' },
      { includeCanceled: false },
      { sort: 'PAID_ASC' },
    ];

    cases.forEach((patch) => {
      expect(hasAdvancedFilter({ ...EMPTY, ...patch })).toBe(true);
    });
  });
});

describe('dateDaysAgo', () => {
  it('기준 시각으로부터 며칠 전의 날짜를 준다', () => {
    expect(dateDaysAgo(7, new Date('2026-08-06T09:00:00'))).toBe('2026-07-30');
    expect(dateDaysAgo(30, new Date('2026-08-06T09:00:00'))).toBe('2026-07-07');
    expect(dateDaysAgo(0, new Date('2026-08-06T23:59:59'))).toBe('2026-08-06');
  });
});
