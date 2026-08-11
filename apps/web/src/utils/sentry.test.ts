import { classifyNoise } from './sentry';

describe('classifyNoise — webview-bridge', () => {
  it('iOS WKWebView 브리지 접근 실패를 분류한다 (Safari 문구)', () => {
    // 실제로 관측된 형태. /library/46 이벤트 페이지, 인앱 브라우저 유입.
    expect(
      classifyNoise(
        new TypeError(
          "undefined is not an object (evaluating 'window.webkit.messageHandlers')",
        ),
      ),
    ).toBe('webview-bridge');
  });

  it('같은 원인의 Chromium 문구도 분류한다', () => {
    expect(
      classifyNoise(
        new TypeError(
          "Cannot read properties of undefined (reading 'messageHandlers')",
        ),
      ),
    ).toBe('webview-bridge');
  });

  it('React Native WebView 브리지도 분류한다', () => {
    expect(
      classifyNoise(new TypeError('window.ReactNativeWebView is undefined')),
    ).toBe('webview-bridge');
  });
});

describe('classifyNoise — 기존 분류 유지', () => {
  it('번역기 DOM 충돌', () => {
    expect(
      classifyNoise(
        new TypeError("Cannot read property 'removeChild' of null"),
      ),
    ).toBe('translator');
  });

  it('지갑 확장', () => {
    expect(classifyNoise(new Error('MetaMask: user rejected'))).toBe('wallet');
  });

  it('stale chunk', () => {
    const error = new Error('Loading chunk 42 failed');
    error.name = 'ChunkLoadError';
    expect(classifyNoise(error)).toBe('stale-deploy');
  });
});

describe('classifyNoise — 실제 에러는 묻지 않는다', () => {
  it('일반 TypeError 는 노이즈가 아니다', () => {
    expect(
      classifyNoise(
        new TypeError('Cannot read properties of undefined (reading title)'),
      ),
    ).toBeNull();
  });

  it('API 실패 메시지는 노이즈가 아니다', () => {
    expect(classifyNoise(new Error('블로그 조회에 실패했습니다.'))).toBeNull();
  });

  it('"message" 나 "handler" 가 들어간 것만으로는 분류하지 않는다', () => {
    expect(
      classifyNoise(new Error('handler failed to send message')),
    ).toBeNull();
  });
});
