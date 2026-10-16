import { ProgramTypeEnum } from './schema';

describe('ProgramTypeEnum', () => {
  it('VOD 이용권(VOD_PASS) 값을 받는다', () => {
    expect(ProgramTypeEnum.parse('VOD_PASS')).toBe('VOD_PASS');
  });

  it.each([
    'CHALLENGE',
    'LIVE',
    'LIVE_MENTORING',
    'VOD',
    'REPORT',
    'GUIDEBOOK',
  ])('기존 값 %s 은 그대로 받는다', (value) => {
    expect(ProgramTypeEnum.parse(value)).toBe(value);
  });

  it('모르는 값은 여전히 거절한다', () => {
    expect(ProgramTypeEnum.safeParse('UNKNOWN_TYPE').success).toBe(false);
  });
});
