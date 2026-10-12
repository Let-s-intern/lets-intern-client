import { act, renderHook } from '@testing-library/react';
import posthog from 'posthog-js';
import {
  useVodPassPurchaseEnabled,
  VOD_PASS_PURCHASE_FLAG,
} from './useVodPassPurchaseEnabled';

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    __loaded: true,
    isFeatureEnabled: jest.fn(),
    onFeatureFlags: jest.fn(),
  },
}));

const mockPosthog = posthog as unknown as {
  __loaded: boolean;
  isFeatureEnabled: jest.Mock;
  onFeatureFlags: jest.Mock;
};

const originalNodeEnv = process.env.NODE_ENV;
function setNodeEnv(value: string) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value,
    configurable: true,
  });
}

let flagCallback: (() => void) | null = null;
const unsubscribe = jest.fn();

beforeEach(() => {
  mockPosthog.__loaded = true;
  mockPosthog.isFeatureEnabled.mockReset().mockReturnValue(undefined);
  unsubscribe.mockReset();
  flagCallback = null;
  mockPosthog.onFeatureFlags
    .mockReset()
    .mockImplementation((cb: () => void) => {
      flagCallback = cb;
      return unsubscribe;
    });
  setNodeEnv('test');
});

afterAll(() => setNodeEnv(originalNodeEnv ?? 'test'));

describe('useVodPassPurchaseEnabled', () => {
  it('플래그 키는 vod-pass-purchase 다', () => {
    expect(VOD_PASS_PURCHASE_FLAG).toBe('vod-pass-purchase');
  });

  it('플래그가 true 이면 켜진다', () => {
    mockPosthog.isFeatureEnabled.mockReturnValue(true);

    const { result } = renderHook(() => useVodPassPurchaseEnabled());

    expect(result.current).toBe(true);
    expect(mockPosthog.isFeatureEnabled).toHaveBeenCalledWith(
      'vod-pass-purchase',
    );
  });

  it('플래그가 false 이면 꺼진다', () => {
    mockPosthog.isFeatureEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useVodPassPurchaseEnabled());

    expect(result.current).toBe(false);
  });

  it('플래그가 정의되지 않았으면(undefined) 운영 빌드에서는 꺼진다', () => {
    setNodeEnv('production');
    mockPosthog.isFeatureEnabled.mockReturnValue(undefined);

    const { result } = renderHook(() => useVodPassPurchaseEnabled());

    expect(result.current).toBe(false);
  });

  it('PostHog 가 초기화되지 않았으면(env 없음) 운영 빌드에서는 꺼지고 구독하지 않는다', () => {
    setNodeEnv('production');
    mockPosthog.__loaded = false;

    const { result } = renderHook(() => useVodPassPurchaseEnabled());

    expect(result.current).toBe(false);
    expect(mockPosthog.onFeatureFlags).not.toHaveBeenCalled();
  });

  it('로컬 개발 서버에서는 플래그가 정의되지 않았어도 켜진다', () => {
    setNodeEnv('development');
    mockPosthog.isFeatureEnabled.mockReturnValue(undefined);

    const { result } = renderHook(() => useVodPassPurchaseEnabled());

    expect(result.current).toBe(true);
  });

  it('로컬 개발 서버에서도 플래그를 명시적으로 false 로 두면 꺼진다', () => {
    setNodeEnv('development');
    mockPosthog.isFeatureEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useVodPassPurchaseEnabled());

    expect(result.current).toBe(false);
  });

  it('로딩 전에는 꺼져 있다가 플래그가 도착하면 켜진다', () => {
    setNodeEnv('production');
    mockPosthog.isFeatureEnabled.mockReturnValue(undefined);

    const { result } = renderHook(() => useVodPassPurchaseEnabled());
    expect(result.current).toBe(false);

    mockPosthog.isFeatureEnabled.mockReturnValue(true);
    act(() => flagCallback?.());

    expect(result.current).toBe(true);
  });

  it('플래그를 다시 끄면 반영돼 꺼진다', () => {
    mockPosthog.isFeatureEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useVodPassPurchaseEnabled());
    expect(result.current).toBe(true);

    mockPosthog.isFeatureEnabled.mockReturnValue(false);
    act(() => flagCallback?.());

    expect(result.current).toBe(false);
  });

  it('언마운트하면 구독을 해제한다', () => {
    const { unmount } = renderHook(() => useVodPassPurchaseEnabled());

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
