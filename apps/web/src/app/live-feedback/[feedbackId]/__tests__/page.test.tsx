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
  default: ({ feedbackId }: { feedbackId: number }) => ({
    type: 'LiveFeedbackEntryPage',
    feedbackId,
  }),
}));

import Page from '../page';

describe('live-feedback/[feedbackId] page', () => {
  beforeEach(() => notFoundMock.mockClear());

  it('숫자가 아닌 id는 notFound를 호출한다', async () => {
    await expect(
      Page({ params: Promise.resolve({ feedbackId: 'abc' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('0 이하 id는 notFound를 호출한다', async () => {
    await expect(
      Page({ params: Promise.resolve({ feedbackId: '0' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
  });

  it('정상 id면 컨테이너를 해당 feedbackId로 렌더한다', async () => {
    const result = (await Page({
      params: Promise.resolve({ feedbackId: '42' }),
    })) as unknown as { props: { feedbackId: number } };
    expect(notFoundMock).not.toHaveBeenCalled();
    expect(result.props.feedbackId).toBe(42);
  });
});
