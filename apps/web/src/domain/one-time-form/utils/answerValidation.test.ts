import type { OneTimeFormQuestion } from '@/api/one-time-form/oneTimeFormSchema';
import { validateAnswer } from './answerValidation';
import type { RawAnswer } from './rawAnswer';

const question = (
  type: OneTimeFormQuestion['type'],
  overrides: Partial<OneTimeFormQuestion> = {},
): OneTimeFormQuestion => ({
  questionId: 1,
  type,
  title: '질문',
  description: null,
  isRequired: false,
  choices: null,
  sortOrder: 0,
  ...overrides,
});

const attachment = (key: string, name = '파일') => ({ key, name });
const KEY_PREFIX = 'one-time-form/attachment/7/0b5c2f4e';

describe('validateAnswer', () => {
  describe('필수 여부', () => {
    it.each([
      ['SHORT_TEXT', undefined],
      ['LONG_TEXT', '   '],
      ['RADIO', ''],
      ['DROPDOWN', ''],
      ['CHECKBOX', []],
      ['DATE', ''],
      ['NUMBER', ''],
      ['URL', ' '],
      ['IMAGE', undefined],
      ['FILE', undefined],
    ] as [OneTimeFormQuestion['type'], RawAnswer | undefined][])(
      '필수 %s 가 비면 문구를 돌려준다',
      (type, value) => {
        expect(
          validateAnswer(question(type, { isRequired: true }), value),
        ).toEqual(expect.any(String));
      },
    );

    it('필수 아닌 질문은 비어도 통과한다', () => {
      expect(validateAnswer(question('URL'), '')).toBeNull();
      expect(validateAnswer(question('CHECKBOX'), [])).toBeNull();
      expect(validateAnswer(question('FILE'), undefined)).toBeNull();
    });
  });

  it('SHORT_TEXT 는 앞뒤 공백을 뺀 200자까지', () => {
    expect(validateAnswer(question('SHORT_TEXT'), 'a'.repeat(200))).toBeNull();
    expect(
      validateAnswer(question('SHORT_TEXT'), ` ${'a'.repeat(200)} `),
    ).toBeNull();
    expect(validateAnswer(question('SHORT_TEXT'), 'a'.repeat(201))).toBe(
      '200자 이하로 입력해 주세요.',
    );
  });

  it('LONG_TEXT 는 1000자까지', () => {
    expect(validateAnswer(question('LONG_TEXT'), 'a'.repeat(1000))).toBeNull();
    expect(validateAnswer(question('LONG_TEXT'), 'a'.repeat(1001))).toBe(
      '1000자 이하로 입력해 주세요.',
    );
  });

  it.each(['RADIO', 'DROPDOWN'] as const)(
    '%s 는 선택지 중 하나와 정확히 같아야 한다',
    (type) => {
      const q = question(type, { choices: ['프론트엔드', '백엔드'] });
      expect(validateAnswer(q, '백엔드')).toBeNull();
      expect(validateAnswer(q, '디자인')).toBe('선택지에서 골라 주세요.');
    },
  );

  it('CHECKBOX 는 모두 선택지 안이고 중복이 없어야 한다', () => {
    const q = question('CHECKBOX', { choices: ['월', '화', '수'] });
    expect(validateAnswer(q, ['월', '수'])).toBeNull();
    expect(validateAnswer(q, ['월', '일'])).toBe('선택지에서 골라 주세요.');
    expect(validateAnswer(q, ['월', '월'])).toBe('선택지에서 골라 주세요.');
  });

  it('DATE 는 실제 있는 YYYY-MM-DD 날짜', () => {
    const q = question('DATE');
    expect(validateAnswer(q, '2027-02-20')).toBeNull();
    expect(validateAnswer(q, '2028-02-29')).toBeNull();
    expect(validateAnswer(q, '2027-02-29')).toBe(
      '올바른 날짜를 입력해 주세요.',
    );
    expect(validateAnswer(q, '2027-13-01')).toBe(
      '올바른 날짜를 입력해 주세요.',
    );
    expect(validateAnswer(q, '2027/02/20')).toBe(
      '올바른 날짜를 입력해 주세요.',
    );
  });

  it('NUMBER 는 유한한 숫자', () => {
    const q = question('NUMBER');
    expect(validateAnswer(q, '18')).toBeNull();
    expect(validateAnswer(q, '-1.5')).toBeNull();
    expect(validateAnswer(q, 'abc')).toBe('숫자만 입력해 주세요.');
    expect(validateAnswer(q, 'Infinity')).toBe('숫자만 입력해 주세요.');
  });

  it('URL 은 http:// 또는 https:// 로 시작하고 2048자 이하', () => {
    const q = question('URL');
    expect(validateAnswer(q, 'https://portfolio.example.com/kim')).toBeNull();
    expect(validateAnswer(q, 'http://example.com')).toBeNull();
    expect(validateAnswer(q, 'portfolio.example.com')).toBe(
      'http:// 또는 https:// 로 시작하는 주소를 입력해 주세요.',
    );
    expect(validateAnswer(q, 'ftp://example.com')).toEqual(expect.any(String));
    expect(
      validateAnswer(q, `https://${'a'.repeat(2048 - 'https://'.length + 1)}`),
    ).toBe('2048자 이하로 입력해 주세요.');
  });

  it('IMAGE 는 jpg·jpeg·png·webp 키만 받는다', () => {
    const q = question('IMAGE');
    expect(
      validateAnswer(q, attachment(`${KEY_PREFIX}.png`, '프로필.png')),
    ).toBeNull();
    expect(validateAnswer(q, attachment(`${KEY_PREFIX}.JPEG`))).toBeNull();
    expect(validateAnswer(q, attachment(`${KEY_PREFIX}.pdf`))).toBe(
      'jpg, jpeg, png, webp 파일만 올릴 수 있어요.',
    );
  });

  it('FILE 은 pdf·docx·pptx·hwp·zip 키만 받고 이름은 1~255자', () => {
    const q = question('FILE');
    expect(
      validateAnswer(
        q,
        attachment(`${KEY_PREFIX}.pdf`, '김렛커_이력서_최종.pdf'),
      ),
    ).toBeNull();
    expect(validateAnswer(q, attachment(`${KEY_PREFIX}.png`))).toBe(
      'pdf, docx, pptx, hwp, zip 파일만 올릴 수 있어요.',
    );
    expect(validateAnswer(q, attachment(`${KEY_PREFIX}.zip`, ''))).toEqual(
      expect.any(String),
    );
    expect(
      validateAnswer(q, attachment(`${KEY_PREFIX}.zip`, 'a'.repeat(256))),
    ).toBe('파일 이름은 255자 이하여야 해요.');
  });
});
