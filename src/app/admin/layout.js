import Link from 'next/link';
import Image from 'next/image';
import AdminNav from '@/components/AdminNav/AdminNav';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from "@/lib/prisma";
import logo from "@/../public/logo.png";
import AdminUserButton from '@/components/AdminNav/AdminUserButton';

// In-memory admin user cache (5 min TTL) to avoid repeated WAN round-trips on every admin page load
const adminUserCache = new Map();
const USER_CACHE_TTL = 5 * 60 * 1000;

async function getCachedAdminUser(userId) {
  if (!userId) return null;
  const cached = adminUserCache.get(userId);
  const now = Date.now();
  if (cached && (now - cached.timestamp < USER_CACHE_TTL)) {
    return cached.data;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, email: true },
  });
  adminUserCache.set(userId, { data: user, timestamp: now });
  return user;
}

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) redirect('/sign-in');
  if (session.role !== 'ADMIN') redirect('/');

  const user = await getCachedAdminUser(session.userId);

  return (
    <div className="flex h-screen bg-secondary/20 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-border flex-shrink-0 overflow-hidden">
        <div className="flex h-16 items-center px-6 pt-2 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="MuraHomes"
              width={120}
              height={40}
              preload={true}
              fetchPriority="high"
              sizes="120px"
              quality={80}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
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
