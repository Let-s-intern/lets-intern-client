import { describe, expect, it } from 'vitest';

import { formatPhoneNum } from '../formatPhoneNum';

describe('formatPhoneNum', () => {
  it('11자리 휴대폰 번호에 하이픈을 넣는다', () => {
    expect(formatPhoneNum('01012345678')).toBe('010-1234-5678');
  });

  it('10자리 번호는 지역번호 길이에 맞춰 나눈다', () => {
    expect(formatPhoneNum('0212345678')).toBe('02-1234-5678');
    expect(formatPhoneNum('0311234567')).toBe('031-123-4567');
  });

  it('형식이 맞지 않으면 그대로 돌려준다', () => {
    expect(formatPhoneNum('1234')).toBe('1234');
  });
});
