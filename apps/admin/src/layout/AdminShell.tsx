import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import TestSidebar from '@/domain/admin/dev-test/TestSidebar';
import { AdminGuard } from '@/guards/AdminGuard';
import { AdminSidebar } from '@/layout/AdminSidebar';

interface AdminShellProps {
  children: ReactNode;
}

/** 모든 어드민 라우트의 공통 레이아웃. AdminGuard + AdminSidebar + Outlet/children */
export const AdminShell = ({ children }: AdminShellProps) => {
  const { pathname } = useLocation();
  // /test 아래는 개발자 테스트 전용 사이드바로 바꾼다. 어드민 사이드바에는 링크를 두지 않는다
  const isDevTest = pathname === '/test' || pathname.startsWith('/test/');

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {isDevTest ? <TestSidebar /> : <AdminSidebar />}
        {/* overflow-x-auto 금지: Lexical 에디터 sticky 툴바가 깨져 화면 밖으로 밀려남 (LC-3059 회귀). 가로 스크롤이 필요한 테이블은 페이지 내부에서 자체 래퍼로 처리. */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AdminGuard>
  );
};
