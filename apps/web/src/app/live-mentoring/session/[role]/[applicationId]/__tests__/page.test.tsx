/**
 * @jest-environment node
 */

const notFoundMock = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
jest.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

jest.mock('@/domain/live-mentoring/entry/LiveMentoringEntryPage', () => ({
  __esModule: true,
  default: ({
    applicationId,
    role,
  }: {
    applicationId: number;
    role: string;
  }) => ({
    type: 'LiveMentoringEntryPage',
    applicationId,
    role,
  }),
}));

import Page from '../page';

describe('live-mentoring/[role]/[applicationId] page', () => {
  beforeEach(() => notFoundMock.mockClear());

  it('역할이 mentor/mentee 가 아니면 notFound 를 호출한다', async () => {
    await expect(
      Page({
        params: Promise.resolve({ role: 'admin', applicationId: '42' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('숫자가 아닌 id는 notFound를 호출한다', async () => {
    await expect(
      Page({
        params: Promise.resolve({ role: 'mentor', applicationId: 'abc' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('0 이하 id는 notFound를 호출한다', async () => {
    await expect(
      Page({
        params: Promise.resolve({ role: 'mentor', applicationId: '0' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('정상 역할+id면 컨테이너에 role 과 applicationId 를 전달한다', async () => {
    const result = (await Page({
      params: Promise.resolve({ role: 'mentor', applicationId: '42' }),
    })) as unknown as { props: { applicationId: number; role: string } };
    expect(notFoundMock).not.toHaveBeenCalled();
    expect(result.props.applicationId).toBe(42);
    expect(result.props.role).toBe('MENTOR');
  });
});
