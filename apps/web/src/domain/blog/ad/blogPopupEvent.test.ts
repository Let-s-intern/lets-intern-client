// 어드민 데이터 기반 팝업(`BlogPopup`)이 보내는 이벤트 properties 계약.
// 서버 카운터가 클릭률의 원본이고, 이 이벤트는 세그먼트 분석용이다.
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

describe('BlogPopup 이벤트 properties', () => {
  beforeEach(() => {
    mockCapture.mockClear();
    posthogMock.__loaded = true;
  });

  it('shown: blog_id, popup_id, trigger_ratio', () => {
    captureExperimentEvent(
      BLOG_POPUP_EVENTS.shown,
      { blogId: '42', popupId: 7 },
      { trigger_ratio: 0.6 },
    );

    expect(mockCapture).toHaveBeenCalledWith('blog_popup_shown', {
      blog_id: '42',
      popup_id: 7,
      trigger_ratio: 0.6,
    });
  });

  it('cta_clicked: blog_id, popup_id', () => {
    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      blogId: '42',
      popupId: 7,
    });

    expect(mockCapture).toHaveBeenCalledWith('blog_popup_cta_clicked', {
      blog_id: '42',
      popup_id: 7,
    });
  });

  it('dismissed: blog_id, popup_id, reason', () => {
    captureExperimentEvent(
      BLOG_POPUP_EVENTS.dismissed,
      { blogId: '42', popupId: 7 },
      { reason: DISMISS_REASON.hideDay },
    );

    expect(mockCapture).toHaveBeenCalledWith('blog_popup_dismissed', {
      blog_id: '42',
      popup_id: 7,
      reason: 'hide_day',
    });
  });

  it('variant 를 넘기지 않으면 properties 에 키 자체가 없다', () => {
    captureExperimentEvent(BLOG_POPUP_EVENTS.ctaClicked, {
      blogId: '42',
      popupId: 7,
    });

    const properties = mockCapture.mock.calls[0][1] as Record<string, unknown>;
    expect(Object.keys(properties)).toEqual(['blog_id', 'popup_id']);
    expect('variant' in properties).toBe(false);
  });
});
