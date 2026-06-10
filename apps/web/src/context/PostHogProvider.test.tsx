import { render } from '@testing-library/react';
import posthog from 'posthog-js';
import React from 'react';

// posthog-js 를 mocking 해 실제 네트워크/초기화 없이 init 호출만 검증한다.
// init 이 호출되면 실제처럼 __loaded 를 true 로 바꿔, 중복 init 방지(posthog.__loaded)를 재현한다.
// 팩토리 내부에 목을 정의해 호이스팅(TDZ) 문제를 피하고, 아래에서 import 로 꺼내 쓴다.
jest.mock('posthog-js', () => {
  const mock = {
    init: jest.fn(() => {
      mock.__loaded = true;
    }),
    __loaded: false,
  };
  return { __esModule: true, default: mock };
});

import PostHogProvider from './PostHogProvider';

// 모킹된 posthog 인스턴스 (init: jest.Mock, __loaded 쓰기 가능)
const mockPosthog = posthog as unknown as {
  init: jest.Mock;
  __loaded: boolean;
};

const TEST_KEY = 'phc_test_key';
const TEST_HOST = 'https://us.i.posthog.com';

describe('PostHogProvider', () => {
  beforeEach(() => {
    mockPosthog.init.mockClear();
    mockPosthog.__loaded = false;
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

    expect(mockPosthog.init).toHaveBeenCalledTimes(1);
    expect(mockPosthog.init).toHaveBeenCalledWith(TEST_KEY, {
      api_host: TEST_HOST,
      defaults: '2026-01-30',
      session_recording: { maskAllInputs: true },
    });

    unmount();
    expect(mockPosthog.init).toHaveBeenCalledTimes(1);
  });

  it('key 미설정 시 init 을 호출하지 않는다', () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;

    render(
      <PostHogProvider>
        <div>child</div>
      </PostHogProvider>,
    );

    expect(mockPosthog.init).not.toHaveBeenCalled();
  });
});
