// posthog-js capture/__loaded 를 mocking 해 capture 헬퍼만 단위 검증한다.
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

import {
  BLOG_POPUP_EVENTS,
  captureExperimentEvent,
  DISMISS_REASON,
} from './experiment';

describe('captureExperimentEvent', () => {
  beforeEach(() => {
    mockCapture.mockClear();
    posthogMock.__loaded = true;
  });

  it('CTA: 공통 properties(variant, blog_id)를 붙여 capture 호출', () => {
    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      variant: 'test_100',
      blogId: '42',
    });

    expect(mockCapture).toHaveBeenCalledTimes(1);
    expect(mockCapture).toHaveBeenCalledWith('blog_popup_cta_clicked', {
      variant: 'test_100',
      blog_id: '42',
    });
  });

  it('shown: extra properties(trigger_ratio)를 병합해 capture', () => {
    captureExperimentEvent(
      BLOG_POPUP_EVENTS.shown,
      { variant: 'control', blogId: '7' },
      { trigger_ratio: 0.6 },
    );

    expect(mockCapture).toHaveBeenCalledWith('blog_popup_shown', {
      variant: 'control',
      blog_id: '7',
      trigger_ratio: 0.6,
    });
  });

  it('dismissed: reason 구분(hide_day/close)이 properties에 실린다', () => {
    captureExperimentEvent(
      BLOG_POPUP_EVENTS.dismissed,
      { variant: null, blogId: null },
      { reason: DISMISS_REASON.hideDay },
    );

    expect(mockCapture).toHaveBeenCalledWith('blog_popup_dismissed', {
      variant: null,
      blog_id: null,
      reason: 'hide_day',
    });

    mockCapture.mockClear();

    captureExperimentEvent(
      BLOG_POPUP_EVENTS.dismissed,
      { variant: null, blogId: null },
      { reason: DISMISS_REASON.close },
    );

    expect(mockCapture).toHaveBeenCalledWith('blog_popup_dismissed', {
      variant: null,
      blog_id: null,
      reason: 'close',
    });
  });

  it('SDK 미초기화(__loaded=false) 시 no-op (capture 미호출)', () => {
    posthogMock.__loaded = false;

    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      variant: 'control',
      blogId: '1',
    });

    expect(mockCapture).not.toHaveBeenCalled();
  });
});
