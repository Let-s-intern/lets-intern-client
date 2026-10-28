jest.mock('@/utils/axios', () => ({ __esModule: true, default: {} }));

import { parseMentorApplicationStatusList } from './mentorApplication';

const item = {
  submittedAt: '2026-10-28T10:00:05',
  status: 'REVIEWING',
  expectedReplyDate: '2026-11-04',
};

describe('parseMentorApplicationStatusList', () => {
  it('applicationList 를 순서 그대로 꺼내고 모르는 필드는 버린다', () => {
    const older = { ...item, submittedAt: '2026-09-01T09:00:00' };
    expect(
      parseMentorApplicationStatusList({
        applicationList: [{ ...item, applicationId: 1 }, older],
      }),
    ).toEqual([item, older]);
  });

  it('빈 목록을 읽는다', () => {
    expect(parseMentorApplicationStatusList({ applicationList: [] })).toEqual(
      [],
    );
  });

  it('예상 회신일이 없어도 읽는다', () => {
    const replied = { ...item, status: 'REPLIED', expectedReplyDate: null };
    expect(
      parseMentorApplicationStatusList({ applicationList: [replied] }),
    ).toEqual([replied]);
  });

  it('모르는 상태나 applicationList 가 없는 응답은 거절한다', () => {
    expect(() =>
      parseMentorApplicationStatusList({
        applicationList: [{ ...item, status: 'DONE' }],
      }),
    ).toThrow();
    expect(() => parseMentorApplicationStatusList([item])).toThrow();
    expect(() => parseMentorApplicationStatusList(null)).toThrow();
  });
});
