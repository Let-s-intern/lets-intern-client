'use client';

import { useEffect, useState } from 'react';
import MentorProviders from '@/context/MentorProviders';
import { MentorGuard } from './MentorGuard';
import { MentorSidebar } from './MentorSidebar';
import { usePushNotification } from '@/domain/mentor/notification/hooks/usePushNotification';

/** 멘토 전용 manifest를 <head>에 주입 (다른 라우트에 영향 없음) */
function useMentorManifest() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/mentor-manifest.json';
    link.id = 'mentor-manifest';
    document.head.appendChild(link);

    // apple-mobile-web-app 메타
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-capable';
    meta.content = 'yes';
    meta.id = 'mentor-apple-pwa';
    document.head.appendChild(meta);

    return () => {
      document.getElementById('mentor-manifest')?.remove();
      document.getElementById('mentor-apple-pwa')?.remove();
    };
  }, []);
}

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useMentorManifest();
  usePushNotification();

  return (
    <MentorProviders>
      <MentorGuard>
        <div className="flex h-screen overflow-hidden">
          <MentorSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <section className="relative flex-1 overflow-y-auto p-6 md:p-10 lg:p-[60px]">
            {/* Mobile header */}
            <div className="mb-4 flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="text-neutral-10 p-1"
                aria-label="메뉴 열기"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12h18M3 6h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <img
                src="/logo/horizontal-logo.svg"
                alt="Logo"
                className="ml-2 h-5"
              />
            </div>
            {children}
          </section>
        </div>
      </MentorGuard>
    </MentorProviders>
  );
}
