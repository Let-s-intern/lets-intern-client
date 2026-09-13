import { isVersionSelectRequired } from './challengeVersion';

const VERSION_LIST = [
  { challengeVersionId: 1, title: '대학생', sortOrder: 1 },
  { challengeVersionId: 2, title: '이직자', sortOrder: 2 },
];

describe('isVersionSelectRequired', () => {
  it('버전을 등록하지 않은 챌린지는 묻지 않는다', () => {
    expect(isVersionSelectRequired([], 'BASIC')).toBe(false);
  });

  it('LIGHT 는 버전이 있어도 묻지 않는다', () => {
    expect(isVersionSelectRequired(VERSION_LIST, 'LIGHT')).toBe(false);
  });

  it.each(['BASIC', 'STANDARD', 'PREMIUM'] as const)(
    '버전이 있고 %s 이면 묻는다',
    (planType) => {
      expect(isVersionSelectRequired(VERSION_LIST, planType)).toBe(true);
    },
  );

  it('플랜 타입이 비어 있는 가격은 LIGHT 가 아니므로 묻는다', () => {
    expect(isVersionSelectRequired(VERSION_LIST, null)).toBe(true);
  });
});
