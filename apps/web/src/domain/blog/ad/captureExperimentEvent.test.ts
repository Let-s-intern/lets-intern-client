// posthog-js capture/__loaded 를 mocking 해 capture 헬퍼만 단위 검증한다.
// properties 구성은 `blogPopupEvent.test.ts` 가 덮는다. 여기는 SDK 미초기화 폴백만 본다.
const mockCapture = jest.fn();
const posthogMock = {
  capture: (...args: unknown[]) => mockCapture(...args),
  __loaded: true as boolean,
};
jest.mock('posthog-js', () => ({
  __esModule: true,
  get default() {
    return posthogMock;
  },
}));

import { BLOG_POPUP_EVENTS, captureExperimentEvent } from './experiment';

describe('captureExperimentEvent', () => {
  beforeEach(() => {
    mockCapture.mockClear();
    posthogMock.__loaded = true;
  });

  it('SDK 미초기화(__loaded=false) 시 no-op (capture 미호출)', () => {
    posthogMock.__loaded = false;

    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      blogId: '1',
      popupId: 7,
    });

    expect(mockCapture).not.toHaveBeenCalled();
  });
});
