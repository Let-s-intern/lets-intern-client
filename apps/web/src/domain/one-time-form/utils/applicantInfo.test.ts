import {
  applicantInfoFromUser,
  formatPhoneNumber,
  validateApplicantInfo,
} from './applicantInfo';

const VALID = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
};

describe('formatPhoneNumber', () => {
  it.each([
    ['010', '010'],
    ['0101', '010-1'],
    ['0101234', '010-1234'],
    ['01012345', '010-1-2345'],
    ['0101234567', '010-123-4567'],
    ['01012345678', '010-1234-5678'],
    ['010-1234-56789', '010-1234-5678'],
    ['010 1234 5678', '010-1234-5678'],
  ])('%s -> %s', (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });
});

describe('validateApplicantInfo', () => {
  it('계약 5.6 형식이면 모두 null', () => {
    expect(validateApplicantInfo(VALID)).toEqual({
      name: null,
      email: null,
      phoneNum: null,
    });
    expect(
      validateApplicantInfo({ ...VALID, phoneNum: '011-123-4567' }).phoneNum,
    ).toBeNull();
  });

  it('비어 있으면 칸마다 입력 안내', () => {
    expect(
      validateApplicantInfo({ name: ' ', email: '', phoneNum: '' }),
    ).toEqual({
      name: '이름을 입력해 주세요.',
      email: '이메일을 입력해 주세요.',
      phoneNum: '전화번호를 입력해 주세요.',
    });
  });

  it('이름은 50자까지', () => {
    expect(
      validateApplicantInfo({ ...VALID, name: 'a'.repeat(50) }).name,
    ).toBeNull();
    expect(validateApplicantInfo({ ...VALID, name: 'a'.repeat(51) }).name).toBe(
      '이름은 50자 이하로 입력해 주세요.',
    );
  });

  it('이메일은 형식이 맞고 255자 이하', () => {
    const tooLong = `${'a'.repeat(244)}@example.com`;
    expect(tooLong).toHaveLength(256);
    for (const email of ['letscareer', 'a@b', 'a b@c.com', tooLong]) {
      expect(validateApplicantInfo({ ...VALID, email }).email).toBe(
        '이메일 형식을 확인해 주세요.',
      );
    }
  });

  it('전화번호는 01X-XXX(X)-XXXX', () => {
    for (const phoneNum of ['010-1234', '01012345678', '020-1234-5678']) {
      expect(validateApplicantInfo({ ...VALID, phoneNum }).phoneNum).toBe(
        '전화번호 형식을 확인해 주세요.',
      );
    }
  });
});

describe('applicantInfoFromUser', () => {
  it('연락 이메일을 먼저 쓰고 전화번호에 하이픈을 넣는다', () => {
    expect(
      applicantInfoFromUser({
        name: '김렛커',
        email: 'login@example.com',
        contactEmail: 'letscareer@example.com',
        phoneNum: '01012345678',
      }),
    ).toEqual(VALID);
  });

  it('비어 있는 값은 빈 문자열로 둔다', () => {
    expect(
      applicantInfoFromUser({
        name: null,
        email: 'login@example.com',
        contactEmail: null,
        phoneNum: null,
      }),
    ).toEqual({ name: '', email: 'login@example.com', phoneNum: '' });
  });
});
