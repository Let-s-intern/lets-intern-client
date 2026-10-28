import type { OneTimeFormOptionGroup } from '@/api/one-time-form/oneTimeFormSchema';
import { paidFormFixture } from '../__fixtures__/oneTimeFormFixtures';
import {
  calculateTotalPrice,
  findMissingRequiredGroupIds,
  formatAdditionalPrice,
  orderSelectedOptionIds,
  selectOption,
} from './optionSelection';

const { optionGroups } = paidFormFixture;
const basePrice = paidFormFixture.form.basePrice; // 29000
const [singleGroup, multipleGroup] = optionGroups;

// 계약 13.3 폼 9: 기본 0원, 그룹 91(SINGLE, 필수) 옵션 911 0원
const zeroFormGroups: OneTimeFormOptionGroup[] = [
  {
    optionGroupId: 91,
    title: '참여 방식',
    description: null,
    selectType: 'SINGLE',
    isRequired: true,
    sortOrder: 0,
    options: [
      {
        optionId: 911,
        name: '온라인',
        description: null,
        additionalPrice: 0,
        badge: null,
        sortOrder: 0,
      },
    ],
  },
];

describe('calculateTotalPrice', () => {
  it('아무것도 고르지 않으면 기본 금액이다', () => {
    expect(calculateTotalPrice(basePrice, optionGroups, [])).toBe(29000);
  });

  it('SINGLE 그룹은 다시 고르면 금액이 바뀐다', () => {
    let ids = selectOption([], singleGroup, 311);
    expect(calculateTotalPrice(basePrice, optionGroups, ids)).toBe(29000);
    ids = selectOption(ids, singleGroup, 312);
    expect(ids).toEqual([312]);
    expect(calculateTotalPrice(basePrice, optionGroups, ids)).toBe(39000);
  });

  it('MULTIPLE 그룹은 고른 만큼 더한다', () => {
    let ids = selectOption([311], multipleGroup, 321);
    ids = selectOption(ids, multipleGroup, 322);
    expect(calculateTotalPrice(basePrice, optionGroups, ids)).toBe(54000);
  });

  it('시드 신청 1042(311, 321)는 49,000원이다', () => {
    expect(calculateTotalPrice(basePrice, optionGroups, [311, 321])).toBe(
      49000,
    );
  });

  it('0원 폼(폼 9)은 0원이다', () => {
    expect(calculateTotalPrice(0, zeroFormGroups, [911])).toBe(0);
  });
});

describe('selectOption', () => {
  it('SINGLE 은 같은 그룹 선택만 바꾸고 다른 그룹 선택은 둔다', () => {
    expect(selectOption([311, 321], singleGroup, 312)).toEqual([321, 312]);
  });

  it('MULTIPLE 은 이미 고른 옵션을 다시 누르면 뺀다', () => {
    expect(selectOption([311, 321, 322], multipleGroup, 321)).toEqual([
      311, 322,
    ]);
  });
});

describe('findMissingRequiredGroupIds', () => {
  it('필수 SINGLE 그룹을 고르지 않으면 그 그룹 id 를 돌려준다', () => {
    expect(findMissingRequiredGroupIds(optionGroups, [321])).toEqual([31]);
  });

  it('필수 그룹을 골랐으면 비어 있다. 선택 그룹은 비어도 된다', () => {
    expect(findMissingRequiredGroupIds(optionGroups, [311])).toEqual([]);
  });

  it('필수 MULTIPLE 그룹은 1개 이상이어야 한다', () => {
    const groups = [singleGroup, { ...multipleGroup, isRequired: true }];
    expect(findMissingRequiredGroupIds(groups, [311])).toEqual([32]);
    expect(findMissingRequiredGroupIds(groups, [311, 321, 322])).toEqual([]);
  });

  it('필수 SINGLE 그룹에 2개가 들어 있으면 빠진 것으로 본다', () => {
    expect(findMissingRequiredGroupIds(optionGroups, [311, 312])).toEqual([31]);
  });

  it('옵션 그룹이 없으면(무료 폼) 비어 있다', () => {
    expect(findMissingRequiredGroupIds([], [])).toEqual([]);
  });
});

describe('orderSelectedOptionIds', () => {
  it('그룹 순서, 그룹 안 옵션 순서로 정렬하고 모르는 id 는 버린다', () => {
    expect(orderSelectedOptionIds(optionGroups, [322, 999, 321, 312])).toEqual([
      312, 321, 322,
    ]);
  });
});

describe('formatAdditionalPrice', () => {
  it('0원은 "추가 금액 없음", 그 밖은 "+N원"이다', () => {
    expect(formatAdditionalPrice(0)).toBe('추가 금액 없음');
    expect(formatAdditionalPrice(10000)).toBe('+10,000원');
  });
});
