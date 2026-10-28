import { describe, expect, it } from 'vitest';

import type { OneTimeFormSettingsValues } from '../types/oneTimeFormSettings';
import { DEFAULT_ONE_TIME_FORM_SETTINGS } from '../utils/oneTimeFormSettingsValues';
import { validateOneTimeFormSettings } from './oneTimeFormSettingsSchema';

const valid: OneTimeFormSettingsValues = {
  ...DEFAULT_ONE_TIME_FORM_SETTINGS,
  title: '포트폴리오 집중 클래스',
  slug: 'portfolio-1115',
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-10T23:59:59',
};

const validate = (overrides: Partial<OneTimeFormSettingsValues>) =>
  validateOneTimeFormSettings({ ...valid, ...overrides });

describe('validateOneTimeFormSettings', () => {
  it('올바른 값이면 오류가 없다', () => {
    expect(validate({})).toEqual({});
    expect(validate({ cancelDeadline: '2026-11-05T00:00:00' })).toEqual({});
  });

  it('새 폼 기본값은 제목·주소·기간이 비어 있다고 알린다', () => {
    const errors = validateOneTimeFormSettings(DEFAULT_ONE_TIME_FORM_SETTINGS);
    expect(Object.keys(errors).sort()).toEqual(
      ['endDate', 'slug', 'startDate', 'title'].sort(),
    );
  });

  it('공백만 있는 제목은 비어 있는 것으로 본다', () => {
    expect(validate({ title: '   ' }).title).toBe('폼 제목을 입력해 주세요.');
  });

  describe('기간', () => {
    it('신청 마감이 시작보다 앞서면 거절한다', () => {
      expect(validate({ endDate: '2026-10-31T23:59:59' }).endDate).toBe(
        '신청 마감은 신청 시작보다 뒤여야 합니다.',
      );
    });

    it('신청 마감이 시작과 같아도 거절한다', () => {
      expect(validate({ endDate: valid.startDate }).endDate).toBeDefined();
    });

    it('취소 마감이 신청 시작보다 앞서거나 같으면 거절한다', () => {
      expect(
        validate({ cancelDeadline: '2026-10-30T00:00:00' }).cancelDeadline,
      ).toBe('취소 마감은 신청 시작보다 뒤여야 합니다.');
      expect(
        validate({ cancelDeadline: valid.startDate }).cancelDeadline,
      ).toBeDefined();
    });

    it('취소 마감을 비우면 검사하지 않는다', () => {
      expect(validate({ cancelDeadline: '' }).cancelDeadline).toBeUndefined();
    });
  });

  describe('slug', () => {
    it.each(['abc', 'portfolio-1115', 'a1-b2-c3', 'a'.repeat(50)])(
      '%s 는 통과한다',
      (slug) => {
        expect(validate({ slug }).slug).toBeUndefined();
      },
    );

    it.each([
      'Portfolio',
      'port_folio',
      'port folio',
      '-portfolio',
      'portfolio-',
      'port--folio',
      '포트폴리오',
    ])('%s 는 형식 오류다', (slug) => {
      expect(validate({ slug }).slug).toMatch(/하이픈/);
    });

    it('3자 미만과 50자 초과는 거절한다', () => {
      expect(validate({ slug: 'ab' }).slug).toBe('3자 이상 입력해 주세요.');
      expect(validate({ slug: 'a'.repeat(51) }).slug).toBe(
        '50자 이하로 입력해 주세요.',
      );
    });
  });

  it('문구 길이 제한을 넘으면 거절한다', () => {
    const errors = validate({
      title: 'a'.repeat(101),
      categoryText: 'a'.repeat(31),
      scheduleText: 'a'.repeat(51),
      completionMessage: 'a'.repeat(1001),
      paymentProductName: 'a'.repeat(101),
    });
    expect(errors).toEqual({
      title: '100자 이하로 입력해 주세요.',
      categoryText: '30자 이하로 입력해 주세요.',
      scheduleText: '50자 이하로 입력해 주세요.',
      completionMessage: '1000자 이하로 입력해 주세요.',
      paymentProductName: '100자 이하로 입력해 주세요.',
    });
  });

  it('기본 금액은 0 이상의 정수여야 한다', () => {
    expect(validate({ basePrice: 0 }).basePrice).toBeUndefined();
    expect(validate({ basePrice: -1 }).basePrice).toBeDefined();
    expect(validate({ basePrice: 1.5 }).basePrice).toBeDefined();
  });
});
