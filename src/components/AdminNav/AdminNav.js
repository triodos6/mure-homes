'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ExternalLink,
  Layers,
  MessageSquare,
  Calendar,
  ChevronRight,
  Users,
  Coins,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard',     icon: LayoutDashboard, href: '/admin' },
  { name: 'Products',      icon: Package,         href: '/admin/products' },
  { name: 'Currencies',    icon: Coins,           href: '/admin/currencies' },
  { name: 'Brands',        icon: Layers,          href: '/admin/brands' },
  { name: 'Appointments',  icon: Calendar,        href: '/admin/appointments' },
  { name: 'Consultations', icon: MessageSquare,   href: '/admin/consultations' },
  { name: 'Users',         icon: Users,           href: '/admin/users' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable nav items */}
      <div className="flex-1 overflow-y-auto space-y-0.5 pb-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon size={17} className={isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </div>

      {/* Pinned to bottom */}
      <div className="shrink-0 pt-3 border-t border-border">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <ExternalLink size={15} className="opacity-50 group-hover:opacity-100" />
          <span>View Live Site</span>
        </Link>
      </div>
    </div>
  );
}
