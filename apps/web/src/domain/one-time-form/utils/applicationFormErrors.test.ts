import { paidFormFixture } from '../__fixtures__/oneTimeFormFixtures';
import {
  collectFieldErrors,
  hasEmptyRequiredField,
} from './applicationFormErrors';

const { questions } = paidFormFixture;
const APPLICANT = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
};
const REQUIRED_ANSWERS = {
  101: '프론트엔드',
  102: '재직 중',
  104: ['면접 준비'],
  108: '신청 동기',
  110: {
    key: 'one-time-form/attachment/7/0b5c2f4e.pdf',
    name: '이력서.pdf',
  },
};

describe('collectFieldErrors', () => {
  it('필수만 채우면 오류가 없다', () => {
    expect(collectFieldErrors(questions, APPLICANT, REQUIRED_ANSWERS)).toEqual(
      {},
    );
  });

  it('오류 칸을 화면 순서(필수 정보 -> 질문 순서)로 담는다', () => {
    const errors = collectFieldErrors(
      questions,
      { ...APPLICANT, phoneNum: '010-1234' },
      { ...REQUIRED_ANSWERS, 101: undefined, 107: 'example.com' },
    );
    expect(Object.keys(errors)).toEqual([
      'phoneNum',
      'question-101',
      'question-107',
    ]);
  });
});

describe('hasEmptyRequiredField', () => {
  it('필수 정보나 필수 질문이 비면 true', () => {
    expect(hasEmptyRequiredField(questions, APPLICANT, REQUIRED_ANSWERS)).toBe(
      false,
    );
    expect(
      hasEmptyRequiredField(
        questions,
        { ...APPLICANT, email: ' ' },
        REQUIRED_ANSWERS,
      ),
    ).toBe(true);
    expect(
      hasEmptyRequiredField(questions, APPLICANT, {
        ...REQUIRED_ANSWERS,
        104: [],
      }),
    ).toBe(true);
  });

  it('형식 오류만 있고 비어 있지 않으면 false', () => {
    expect(
      hasEmptyRequiredField(
        questions,
        { ...APPLICANT, phoneNum: '010-1234' },
        REQUIRED_ANSWERS,
      ),
    ).toBe(false);
  });
});
