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
        {/* overflow-x-auto 금지: Lexical 에디터 sticky 툴바가 깨져 화면 밖으로 밀려남 (LC-3059 회귀). 가로 스크롤이 필요한 테이블은 페이지 내부에서 자체 래퍼로 처리. */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AdminGuard>
  );
};
