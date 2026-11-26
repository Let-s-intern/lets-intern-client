jest.mock('@/domain/mentors/MentorsListPage', () => () => null);

import { metadata } from './page';

describe('/mentors 메타데이터', () => {
  it('canonical 이 홈이 아니라 자기 자신이다', () => {
    expect(String(metadata.alternates?.canonical)).toMatch(/\/mentors$/);
  });

  it('검색어를 앞에 둔 title 을 쓴다', () => {
    expect(String(metadata.title)).toMatch(/^현직자 멘토/);
  });
});
