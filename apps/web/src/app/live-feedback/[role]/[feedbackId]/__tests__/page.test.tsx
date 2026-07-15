/**
 * @jest-environment node
 */

const notFoundMock = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
jest.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

jest.mock('@/domain/live-feedback/LiveFeedbackEntryPage', () => ({
  __esModule: true,
  default: ({ feedbackId, role }: { feedbackId: number; role: string }) => ({
    type: 'LiveFeedbackEntryPage',
    feedbackId,
    role,
  }),
}));

import Page from '../page';

describe('live-feedback/[role]/[feedbackId] page', () => {
  beforeEach(() => notFoundMock.mockClear());

  it('역할이 mentor/mentee 가 아니면 notFound 를 호출한다', async () => {
    await expect(
      Page({ params: Promise.resolve({ role: 'admin', feedbackId: '42' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('숫자가 아닌 id는 notFound를 호출한다', async () => {
    await expect(
      Page({ params: Promise.resolve({ role: 'mentor', feedbackId: 'abc' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('정상 역할+id면 컨테이너에 role 과 feedbackId 를 전달한다', async () => {
    const result = (await Page({
      params: Promise.resolve({ role: 'mentor', feedbackId: '42' }),
    })) as unknown as { props: { feedbackId: number; role: string } };
    expect(notFoundMock).not.toHaveBeenCalled();
    expect(result.props.feedbackId).toBe(42);
    expect(result.props.role).toBe('MENTOR');
  });
});
