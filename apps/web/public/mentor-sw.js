/* eslint-disable no-restricted-globals */

// 멘토 마이페이지 서비스 워커 — 푸시 알림 처리

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '새 공지가 도착했습니다';
  const options = {
    body: data.body || '',
    icon: '/logo/logo-symbol.svg',
    badge: '/logo/logo-symbol.svg',
    data: {
      url: data.url || '/mentor/notice',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/mentor/notice';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/mentor') && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});
