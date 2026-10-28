jest.mock('@/utils/axios', () => ({ __esModule: true, default: {} }));

import { parseMentorApplicationStatusList } from './mentorApplication';

const item = {
  submittedAt: '2026-10-28T14:03:00',
  status: 'REVIEWING',
  expectedReplyDate: '2026-11-04',
};

describe('parseMentorApplicationStatusList', () => {
  it('배열 응답을 그대로 읽고 모르는 필드는 버린다', () => {
    expect(
      parseMentorApplicationStatusList([{ ...item, applicationId: 1 }]),
    ).toEqual([item]);
  });

  it('배열 하나를 감싼 객체 응답도 읽는다', () => {
    expect(
      parseMentorApplicationStatusList({ applicationList: [item] }),
    ).toEqual([item]);
  });

  it('빈 목록을 읽는다', () => {
    expect(parseMentorApplicationStatusList({ applications: [] })).toEqual([]);
  });

  it('예상 회신일이 없어도 읽는다', () => {
    const replied = { ...item, status: 'REPLIED', expectedReplyDate: null };
    expect(parseMentorApplicationStatusList([replied])).toEqual([replied]);
  });

  it('모르는 상태나 목록이 없는 응답은 거절한다', () => {
    expect(() =>
      parseMentorApplicationStatusList([{ ...item, status: 'DONE' }]),
    ).toThrow();
    expect(() => parseMentorApplicationStatusList({ count: 1 })).toThrow();
    expect(() => parseMentorApplicationStatusList(null)).toThrow();
  });
});
