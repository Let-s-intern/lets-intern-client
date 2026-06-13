import { resolveMyRole } from './resolveMyRole';

describe('resolveMyRole', () => {
  it('null/undefined 입력은 null', () => {
    expect(resolveMyRole(null)).toBeNull();
    expect(resolveMyRole(undefined)).toBeNull();
  });

  it('myRole이 있으면 그대로 매핑한다', () => {
    expect(resolveMyRole({ myRole: 'MENTOR' })).toBe('MENTOR');
    expect(resolveMyRole({ myRole: 'MENTEE' })).toBe('MENTEE');
  });

  it('myRole이 없으면(BE 미정) null 스텁', () => {
    expect(resolveMyRole({ feedbackId: 1, startDate: 'x' })).toBeNull();
    expect(resolveMyRole({ myRole: null })).toBeNull();
  });
});
