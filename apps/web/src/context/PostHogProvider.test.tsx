import { render } from '@testing-library/react';
import React from 'react';

// posthog-js 를 mocking 해 실제 네트워크/초기화 없이 init 호출만 검증한다.
const mockInit = jest.fn();
jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: (...args: unknown[]) => mockInit(...args),
    // 중복 init 방지 로직(`posthog.__loaded`)이 첫 렌더에서 막지 않도록 false 유지.
    __loaded: false,
  },
}));

import PostHogProvider from './PostHogProvider';

const TEST_KEY = 'phc_test_key';
const TEST_HOST = 'https://us.i.posthog.com';

describe('PostHogProvider', () => {
  beforeEach(() => {
    mockInit.mockClear();
    process.env.NEXT_PUBLIC_POSTHOG_KEY = TEST_KEY;
    process.env.NEXT_PUBLIC_POSTHOG_HOST = TEST_HOST;
  });

  it('마운트/리렌더 시 posthog.init 을 1회만 호출한다', () => {
    const { rerender, unmount } = render(
      <PostHogProvider>
        <div>child</div>
      </PostHogProvider>,
    );

    // 리렌더가 발생해도 init 은 추가로 호출되지 않아야 한다.
    rerender(
      <PostHogProvider>
        <div>child</div>
      </PostHogProvider>,
    );

    expect(mockInit).toHaveBeenCalledTimes(1);
    expect(mockInit).toHaveBeenCalledWith(TEST_KEY, {
      api_host: TEST_HOST,
      defaults: '2026-01-30',
    });

    unmount();
    expect(mockInit).toHaveBeenCalledTimes(1);
  });

  it('key 미설정 시 init 을 호출하지 않는다', () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;

    render(
      <PostHogProvider>
        <div>child</div>
      </PostHogProvider>,
    );

    expect(mockInit).not.toHaveBeenCalled();
  });
});
