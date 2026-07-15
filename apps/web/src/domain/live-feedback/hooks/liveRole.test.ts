import { parseRoleParam } from './liveRole';

describe('parseRoleParam', () => {
  it('mentor / mentee 경로를 역할로 매핑한다', () => {
    expect(parseRoleParam('mentor')).toBe('MENTOR');
    expect(parseRoleParam('mentee')).toBe('MENTEE');
  });

  it('알 수 없는 값이면 null 을 반환한다', () => {
    expect(parseRoleParam('admin')).toBeNull();
    expect(parseRoleParam('')).toBeNull();
    expect(parseRoleParam('MENTOR')).toBeNull();
  });
});
