import { useEffect, useRef } from 'react';

/**
 * 멘토 마이페이지에서 Web Push 알림 권한 요청 + 서비스 워커 등록.
 *
 * 백엔드 Push 서버가 준비되면 subscription을 서버에 전송하는 로직 추가 필요.
 * 현재는 서비스 워커 등록 + 권한 요청까지만 수행.
 */
export function usePushNotification() {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (registeredRef.current) return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('Notification' in window)) return;

    registeredRef.current = true;

    const register = async () => {
      try {
        // 서비스 워커 등록
        await navigator.serviceWorker.register('/mentor-sw.js', {
          scope: '/mentor',
        });

        // 권한 요청 (이미 granted/denied면 즉시 반환)
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Push notification setup failed:', err);
      }
    };

    register();
  }, []);
}
