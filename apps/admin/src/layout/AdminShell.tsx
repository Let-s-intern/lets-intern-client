import { ReactNode } from 'react';
import { AdminGuard } from '@/guards/AdminGuard';
import { AdminSidebar } from '@/layout/AdminSidebar';

interface AdminShellProps {
  children: ReactNode;
}

/** 모든 어드민 라우트의 공통 레이아웃. AdminGuard + AdminSidebar + Outlet/children */
export const AdminShell = ({ children }: AdminShellProps) => {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-x-auto">{children}</main>
      </div>
    </AdminGuard>
  );
};
