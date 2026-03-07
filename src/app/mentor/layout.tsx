'use client';

import { useState } from 'react';
import MentorProviders from '@/context/MentorProviders';
import { MentorGuard } from './MentorGuard';
import { MentorSidebar } from './MentorSidebar';

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MentorProviders>
      <MentorGuard>
        <div className="flex">
          <MentorSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <section className="relative min-h-screen flex-1 p-6 md:p-10 lg:p-[60px]">
            {/* Mobile header */}
            <div className="mb-4 flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-1 text-neutral-10"
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
