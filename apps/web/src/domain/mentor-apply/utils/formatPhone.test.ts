import { formatPhone, toPhoneDigits } from './formatPhone';

describe('formatPhone', () => {
  it('3자리까지는 하이픈 없이 둔다', () => {
    expect(formatPhone('010')).toBe('010');
  });

  it('7자리는 앞 3자리 뒤에만 하이픈을 넣는다', () => {
    expect(formatPhone('0101234')).toBe('010-1234');
  });

  it('10자리는 3-3-4 로 나눈다', () => {
    expect(formatPhone('0101234567')).toBe('010-123-4567');
  });

  it('11자리는 3-4-4 로 나눈다', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678');
  });

  it('숫자 아닌 문자는 버리고 11자리를 넘기면 자른다', () => {
    expect(formatPhone('010-1234-5678-9')).toBe('010-1234-5678');
  });
});

describe('toPhoneDigits', () => {
  it('숫자만 남긴다', () => {
    expect(toPhoneDigits('010-1234-5678')).toBe('01012345678');
  });
});
