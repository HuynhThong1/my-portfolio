import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  const isAdmin = session.user.role === 'ADMIN';
  const isEditor = session.user.role === 'EDITOR' || isAdmin;

  if (!isEditor) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
