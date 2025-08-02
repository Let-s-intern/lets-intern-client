import { useCallback } from 'react';

interface GoogleAnalyticsEvent {
  event: string;
  [key: string]: unknown;
}

interface TrackEventOptions {
  eventName: string;
  eventData: Record<string, unknown>;
}

/**
 * Google Analytics 이벤트 추적을 위한 훅
 *
 * @example
 * ```typescript
 * const { trackEvent } = useGoogleAnalytics();
 *
 * const handleButtonClick = () => {
 *   trackEvent({
 *     eventName: 'button_click',
 *     eventData: {
 *       button_name: 'apply_button',
 *       button_location: 'hero_section',
 *       user_type: 'guest',
 *     }
 *   });
 * };
 * ```
 */
export default function useGoogleAnalytics() {
  /**
   * Google Analytics 이벤트를 추적합니다.
   *
   * @param options - 이벤트 추적 옵션
   * @param options.eventName - 이벤트 이름
   * @param options.eventData - 추가 이벤트 데이터
   */
  const trackEvent = useCallback((options: TrackEventOptions) => {
    const { eventName, eventData = {} } = options;

    const event: GoogleAnalyticsEvent = {
      event: eventName,
      ...eventData,
    };

    // dataLayer에 이벤트 전송
    window.dataLayer?.push(event);
  }, []);

  return trackEvent;
}
