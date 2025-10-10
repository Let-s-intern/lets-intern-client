import AdminProviders from '@/context/AdminProviders';
import { AdminGuard } from './AdminGuard';
import { AdminSidebar } from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <AdminGuard>
        <div className="flex">
          <AdminSidebar />
          <section className="relative min-h-screen min-w-[800px] flex-1">
            {children}
          </section>
        </div>
      </AdminGuard>
    </AdminProviders>
  );
}
