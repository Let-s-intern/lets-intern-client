import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MentorGuard } from '@/guards/MentorGuard';
import { MentorSidebar } from './MentorSidebar';

/**
 * 멘토 앱의 공용 레이아웃.
 * Guard + Sidebar + Outlet 을 조합한다.
 */
export default function MentorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MentorGuard>
      <div className="flex h-screen overflow-hidden bg-white">
        <MentorSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="border-neutral-80 flex h-14 shrink-0 items-center border-b px-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="메뉴 열기"
              className="text-neutral-40 p-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>
          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </MentorGuard>
  );
}
