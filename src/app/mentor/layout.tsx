'use client';

import MentorProviders from '@/context/MentorProviders';
import { MentorGuard } from './MentorGuard';
import { MentorSidebar } from './MentorSidebar';

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MentorProviders>
      <MentorGuard>
        <div className="flex">
          <MentorSidebar />
          <section className="relative min-h-screen flex-1 p-8">
            {children}
          </section>
        </div>
      </MentorGuard>
    </MentorProviders>
  );
}
