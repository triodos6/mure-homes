import Link from 'next/link';
import Image from 'next/image';
import AdminNav from '@/components/AdminNav/AdminNav';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from "@/lib/prisma";
import logo from "@/../public/logo.png";
import AdminUserButton from '@/components/AdminNav/AdminUserButton';

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) redirect('/sign-in');
  if (session.role !== 'ADMIN') redirect('/');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { firstName: true, lastName: true, email: true },
  });

  return (
    <div className="flex h-screen bg-secondary/20 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-border flex-shrink-0 overflow-hidden">
        <div className="flex h-16 items-center px-6 pt-2 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="MuraHomes" width={120} height={40} className="object-contain" style={{ width: 'auto', height: 'auto' }} priority />
          </Link>
          <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Admin</span>
        </div>
        <nav className="flex-1 p-4 overflow-hidden">
          <AdminNav />
        </nav>
      </aside>

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <header className="flex-shrink-0 flex h-16 items-center justify-between border-b border-border bg-white px-8">
          <span className="font-medium text-foreground text-sm">Admin Panel</span>
          <AdminUserButton user={user} />
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
