import { parseLiveMentoringRoleParam } from './liveMentoringRole';

describe('parseLiveMentoringRoleParam', () => {
  it('mentor / mentee 경로를 역할로 매핑한다', () => {
    expect(parseLiveMentoringRoleParam('mentor')).toBe('MENTOR');
    expect(parseLiveMentoringRoleParam('mentee')).toBe('MENTEE');
  });

  it('알 수 없는 값이면 null 을 반환한다', () => {
    expect(parseLiveMentoringRoleParam('admin')).toBeNull();
    expect(parseLiveMentoringRoleParam('')).toBeNull();
    expect(parseLiveMentoringRoleParam('MENTOR')).toBeNull();
  });
});
